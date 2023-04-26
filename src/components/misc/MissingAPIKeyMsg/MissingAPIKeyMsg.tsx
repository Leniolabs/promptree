import { ButtonLink } from "@/components/buttons";
import styles from "./MissingAPIKeyMsg.module.scss";
import { useStore } from "@/store";

export function MissingAPIKeyMsg() {
  const { openSettings } = useStore();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          You have to{" "}
          <ButtonLink onClick={openSettings}>
            configure your OpenAI{"'"}s API KEY
          </ButtonLink>{" "}
          in order to use this tool
        </div>
      </div>
    </div>
  );
}
