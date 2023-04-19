import { SmallIconButton } from "@/components/buttons/SmallIconButton";
import { CancelIcon } from "@/components/icons";
import styles from "./Model.module.scss";

export function ModalHeader(
  props: React.PropsWithChildren<{
    title: string;
    onClose?: () => void;
  }>
) {
  return (
    <div className={styles.modalHeader}>
      <div className={styles.modalHeaderTitle}>{props.title}</div>
      <SmallIconButton onClick={props.onClose} icon={<CancelIcon />} />
    </div>
  );
}
