import { PlusIcon } from "@/components/icons/PlusIcon";
import styles from "./Sidebar.module.scss";

export function SidebarSectionAdd(props: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.sidebarSectionAdd}>
      <PlusIcon />
      {props.children}
    </div>
  );
}
