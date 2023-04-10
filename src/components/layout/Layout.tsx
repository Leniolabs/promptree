import styles from "./Layout.module.scss";

export function Layout(props: React.PropsWithChildren<{}>) {
  return <div className={styles.layout}>{props.children}</div>;
}
