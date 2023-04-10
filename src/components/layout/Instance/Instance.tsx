import React from "react";
import styles from "./Instance.module.scss";
import { className } from "@/utils/classname";
import { IInstance, ITemplate } from "@/types/api";
import { INode, IReference } from "@/types/chat";
import { InstanceInput, InstanceTemplateInput } from "./Input";
import { Tree } from "./Tree";
import { ChatContent } from "./ChatContent";

export function Instance(
  props: React.PropsWithChildren<{
    title?: IInstance["title"];
    nodes?: IInstance["nodes"];
    references?: IReference[];
    tree?: INode[];
    pointer?: INode;
    template?: ITemplate;
    onMessage?: (node: string) => void;
    onNodeChange?: (node: INode) => void;
    onSquash?: () => void;
    onMerge?: (squash?: boolean) => void;
    onRegenerate?: () => void;
    onBranch?: (message: INode) => void;
  }>
) {
  return (
    <div
      className={className(
        styles.instanceWrapper,
        props.tree && styles.hasTree
      )}
    >
      <div className={styles.instanceChatWrapper}>
        <ChatContent
          nodes={props.nodes}
          title={props.title}
          onNodeChange={props.onNodeChange}
          onBranch={props.onBranch}
        />
        {!props.template && props.onMessage && (
          <InstanceInput
            onSend={props.onMessage}
            onRegenerate={props.onRegenerate}
            onSquash={props.onSquash}
            onMerge={props.onMerge}
          />
        )}
        {props.template && props.onMessage && (
          <InstanceTemplateInput
            template={props.template}
            onSend={props.onMessage}
          />
        )}
      </div>
      {props.tree && props.pointer && (
        <Tree
          branchNodes={props.nodes || []}
          nodes={props.tree}
          pointer={props.pointer}
          references={props.references || []}
          width={150}
          height={1000}
          onNodeClick={props.onBranch}
        />
      )}
    </div>
  );
}
