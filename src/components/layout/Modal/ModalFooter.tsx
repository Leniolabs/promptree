import styles from "./Model.module.scss";

export function ModalFooter(props: React.PropsWithChildren<{}>) {
  return <div className={styles.modalFooter}>{props.children}</div>;
}
