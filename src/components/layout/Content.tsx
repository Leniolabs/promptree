import styles from "./Layout.module.scss";

export function Content(props: React.PropsWithChildren<{}>) {
  return <div className={styles.content}>{props.children}</div>;
}
