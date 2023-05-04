import React from "react";
import styles from "../Chat.module.scss";
import { IconButton } from "@/components/buttons";
import { EditIcon } from "@/components/icons/EditIcon";
import { Button } from "@/components/buttons/Button";
import { UserIcon } from "@/components/icons/UserIcon";
import { IMessage } from "@/types/chat";
import { NewBranchModal, UserImage } from "@/components/connected";

export function UserChatMessage(props: {
  message: IMessage;
  onChange?: (message: IMessage, createBranchName?: string) => void;
}) {
  const [content, setContent] = React.useState(props.message.content || "");
  const [editting, setEditing] = React.useState(false);
  const [branching, setBranching] = React.useState(false);

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

  const handleNewBranch = React.useCallback(() => {
    setBranching(true);
  }, []);

  const handleNewBranchCancel = React.useCallback(() => {
    setBranching(false);
  }, []);

  const handleBranchSave = React.useCallback(
    (createBranchName: string) => {
      setBranching(false);
      setEditing(false);
      props?.onChange?.({ ...props.message, content }, createBranchName);
    },
    [props.message, content]
  );

  const handleCancel = React.useCallback(() => {
    setEditing(false);
    setBranching(false);
    setContent(props.message.content);
  }, [props.message.content]);

  return (
    <div className={styles.chatMessageWrapper}>
      <div className={styles.chatMessageIcon}>
        <UserImage avatar={props.message.avatar} />
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
          <Button onClick={handleNewBranch} variant="success">
            Branch & Commit
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      )}
      {branching && (
        <NewBranchModal
          hash={props.message.id}
          onCancel={handleNewBranchCancel}
          onSave={handleBranchSave}
        />
      )}
    </div>
  );
}
