import React from "react";
import { className } from "@/utils/classname";
import styles from "./Toolbar.module.scss";
import { ToolbarButton } from "./ToolbarButton";
import { SettingsIcon } from "@/components/icons";
import { ToolbarConfigCheckbox } from "./ToolbarConfigCheckbox";
import { useClickOutside } from "@/hooks/useClickOutside";
import { IInstanceConfig } from "@/types/api";

export function ToolbarConfig(props: {
  config: IInstanceConfig;
  onConfigChange?: (config: IInstanceConfig) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const refContainer = React.useRef<HTMLDivElement>(null);

  const handleToggle = React.useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useClickOutside(refContainer, () => {
    setOpen(false);
  });

  const handleConfigChange = React.useCallback(
    (key: keyof IInstanceConfig) => {
      return (value: IInstanceConfig[typeof key]) => {
        props.onConfigChange?.({ ...props.config, [key]: value });
      };
    },
    [props.onConfigChange, props.config]
  );

  return (
    <div
      ref={refContainer}
      className={className(
        styles.toolbarConfig,
        open && styles.toolbarConfigOpen
      )}
    >
      <ToolbarButton onClick={handleToggle}>
        <SettingsIcon />
      </ToolbarButton>
      <div className={styles.toolbarConfigContent}>
        <div className={styles.toolbarConfigTitle}>
          <div>Settings</div>
        </div>
        <div
          className={className(
            styles.toolbarConfigItem,
            styles.toolbarConfigLabel
          )}
        >
          <label>Model:</label>gpt-3.5-turbo
        </div>
        <div className={styles.toolbarConfigTitle}>
          <div>Sharing</div>
        </div>
        <ToolbarConfigCheckbox
          value={props.config.public}
          onChange={handleConfigChange("public")}
        >
          Is Public
        </ToolbarConfigCheckbox>
      </div>
    </div>
  );
}
