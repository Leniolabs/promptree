import ReactDOM from "react-dom";
import styles from "./ContextMenu.module.scss";

export function ContextMenu(
  props: React.PropsWithChildren<{
    refElement: HTMLElement;
  }>
) {
  return ReactDOM.createPortal(
    <div className={styles.contextMenu}>
        {props.children}
    </div>,
    props.refElement
  );
}
