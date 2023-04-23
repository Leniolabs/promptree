import React from "react";
import { Button } from "../../buttons/Button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../layout/Modal";
import { ISettings } from "@/store";
import { TextInput } from "@/components/inputs/TextInput";
import { Label } from "@/components/displays/Label";
import { useDeleteInstances } from "@/query/useInstances";

interface ClearingModalProps {
  onClose?: () => void;
}

export function ClearingModal(props: ClearingModalProps) {
  const { deleteAllAsync } = useDeleteInstances();

  const handleDeletion = React.useCallback(() => {
    deleteAllAsync();
    props.onClose?.();
  }, [props.onClose]);

  return (
    <Modal size="md">
      <ModalHeader title="Delete all Conversations" onClose={props.onClose} />
      <ModalContent>
        <Label>Are you sure?</Label>
      </ModalContent>
      <ModalFooter>
        <Button variant="danger" onClick={handleDeletion}>
          Delete
        </Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
