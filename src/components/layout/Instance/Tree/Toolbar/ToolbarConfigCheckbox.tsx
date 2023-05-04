import React from "react";
import styles from "./Toolbar.module.scss";
import { className } from "@/utils/classname";

export function ToolbarConfigCheckbox(
  props: React.PropsWithChildren<{
    value?: boolean;
    onChange?: (value: boolean) => void;
  }>
) {
  const handleClick = React.useCallback(() => {
    props.onChange?.(!props.value);
  }, [props.onChange, props.value]);

  return (
    <div
      className={className(
        styles.toolbarConfigItem,
        styles.toolbarConfigCheckbox
      )}
    >
      <label>
        <input type="checkbox" defaultChecked={props.value} onClick={handleClick} />
        {props.children}
      </label>
    </div>
  );
}
