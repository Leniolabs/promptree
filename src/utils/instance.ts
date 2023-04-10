import { getResponse } from "@/ai/openai";
import { IInstance } from "@/types/api";
import { INode, IMessage, ISquashResponse, IReference } from "../types/chat";
import { getId } from "./uuid";

export function createMessageNode(
  author: IMessage["author"],
  content: IMessage["content"],
  parents?: string[]
): INode {
  return {
    id: getId(),
    date: new Date(),
    type: "message",
    parents: parents || [],
    content: {
      author,
      content,
    },
  };
}

export function addNode(instance: IInstance, message: INode): IInstance {
  return {
    ...instance,
    nodes: [...instance.nodes, message],
  };
}

export function getBranchNodes(nodes: INode[], pointerId?: string) {
  // A helper function to find a node by its ID
  function findNodeById(id: string): INode | undefined {
    return nodes.find((node) => node.id === id);
  }

  if (!pointerId) return nodes;
  const pointer = findNodeById(pointerId);
  if (!pointer) return nodes;

  // The base case for the recursion: if the current node has no parents, return an array containing just the current node
  if (pointer.parents.length === 0) {
    return [pointer];
  }

  if (pointer.type === "merge") {
    let result: INode[] = [];
    const mergedNodes = pointer.merged.map((id) =>
      nodes.find((n) => n.id === id)
    ) as INode[];

    const trunkParentId = pointer.parents.find(
      (p) => !pointer.merged.find((id) => id === p)
    );

    if (trunkParentId) {
      const parentNode = findNodeById(trunkParentId);
      if (parentNode) {
        result = [...getBranchNodes(nodes, parentNode.id), ...mergedNodes];
      }
    }
  }

  // Recursively traverse the parents and flatten the resulting arrays
  let result: INode[] = [];
  for (const parentId of pointer.parents) {
    const parentNode = findNodeById(parentId);
    if (parentNode) {
      result = [...getBranchNodes(nodes, parentNode.id), ...result];
    }
  }

  // Include the current node in the result
  return [...result, pointer];
}

export function updateReferences(
  node: INode,
  references: IReference[],
  pointerId?: string
): IReference[] {
  const pointerReference = references.find((ref) => ref.nodeId === pointerId);

  if (pointerReference) {
    return references.map((ref) => {
      if (ref.nodeId === pointerReference.nodeId) {
        return { ...ref, nodeId: node.id };
      }
      return ref;
    });
  }
  return references;
}

export function getChildrenNodes(nodes: INode[], nodeId: string): INode[] {
  let result: INode[] = [];

  const childs = nodes.filter((n) => n.parents.includes(nodeId));
  childs.forEach((child) => {
    result = [...result, child, ...getChildrenNodes(nodes, child.id)];
  });

  return result;
}

export function getTrunkParent(nodes: INode[], node: INode): INode | undefined {
  if (node.parents.length === 0) return undefined;
  if (node.type === "merge") {
    const parents = nodes.filter((n) => node.parents.includes(n.id));
    return parents.find((p) => !node.merged.includes(p.id));
  }
  return nodes.find((n) => n.id === node.parents[0]);
}

function rewindReference(
  reference: IReference,
  nodes: INode[],
  removedNodes: INode[]
): IReference {
  if (!removedNodes.length) return reference;

  const removedReferenceNode = removedNodes.find(
    (node) => node.id === reference.nodeId
  );

  if (removedReferenceNode) {
    const trunkParent = getTrunkParent(nodes, removedReferenceNode);
    if (trunkParent)
      return rewindReference(
        {
          ...reference,
          nodeId: trunkParent.id,
        },
        nodes,
        removedNodes
      );
  }

  return reference;
}

export function updateUserNode(
  nodes: INode[],
  references: IReference[],
  nodeId: string,
  content: string
): {
  nodes: INode[];
  references: IReference[];
} {
  const node = nodes.find((node) => node.id === nodeId);
  if (!node) return { nodes, references };

  const childNodes = getChildrenNodes(nodes, nodeId);

  const keptNodes = nodes.filter(
    (node) => !childNodes.find((cn) => cn.id === node.id)
  );

  const updatedRefs = references.map((ref) =>
    rewindReference(ref, nodes, childNodes)
  );

  return {
    nodes: keptNodes.map((n) => {
      if (n.id === nodeId && n.type === "message") {
        return {
          ...n,
          content: {
            ...n.content,
            content,
          },
        };
      }
      return n;
    }),
    references: updatedRefs,
  };
}

export function createMergeNode(
  nodes: INode[],
  fromPointer: string,
  toPointer: string
): INode {
  const fromNodes = getBranchNodes(nodes, fromPointer);
  const toNodes = getBranchNodes(nodes, toPointer);

  const difference = fromNodes.filter(
    (fn) => !toNodes.find((tn) => tn.id === fn.id)
  );

  return {
    id: getId(),
    date: new Date(),
    type: "merge",
    parents: [toPointer, fromPointer],
    merged: difference.map((n) => n.id),
  };
}

const squashSystemTemplate = `You are an expert on text summarization, code and JSON format.
You are going to summarize the conversation that the user is going to send you in the following format:

CONVERSATION:
--------
- USER: {content}

- ASSISTANT: {content}
--------
...more messages...

into a string containing a summary of what the USER wanted, and a string containing a summary of the result that the ASSISTANT provided.
The USER summary should be only the question or the description of the issue, without any kind of personality.
The summary should have enough information to not having to go back to the previous conversation.
If any code was generated by the ASSISTANT, preserve the correct version of it with the proper markdown format.

IMPORTANT: You are only allowed to reply using only one object in the following JSON format:

\`\`\`
{
   "user": string,
   "assistant": string,
}
\`\`\`

It's really important that you use the previous JSON format.
You cannot write text outside the JSON.`;

export async function squashNodes(nodes: INode[]): Promise<INode[]> {
  let response: ISquashResponse = {
    user: "",
    assistant: "",
  };

  try {
    response = JSON.parse(
      (
        await getResponse([
          { role: "system", content: squashSystemTemplate },
          {
            role: "user",
            content: nodes.reduce((content, node) => {
              if (node.type === "message")
                content += `- ${node.content.author}: ${node.content.content}\n`;
              return content;
            }, ""),
          },
        ])
      )?.content || ""
    );
  } catch (err) {}

  return [
    createMessageNode("user", response.user),
    createMessageNode("assistant", response.assistant),
  ];
}

const getChatTitleTemplate = `You are a title generation tool.
You are going to generate a title based on the conversation that the user is going to send you in the following format:

CONVERSATION:
--------
- USER: {content}

- ASSISTANT: {content}
--------
...more messages...

IMPORTANT: You can just provide a title of maximum 20 characters without quotes`;

export async function createInstanceTitle(nodes: INode[]): Promise<string> {
  let title = "";

  try {
    title = (
      (
        await getResponse([
          { role: "system", content: getChatTitleTemplate },
          {
            role: "user",
            content: nodes.reduce((content, node) => {
              if (node.type === "message")
                content += `- ${node.content.author}: ${node.content.content}\n`;
              return content;
            }, ""),
          },
        ])
      )?.content || ""
    ).replaceAll('"', "");
  } catch (err) {}

  return title;
}
