import React from "react";
import styles from "./Instance.module.scss";
import { className } from "@/utils/classname";
import { IInstance, IInstanceConfig } from "@/types/api";
import { InstanceInput } from "./Input";
import { Tree } from "./Tree";
import { ChatContent } from "./ChatContent";
import { IMessage } from "@/types/chat";

export function Instance(
  props: React.PropsWithChildren<{
    title?: IInstance["title"];
    messages?: IInstance["messages"];
    commits?: IInstance["commits"];

    refHash?: IInstance["refHash"];
    refBranch?: IInstance["refBranch"];

    branches?: IInstance["branches"];
    onMessage?: (message: string) => void;
    onMessageChange?: (message: IMessage, createBranchName?: string) => void;

    onRegenerate?: () => void;

    onNewBranch?: (hash: string) => void;
    onTrack?: (ref: string) => void;

    onFork?: () => void;

    locked?: boolean;

    onMerge?: (ref?: string) => void;
    onMergeSquash?: (ref?: string) => void;

    config?: IInstanceConfig;
    onConfigChange?: (value: IInstanceConfig) => void;
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
            locked={props.locked}
          />
        )}
      </div>
      {props.commits && props.refHash && props.refBranch && (
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
          config={props.config}
          onConfigChange={props.onConfigChange}
          onFork={props.onFork}
        />
      )}
    </div>
  );
}
