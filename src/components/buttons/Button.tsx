import { className } from "@/utils/classname";
import React from "react";
import styles from "./Buttons.module.scss";

export function Button(
  props: React.PropsWithChildren<{
    onClick?: () => void;
    variant?: "success" | "danger";
  }>
) {
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
        styles.button,
        props.variant && styles[props.variant]
      )}
    >
      {props.children}
    </button>
  );
}
