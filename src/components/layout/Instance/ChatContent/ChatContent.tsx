import { IMessage } from "@/types/chat";
import { ChatMessage } from "./ChatMessage/ChatMessage";
import styles from "./Chat.module.scss";
import React from "react";
import { className } from "@/utils/classname";
import { useScrollToBottom } from "@/hooks";

export function ChatContent(
  props: React.PropsWithChildren<{
    className?: string;
    title?: string;
    messages?: IMessage[];
    onMessageChange?: (message: IMessage) => void;
    onNewBranch?: (hash: string) => void;
  }>
) {
  const containerRef = useScrollToBottom<HTMLDivElement>(props.messages);

  return (
    <div
      ref={containerRef}
      className={className(styles.chatContent, props.className)}
    >
      <div className={styles.chatMessages}>
        {props.title && <div className={styles.chatTitle}>{props.title}</div>}
        {props.messages?.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onChange={props.onMessageChange}
            onNewBranch={props.onNewBranch}
          />
        ))}
      </div>
    </div>
  );
}
