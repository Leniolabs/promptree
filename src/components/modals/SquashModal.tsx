import { useSquashChat } from "@/query/useChat";
import { IInstance } from "@/types/api";
import { INode } from "@/types/chat";
import { Button } from "../buttons/Button";
import { ChatContent } from "../layout/Instance/ChatContent";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../layout/Modal";
import { Loader } from "../Loader";

interface SquashModalProps {
  instance: IInstance;
  onSave?: (nodes: INode[]) => void;
  onCancel?: () => void;
}

export function SquashModal(props: SquashModalProps) {
  const squashChat = useSquashChat(props.instance);

  return (
    <Modal>
      <ModalHeader title="Squash Chat" onClose={props.onCancel} />
      <ModalContent>
        <ChatContent nodes={squashChat.instance.nodes} />
        {squashChat.isLoading && <Loader />}
      </ModalContent>
      <ModalFooter>
        <Button onClick={squashChat.retry}>Retry</Button>
        <Button
          variant="success"
          onClick={() => props.onSave?.(squashChat.instance.nodes)}
        >
          Commit
        </Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
