import React from "react";
import { ICommit } from "@/types/chat";
import { Button } from "../../buttons/Button";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../../layout/Modal";
import { TextInput } from "../../inputs/TextInput";
import { Label } from "../../displays/Label";
import { Columns } from "../../layout/Columns";

interface NewBranchModalProps {
  hash: string;
  onSave?: (branchName: string) => void;
  onCancel?: () => void;
}

export function NewBranchModal(props: NewBranchModalProps) {
  const [branchName, setBranchName] = React.useState("");

  const handleSave = React.useCallback(() => {
    if (branchName && props.onSave) props.onSave(branchName);
    return undefined;
  }, [props.onSave, branchName]);

  return (
    <Modal>
      <ModalHeader title="Create Branch" onClose={props.onCancel} />
      <ModalContent>
        <Columns count={2}>
          <Label align="RIGHT">Create branch at</Label>
          <Label align="RIGHT">Branch name</Label>
          <Label>{props.hash.slice(0, 7)}</Label>
          <TextInput
            value={branchName}
            onChange={setBranchName}
            placeholder="Enter a Branch Name"
          />
        </Columns>
      </ModalContent>
      <ModalFooter>
        <Button variant="success" onClick={handleSave}>
          Create Branch
        </Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
