import { className } from "@/utils/classname";
import styles from "./Toolbar.module.scss";
import { BranchIcon } from "@/components/icons";

export function ToolbarBranch(props: React.PropsWithChildren<{}>) {
  return (
    <div className={className(styles.toolbarBranch)}>
      <BranchIcon />
      {props.children}
    </div>
  );
}
