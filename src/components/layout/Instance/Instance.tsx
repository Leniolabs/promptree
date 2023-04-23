import React from "react";
import styles from "./Instance.module.scss";
import { className } from "@/utils/classname";
import { IInstance } from "@/types/api";
import { InstanceInput } from "./Input";
import { Tree } from "./Tree";
import { ChatContent } from "./ChatContent";
import { IMessage } from "@/types/chat";

export function Instance(
  props: React.PropsWithChildren<{
    title?: IInstance["title"];
    messages?: IInstance["messages"];
    commits?: IInstance["commits"];

    refHash: IInstance["refHash"];
    refBranch: IInstance["refBranch"];

    branches?: IInstance["branches"];
    onMessage?: (message: string) => void;
    onMessageChange?: (message: IMessage) => void;

    onRegenerate?: () => void;

    onNewBranch?: (hash: string) => void;
    onTrack?: (ref: string) => void;

    onMerge?: (ref?: string) => void;
    onMergeSquash?: (ref?: string) => void;
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
          onNewBranch={props.onNewBranch}
        />
        {props.onMessage && (
          <InstanceInput
            onSend={props.onMessage}
            onRegenerate={props.onRegenerate}
            onMerge={props.onMerge}
            onMergeSquash={props.onMergeSquash}
          />
        )}
      </div>
      {props.commits && props.refHash && (
        <Tree
          commits={props.commits}
          refHash={props.refHash}
          refBranch={props.refBranch}
          branches={props.branches || []}
          width={300}
          height={1000}
          onNewBranch={props.onNewBranch}
          onTrack={props.onTrack}
          onMerge={props.onMerge}
          onMergeSquash={props.onMergeSquash}
        />
      )}
    </div>
  );
}
