import styles from "./Model.module.scss";

export function ModalContent(props: React.PropsWithChildren<{}>) {
  return <div className={styles.modalContent}>{props.children}</div>;
}
