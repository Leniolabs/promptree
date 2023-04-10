import React from "react";
import styles from "../Chat.module.scss";
import { INode } from "@/types/chat";
import { className } from "@/utils/classname";
import { UserChatMessage } from "./UserChatMessage";
import { AssistantChatMessage } from "./AssistantChatMessage";

export function ChatMessage(props: {
  node: INode;
  onChange?: (message: INode) => void;
  onBranch?: (message: INode) => void;
}) {
  if (props.node.type !== "message") return null;
  return (
    <>
      <div
        className={className(
          styles.chatMessage,
          styles["chat-" + props.node.content.author]
        )}
      >
        {props.node.content.author === "user" && (
          <UserChatMessage
            message={props.node.content}
            onChange={(content) =>
              props.onChange?.({ ...props.node, content } as INode)
            }
          />
        )}
        {props.node.content.author === "assistant" && (
          <AssistantChatMessage
            message={props.node.content}
            onBranch={() => props.onBranch?.(props.node)}
          />
        )}
      </div>
    </>
  );
}
