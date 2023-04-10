import { INode } from "@/types/chat";
import { ChatMessage } from "./ChatMessage/ChatMessage";
import stylesWrapper from "../Instance.module.scss";
import styles from "./Chat.module.scss";
import React from "react";

export function ChatContent(
  props: React.PropsWithChildren<{
    title?: string;
    nodes?: INode[];
    onNodeChange?: (node: INode) => void;
    onBranch?: (node: INode) => void;
  }>
) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container)
      if (container.scrollHeight > container.clientHeight) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
  }, [props.nodes]);

  return (
    <div ref={containerRef} className={styles.chatContent}>
      <div className={styles.chatMessages}>
        <div className={styles.chatTitle}>{props.title}</div>
        {props.nodes?.map((node) => (
          <ChatMessage
            key={node.id}
            node={node}
            onChange={props.onNodeChange}
            onBranch={props.onBranch}
          />
        ))}
      </div>
    </div>
  );
}
