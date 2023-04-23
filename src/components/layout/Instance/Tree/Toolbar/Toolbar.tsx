import styles from "../Tree.module.scss";

export function Toolbar(props: React.PropsWithChildren<{}>) {
  return <div className={styles.gitToolbar}>{props.children}</div>;
}
