import styles from "./Layout.module.scss";

export function Sidebar(props: React.PropsWithChildren<{}>) {
  return <div className={styles.sidebar}>{props.children}</div>;
}
