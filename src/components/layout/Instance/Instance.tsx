import React from "react";
import styles from "./Instance.module.scss";
import { className } from "@/utils/classname";
import { IInstance, ITemplate } from "@/types/api";
import { InstanceInput } from "./Input";
import { Tree } from "./Tree";
import { ChatContent } from "./ChatContent";
import { ICommit, IMessage } from "@/types/chat";

export function Instance(
  props: React.PropsWithChildren<{
    title?: IInstance["title"];
    messages?: IInstance["messages"];
    commits?: IInstance["commits"];
    pointer?: IInstance["ref"];
    branches?: IInstance["branches"];
    template?: ITemplate;
    onMessage?: (message: string) => void;
    onMessageChange?: (message: IMessage) => void;
    onSquash?: () => void;
    onMerge?: (squash?: boolean) => void;
    onRegenerate?: () => void;
    onTrack?: (ref: string) => void;
    onBranchCreate?: (ref: string) => void;
  }>
) {
  return (
    <div
      className={className(
        styles.instanceWrapper,
        props.commits && styles.hasTree
      )}
    >
      <div className={styles.instanceChatWrapper}>
        <ChatContent
          title={props.title}
          messages={props.messages}
          onMessageChange={props.onMessageChange}
          onBranch={props.onBranchCreate}
        />
        {!props.template && props.onMessage && (
          <InstanceInput
            onSend={props.onMessage}
            onRegenerate={props.onRegenerate}
            onSquash={props.onSquash}
            onMerge={props.onMerge}
          />
        )}
      </div>
      {props.commits && props.pointer && (
        <Tree
          commits={props.commits}
          pointer={props.pointer}
          branches={props.branches || []}
          width={300}
          height={1000}
          onCommitDoubleClick={props.onTrack}
        />
      )}
    </div>
  );
}
