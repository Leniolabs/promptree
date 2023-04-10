import React from "react";
import styles from "./Buttons.module.scss";
import { SendIcon } from "../icons";

export function SendButton(props: { onClick: () => void }) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      props.onClick?.();
    },
    [props.onClick]
  );

  return (
    <button onClick={handleClick} className={styles.sendButton}>
      {<SendIcon />}
    </button>
  );
}
