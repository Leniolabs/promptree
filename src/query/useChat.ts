import { getResponse } from "@/ai/openai";
import { IInstance } from "@/types/api";
import { INode, IMessage } from "@/types/chat";
import {
  addNode,
  createMessageNode,
  getBranchNodes,
  createInstanceTitle,
  squashNodes,
  updateReferences,
  updateUserNode,
  createMergeNode,
} from "@/utils/instance";
import { getId } from "@/utils/uuid";
import { Instance } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import React from "react";
import { useInstance, useInstances } from "./useInstances";

export function useCreateChat(onCreate?: (instance: IInstance) => void) {
  const { createAsync } = useInstances();
  const [nodes, setNodes] = React.useState<IInstance["nodes"]>([]);

  const send = React.useCallback(
    (content: string) => {
      const userMessage = createMessageNode("user", content);

      setNodes([userMessage]);

      const currentMessageList = (
        userMessage.type === "message"
          ? [
              {
                role: userMessage.content.author,
                content: userMessage.content.content,
              },
            ]
          : []
      ) as ChatCompletionRequestMessage[];

      getResponse(currentMessageList).then(async (response) => {
        if (response) {
          const assistantMessage = createMessageNode(
            "assistant",
            response.content,
            [userMessage.id]
          );

          const title = await createInstanceTitle([
            userMessage,
            assistantMessage,
          ]);

          createAsync({
            mode: "chat",
            nodes: [userMessage, assistantMessage],
            references: [{ name: "master", nodeId: assistantMessage.id }],
            title,
            pointer: assistantMessage.id,
          }).then((created) => {
            onCreate?.(created);
            setNodes([userMessage, assistantMessage]);
          });
        }
      });
    },
    [onCreate]
  );

  return {
    nodes,
    send,
  };
}

export function useChat(id: Instance["id"]) {
  const { data: instance, updateAsync, updateLocal } = useInstance(id);

  const pointer = React.useMemo(() => {
    if (instance && instance.pointer)
      return instance?.nodes.find((row) => row.id === instance.pointer);
    return undefined;
  }, [instance]);

  const branchNodes = React.useMemo(() => {
    if (instance && pointer) return getBranchNodes(instance.nodes, pointer.id);
    return [];
  }, [instance, pointer]);

  const pointerInstance = React.useMemo(() => {
    return {
      ...instance,
      nodes: branchNodes,
    };
  }, [instance, branchNodes]);

  const send = React.useCallback(
    (content: string) => {
      if (instance) {
        const userNode = createMessageNode(
          "user",
          content,
          pointer?.id ? [pointer?.id] : undefined
        );

        let nodes = [...instance.nodes, userNode];
        let references = updateReferences(
          userNode,
          instance.references,
          pointer?.id || undefined
        );

        updateLocal({
          nodes,
          references,
          pointer: userNode.id,
        });

        const currentMessageList = getBranchNodes(nodes, userNode.id).map(
          (node) => {
            if (node.type === "message")
              return {
                role: node.content.author,
                content: node.content.content,
              };
            return false;
          }
        ) as ChatCompletionRequestMessage[];

        getResponse(currentMessageList).then((response) => {
          if (response) {
            const assistantNode = createMessageNode(
              "assistant",
              response.content,
              [userNode.id]
            );

            nodes = [...nodes, assistantNode];

            references = updateReferences(
              assistantNode,
              references,
              userNode.id
            );

            updateAsync(id, {
              nodes,
              references,
              pointer: assistantNode.id,
            });

            updateLocal({
              nodes,
              references,
              pointer: assistantNode.id,
            });
          }
        });
      }
    },
    [instance, pointer]
  );

  const modifyUserNode = React.useCallback(
    (nodeId: string, content: string) => {
      if (instance) {
        let { nodes, references } = updateUserNode(
          instance.nodes,
          instance.references,
          nodeId,
          content
        );

        updateLocal({
          nodes,
          references,
          pointer: nodeId,
        });

        const currentMessageList = getBranchNodes(nodes, nodeId).map((node) => {
          if (node.type === "message")
            return {
              role: node.content.author,
              content: node.content.content,
            };
          return false;
        }) as ChatCompletionRequestMessage[];

        getResponse(currentMessageList).then((response) => {
          if (response) {
            const assistantNode = createMessageNode(
              "assistant",
              response.content,
              [nodeId]
            );

            nodes = [...nodes, assistantNode];

            references = updateReferences(assistantNode, references, nodeId);

            updateAsync(id, {
              nodes,
              references,
              pointer: assistantNode.id,
            });

            updateLocal({
              nodes,
              references,
              pointer: assistantNode.id,
            });
          }
        });
      }
    },
    [instance]
  );

  const regenerateLastNode = React.useCallback(() => {
    if (instance && pointer) {
      //aca hay que regenerar el nodo anterior
      //pero si el pointer esta en cualquier tenes q eliminar todo lo siguiente
      let nodes = instance.nodes.slice(0, instance.nodes.length - 1);

      const lastNode = nodes[nodes.length - 1];
      let references = updateReferences(
        lastNode,
        instance.references,
        pointer?.id || undefined
      );

      updateLocal({
        nodes,
        pointer: lastNode.id,
        references,
      });

      const currentMessageList = getBranchNodes(nodes, lastNode.id).map(
        (node) => {
          if (node.type === "message")
            return {
              role: node.content.author,
              content: node.content.content,
            };
          return false;
        }
      ) as ChatCompletionRequestMessage[];

      getResponse(currentMessageList).then((response) => {
        if (response) {
          const assistantNode = createMessageNode(
            "assistant",
            response.content,
            [lastNode.id]
          );

          nodes = [...nodes, assistantNode];

          references = updateReferences(assistantNode, references, lastNode.id);

          updateAsync(id, {
            nodes,
            references,
            pointer: assistantNode.id,
          });

          updateLocal({
            nodes,
            references,
            pointer: assistantNode.id,
          });
        }
      });
    }
  }, [instance, pointer]);

  const replaceNodes = React.useCallback(
    (nodes: INode[]) => {
      if (instance) {
        updateLocal({ nodes });

        updateAsync(id, {
          nodes,
        });
      }
    },
    [instance]
  );

  const checkoutNode = React.useCallback(
    (node: INode) => {
      if (instance && instance.id) {
        updateLocal({ pointer: node.id });
        updateAsync(id, { pointer: node.id });
      }
    },
    [instance]
  );

  const merge = React.useCallback(
    (fromPointer: string, toPointer: string) => {
      if (instance) {
        const node = createMergeNode(instance.nodes, fromPointer, toPointer);
        console.log('mergeNode', node)
        updateLocal({
          nodes: [...instance.nodes, node],
          pointer: node.id,
        });
      }
    },
    [instance]
  );

  return {
    instance: pointerInstance as IInstance,
    pointer,
    tree: instance?.nodes || [],
    send,
    merge,
    modifyUserNode,
    replaceNodes,
    regenerateLastNode,
    checkoutNode,
  };
}

export function useSquashChat(instance: IInstance) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [nodes, setNodes] = React.useState<IInstance["nodes"]>([]);

  const retry = React.useCallback(() => {
    setIsLoading(true);
    setNodes([]);
    squashNodes(instance.nodes || []).then((response) => {
      setNodes(response);
      setIsLoading(false);
    });
  }, []);

  React.useEffect(() => {
    retry();
  }, [retry]);

  return {
    instance: {
      ...instance,
      nodes,
    },
    isLoading,
    retry,
  };
}