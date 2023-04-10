import { IconLinkButton } from "@/components/buttons";
import { ChatIcon } from "@/components/icons";
import { TemplateIcon } from "@/components/icons/TemplateIcon";
import { SidebarEditableLink } from "./SidebarLink/SidebarEditableLink";

export function SidebarLinkTemplate(props: {
  id: string;
  label: string;
  onDelete?: (id: string) => void;
  onSave?: (name: string) => void;
}) {
  return (
    <SidebarEditableLink
      href={`/template/${props.id}`}
      icon={<TemplateIcon />}
      extra={
        <IconLinkButton
          href={`/instance?template=${props.id}`}
          icon={<ChatIcon />}
        />
      }
      label={props.label}
      onDelete={() => props.onDelete?.(props.id)}
      onChange={props.onSave}
    />
  );
}
