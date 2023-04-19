import styles from "./Layout.module.scss";

export function Columns(
  props: React.PropsWithChildren<{
    count: number;
  }>
) {
  return (
    <div className={styles.columns} style={{ columns: props.count }}>
      {props.children}
    </div>
  );
}
