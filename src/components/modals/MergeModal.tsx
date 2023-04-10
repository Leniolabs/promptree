import React from "react";
import { IInstance } from "@/types/api";
import { INode } from "@/types/chat";
import { Button } from "../buttons/Button";
import { Tree } from "../layout/Instance/Tree";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../layout/Modal";

interface MergeModalProps {
  instance: IInstance;
  tree: INode[];
  onSave?: (targetPointer: string) => void;
  onCancel?: () => void;
}

export function MergeModal(props: MergeModalProps) {
  const [targetPointer, changeTargetPointer] =
    React.useState<IInstance["pointer"]>();

  const pointerNode = React.useMemo(() => {
    if (!props.tree) return undefined;
    const node = props.tree.find((node) => node.id === targetPointer);
    if (!node) return undefined;
    return node;
  }, [props.tree, targetPointer]);

  const handleSave = React.useCallback(() => {
    if (targetPointer && props.onSave) props.onSave(targetPointer);
    return undefined;
  }, [props.onSave, targetPointer]);

  const handleNodeClick = React.useCallback((node: INode) => {
    changeTargetPointer(node.id);
  }, []);

  console.log(props.tree);

  return (
    <Modal>
      <ModalHeader title="Merge" onClose={props.onCancel} />
      <ModalContent>
        <Tree
          nodes={props.tree}
          pointer={pointerNode}
          onNodeClick={handleNodeClick}
          width={600}
          height={200}
          disabledNodes={props.instance.nodes}
        />
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
