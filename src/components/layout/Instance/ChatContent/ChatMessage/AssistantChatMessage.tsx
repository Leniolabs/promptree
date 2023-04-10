import React from "react";
import styles from "../Chat.module.scss";
import { IconButton } from "@/components/buttons";
import { BranchIcon } from "@/components/icons/BranchIcon";
import { className } from "@/utils/classname";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { CodeHighlighter } from "../CodeHighlighter";
import { OpenAIIcon } from "@/components/icons/OpenAIIcon";
import { IMessage } from "@/types/chat";

const components = {
  code: CodeHighlighter,
};

export function AssistantChatMessage(props: {
  message: IMessage;
  onBranch?: () => void;
}) {
  const content = React.useMemo(() => {
    return (props.message.content || "")
      .replaceAll("```", "\n```\n")
      .replaceAll("\n\n```", "\n```")
      .replaceAll("```\n\n", "```\n");
  }, [props.message.content]);

  return (
    <div className={styles.chatMessageWrapper}>
      <div className={styles.chatMessageIcon}>
        <OpenAIIcon />
      </div>
      <div className={styles.chatMessageContent}>
        <div className={className(styles.markdown, styles.prose)}>
          <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
      </div>
      <div className={styles.chatMessageControls}>
        {props.onBranch && (
          <IconButton icon={<BranchIcon />} onClick={props.onBranch} />
        )}
      </div>
    </div>
  );
}
