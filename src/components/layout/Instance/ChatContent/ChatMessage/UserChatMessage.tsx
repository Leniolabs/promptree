import React from "react";
import styles from "../Chat.module.scss";
import { IconButton } from "@/components/buttons";
import { EditIcon } from "@/components/icons/EditIcon";
import { Button } from "@/components/buttons/Button";
import { UserIcon } from "@/components/icons/UserIcon";
import { IMessage } from "@/types/chat";
import { UserImage } from "@/components/connected";

export function UserChatMessage(props: {
  message: IMessage;
  onChange?: (message: IMessage) => void;
}) {
  const [content, setContent] = React.useState(props.message.content || "");
  const [editting, setEditing] = React.useState(false);

  const rows = React.useMemo(() => {
    return (content || "").split("\n").length;
  }, [content]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    []
  );

  const handleSave = React.useCallback(() => {
    props?.onChange?.({ ...props.message, content });
    setEditing(false);
  }, [props.message, content]);

  const handleCancel = React.useCallback(() => {
    setEditing(false);
    setContent(props.message.content);
  }, [props.message.content]);

  return (
    <div className={styles.chatMessageWrapper}>
      <div className={styles.chatMessageIcon}>
        <UserImage />
      </div>
      <div className={styles.chatMessageContent}>
        <div className={styles.chatText}>
          {editting ? (
            <textarea
              defaultValue={props.message.content}
              onChange={handleChange}
              style={{ height: `${24 * rows}px` }}
              value={content}
            />
          ) : (
            props.message.content
          )}
        </div>
      </div>
      <div className={styles.chatMessageControls}>
        {props.onChange && (
          <IconButton icon={<EditIcon />} onClick={() => setEditing(true)} />
        )}
      </div>
      {editting && (
        <div className={styles.chatMessageButtons}>
          <Button onClick={handleSave} variant="success">
            Commit
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      )}
    </div>
  );
}
