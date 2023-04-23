import styles from "./ContextMenu.module.scss";

interface ContextMenuItem {
  onClick?: () => void;
}

export function ContextMenuItem(
  props: React.PropsWithChildren<ContextMenuItem>
) {
  return (
    <div className={styles.contextMenuItem} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
