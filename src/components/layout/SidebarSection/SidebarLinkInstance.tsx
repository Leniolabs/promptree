import React from "react";
import { ChatIcon } from "@/components/icons";
import { SidebarEditableLink } from "./SidebarLink/SidebarEditableLink";

export function SidebarLinkInstance(props: {
  id: string;
  label: string;
  onDelete?: (id: string) => void;
  onSave?: (name: string) => void;
}) {
  return (
    <SidebarEditableLink
      href={`/instance/${props.id}`}
      icon={<ChatIcon />}
      label={props.label}
      onDelete={() => props.onDelete?.(props.id)}
      onSave={props.onSave}
    />
  );
}
