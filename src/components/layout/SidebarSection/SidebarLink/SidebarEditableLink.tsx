import { SmallIconButton } from "@/components/buttons/SmallIconButton";
import {
  DeleteIcon,
  CancelIcon,
  TextEditIcon,
  CheckIcon,
} from "@/components/icons";
import React, { ReactNode } from "react";
import { SidebarEditLink } from "./SidebarEditLink";
import { SidebarLink } from "./SidebarLink";

export function SidebarEditableLink(props: {
  icon?: ReactNode;
  href: string;
  label: string;

  extra?: ReactNode;

  onSave?: (label: string) => void;
  onDelete?: () => void;
}) {
  const [editting, setEdditting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState<string>("");

  const handleCancel = React.useCallback(() => {
    setEdditting(false);
  }, []);

  if (editting) {
    return (
      <SidebarEditLink
        {...props}
        extra={
          <>
            <SmallIconButton
              icon={<CheckIcon />}
              onClick={() => {
                props.onSave?.(newLabel);
                setEdditting(false);
              }}
            />
            <SmallIconButton onClick={handleCancel} icon={<CancelIcon />} />
          </>
        }
        value={props.label}
        onChange={setNewLabel}
        onBlur={handleCancel}
      />
    );
  }

  if (deleting) {
    return (
      <SidebarLink
        {...props}
        extra={
          <>
            <SmallIconButton
              icon={<CheckIcon />}
              onClick={() => {
                props.onDelete?.();
              }}
            />
            <SmallIconButton
              onClick={() => setDeleting(false)}
              icon={<CancelIcon />}
            />
          </>
        }
      />
    );
  }

  return (
    <SidebarLink
      {...props}
      extra={
        <>
          <SmallIconButton
            icon={<TextEditIcon />}
            onClick={() => {
              setNewLabel("");
              setEdditting(true);
            }}
          />
          <SmallIconButton
            onClick={() => {
              setDeleting(true);
            }}
            icon={<DeleteIcon />}
          />
        </>
      }
      extraForced={props.extra}
    />
  );
}
