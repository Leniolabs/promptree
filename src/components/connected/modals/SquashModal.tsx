import { IInstance } from "@/types/api";
import { Button } from "../../buttons/Button";
import { ChatContent } from "../../layout/Instance/ChatContent";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../../layout/Modal";
import { Loader } from "../../Loader";
import { IBranch, IMessage } from "@/types/chat";
import { useSquashChat } from "@/query/useChat";
import React from "react";
import { Columns } from "../../layout/Columns";
import { Label } from "../../displays/Label";
import { SelectInput } from "../../inputs/SelectInput";
import styles from "./Modals.module.scss";

interface SquashModalProps {
  id: string;
  currentBranch: IBranch;
  targetName: string;
  onSave?: () => void;
  onCancel?: () => void;
  branches: IBranch[];
}

export function SquashModal(props: SquashModalProps) {
  const squashChat = useSquashChat(props.id, props.currentBranch.branch);

  const handleSave = React.useCallback(() => {
    if (props.onSave) {
      squashChat.merge();
      props.onSave();
    }
    return undefined;
  }, [props.onSave, squashChat.merge]);

  return (
    <Modal>
      <ModalHeader title="Squash & Merge" onClose={props.onCancel} />
      <ModalContent>
        <Columns count={2}>
          <Label align="RIGHT">Merge</Label>
          <Label align="RIGHT">Into</Label>
          <SelectInput
            value={squashChat.targetBranch}
            onChange={squashChat.changeTargetBranch}
            options={props.branches
              .filter((branch) => branch.hash !== props.currentBranch.hash)
              .map((branch) => ({
                label: branch.branch,
                value: branch.branch,
              }))}
          />
          <Label>{props.targetName}</Label>
        </Columns>
        {squashChat.targetBranch && (
          <>
            <ChatContent
              className={styles.modalChatContent}
              messages={squashChat.squashMessages}
            />
            {squashChat.loading && <Loader />}
          </>
        )}
      </ModalContent>
      <ModalFooter>
        <Button onClick={squashChat.retry}>Retry</Button>
        <Button variant="success" onClick={handleSave}>
          Merge
        </Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
