import React from "react";
import styles from "./Chat.module.scss";
import { APP_NAME } from "@/settings";

export function ChatEmptyContent() {
  return (
    <div className={styles.chatEmptyContentWrapper}>
      <div className={styles.chatEmptyContent}>{APP_NAME}</div>
    </div>
  );
}
