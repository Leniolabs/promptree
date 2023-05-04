import React from "react";
import styles from "../Chat.module.scss";
import { IMessage } from "@/types/chat";
import { className } from "@/utils/classname";
import { UserChatMessage } from "./UserChatMessage";
import { AssistantChatMessage } from "./AssistantChatMessage";

export function ChatMessage(props: {
  message: IMessage;
  onChange?: (message: IMessage) => void;
  onNewBranch?: (hash: string) => void;
}) {
  return (
    <>
      <div
        className={className(
          styles.chatMessage,
          styles["chat-" + props.message.author]
        )}
      >
        {props.message.author === "user" && (
          <UserChatMessage message={props.message} onChange={props.onChange} />
        )}
        {props.message.author === "assistant" && (
          <AssistantChatMessage
            message={props.message}
            onNewBranch={
              props.onNewBranch
                ? () => props.onNewBranch?.(props.message.id)
                : undefined
            }
          />
        )}
      </div>
    </>
  );
}
