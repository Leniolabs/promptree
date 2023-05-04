import { className } from "@/utils/classname";
import styles from "./Toolbar.module.scss";

export function ToolbarButton(
  props: React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
  }>
) {
  return (
    <button
      className={className(
        styles.toolbarButton,
        props.disabled && styles.disabled
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
