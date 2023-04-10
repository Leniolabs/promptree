import React from "react";
import ReactDOM from "react-dom";
import styles from "./Model.module.scss";

export function Modal(props: React.PropsWithChildren<{}>) {
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
        <div className={styles.modalContainer}>{props.children}</div>
      </div>
    </div>,
    document.body
  );
}
