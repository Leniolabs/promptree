import { IconButton } from "@/components/buttons";
import { PlusIcon } from "@/components/icons";
import { ReactNode } from "react";
import styles from "./Sidebar.module.scss";
import { className } from "@/utils/classname";

export function SidebarSection(
  props: React.PropsWithChildren<{
    title?: ReactNode;
    onNewItemClick?: () => void;
    fitContent?: boolean;
  }>
) {
  return (
    <div
      className={className(
        styles.sidebarSection,
        props.fitContent && styles.sidebarSectionFitContent
      )}
    >
      {props.title && (
        <div className={styles.sidebarSectionTitle}>
          {props.title}
          {props.onNewItemClick && (
            <IconButton icon={<PlusIcon />} onClick={props.onNewItemClick}>
              New {props.title}
            </IconButton>
          )}
        </div>
      )}
      <div className={styles.sidebarSectionContentWrapper}>
        <div className={styles.sidebarSectionContent}>{props.children}</div>
      </div>
    </div>
  );
}
