import React from "react";
import ReactDOM from "react-dom";
import styles from "./Model.module.scss";
import { className } from "@/utils/classname";

export function Modal(
  props: React.PropsWithChildren<{
    size?: "sm" | "md" | "lg";
  }>
) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalWrapper}>
      <div className={styles.modalBackdrop} />
      <div className={styles.modal}>
        <div
          className={className(
            styles.modalContainer,
            props.size && styles[props.size]
          )}
        >
          {props.children}
        </div>
      </div>
    </div>,
    document.body
  );
}
