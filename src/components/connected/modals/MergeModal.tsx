import React from "react";
import { IBranch, ICommit } from "@/types/chat";
import { Button } from "../../buttons/Button";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../../layout/Modal";
import { TextInput } from "../../inputs/TextInput";
import { Label } from "../../displays/Label";
import { Columns } from "../../layout/Columns";
import { SelectInput } from "../../inputs/SelectInput";

interface MergeModalProps {
  currentBranch: IBranch;
  onSave?: (branchName: string) => void;
  onCancel?: () => void;
  branches: IBranch[];
}

export function MergeModal(props: MergeModalProps) {
  const [branchName, setBranchName] = React.useState("");

  const handleSave = React.useCallback(() => {
    if (branchName && props.onSave) props.onSave(branchName);
    return undefined;
  }, [props.onSave, branchName]);

  return (
    <Modal>
      <ModalHeader title="Merge" onClose={props.onCancel} />
      <ModalContent>
        <Columns count={2}>
          <Label align="RIGHT">Merge</Label>
          <Label align="RIGHT">Into</Label>
          <SelectInput
            value={branchName}
            onChange={setBranchName}
            options={props.branches
              .filter((branch) => branch.hash !== props.currentBranch.hash)
              .map((branch) => ({
                label: branch.branch,
                value: branch.branch,
              }))}
          />
          <Label>{props.currentBranch.branch}</Label>
        </Columns>
      </ModalContent>
      <ModalFooter>
        <Button variant="success" onClick={handleSave}>
          Merge
        </Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
