import React from "react";
import styles from "./Buttons.module.scss";
import { SendIcon } from "../icons";
import { className } from "@/utils/classname";

export function SendButton(props: { onClick: () => void; disabled?: boolean }) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      props.onClick?.();
    },
    [props.onClick]
  );

  return (
    <button
      onClick={handleClick}
      className={className(
        styles.sendButton,
        props.disabled && styles.disabled
      )}
    >
      {<SendIcon />}
    </button>
  );
}
