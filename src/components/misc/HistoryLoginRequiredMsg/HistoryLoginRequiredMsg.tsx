import { ButtonLink } from "@/components/buttons";
import styles from "./HistoryLoginRequiredMsg.module.scss";
import { useStore } from "@/store";

export function HistoryLoginRequiredMsg() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          In order to have a log of your conversations you must{" "}
          <ButtonLink href="/login">Login</ButtonLink>
        </div>
      </div>
    </div>
  );
}
