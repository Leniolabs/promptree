import React from "react";
import styles from "./Chat.module.scss";
import { APP_NAME, APP_STAGE } from "@/settings";

export function ChatEmptyContent() {
  return (
    <div className={styles.chatEmptyContentWrapper}>
      <div className={styles.chatEmptyContent}>
        {APP_NAME}
        {APP_STAGE && <span>{APP_STAGE}</span>}
      </div>
    </div>
  );
}
