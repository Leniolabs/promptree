import { IMessage } from "@/types/chat";
import { ChatMessage } from "./ChatMessage/ChatMessage";
import styles from "./Chat.module.scss";
import React from "react";
import { className } from "@/utils/classname";

export function ChatContent(
  props: React.PropsWithChildren<{
    className?: string;
    title?: string;
    messages?: IMessage[];
    onMessageChange?: (message: IMessage) => void;
    onBranch?: (hash: string) => void;
  }>
) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container)
      if (container.scrollHeight > container.clientHeight) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
  }, [props.messages]);

  return (
    <div
      ref={containerRef}
      className={className(styles.chatContent, props.className)}
    >
      <div className={styles.chatMessages}>
        <div className={styles.chatTitle}>{props.title}</div>
        {props.messages?.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onChange={props.onMessageChange}
            onBranch={props.onBranch}
          />
        ))}
      </div>
    </div>
  );
}
