import React, { ReactNode } from "react";
import styles from "./Buttons.module.scss";

export function IconButton(
  props: React.PropsWithChildren<{
    icon: ReactNode;
    onClick?: () => void;
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
    <button onClick={handleClick} className={styles.iconButton}>
      {props.icon}
      {props.children}
    </button>
  );
}
