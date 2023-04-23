import React from "react";
import { SendButton } from "@/components/buttons/SendButton";
import styles from "./Input.module.scss";
import { SquashIcon, ReloadIcon, MergeIcon } from "@/components/icons";
import { Button } from "@/components/buttons/Button";

export function InstanceInput(
  props: React.PropsWithChildren<{
    onSend?: (message: string) => void;
    onRegenerate?: () => void;
    onMerge?: () => void;
    onMergeSquash?: () => void;
  }>
) {
  const [message, setMessage] = React.useState("");

  const handleMessageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSend = React.useCallback(() => {
    if (message) {
      props.onSend?.(message);
      setMessage("");
    }
  }, [message, props.onSend]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        props.onSend?.(message);
        setMessage("");
      }
    },
    [message, props.onSend]
  );

  const rowCount = React.useMemo(() => {
    return (message || "").split("\n").length;
  }, [message]);

  return (
    <div className={styles.instanceInputWrapper}>
      <div className={styles.instanceInputToolbar}>
        {props.onMerge && (
          <Button onClick={() => props.onMerge?.()}>
            <MergeIcon />
            Merge
          </Button>
        )}
        {props.onMergeSquash && (
          <Button onClick={() => props.onMergeSquash?.()}>
            <SquashIcon />
            Squash & Merge
          </Button>
        )}
        {props.onRegenerate && (
          <Button onClick={props.onRegenerate}>
            <ReloadIcon />
            Regenerate Response
          </Button>
        )}
      </div>
      <div className={styles.instanceTextInputWrapper}>
        <textarea
          placeholder="Send a message..."
          className={styles.instanceTextArea}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          style={{
            height: `${24 * rowCount}px`,
            ...(rowCount > 8
              ? { maxHeight: "200px" }
              : { overflowY: "hidden" }),
          }}
        />
        <SendButton onClick={handleSend} />
      </div>
    </div>
  );
}
