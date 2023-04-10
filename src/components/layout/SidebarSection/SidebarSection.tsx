import { IconButton } from "@/components/buttons";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ReactNode } from "react";
import styles from "./Sidebar.module.scss";
import { SidebarSectionAdd } from "./SidebarSectionAdd";

export function SidebarSection(
  props: React.PropsWithChildren<{
    title: ReactNode;
    onNewItemClick?: () => void;
  }>
) {
  return (
    <div className={styles.sidebarSection}>
      <div className={styles.sidebarSectionTitle}>
        {props.title}
        {props.onNewItemClick && (
          <IconButton icon={<PlusIcon />} onClick={props.onNewItemClick}>
            New {props.title}
          </IconButton>
        )}
      </div>
      <div className={styles.sidebarSectionContentWrapper}>
        <div className={styles.sidebarSectionContent}>{props.children}</div>
      </div>
    </div>
  );
}
