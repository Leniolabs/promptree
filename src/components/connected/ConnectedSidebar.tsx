import {
  Sidebar,
  SidebarSection,
  SidebarLinkInstance,
  SidebarLinkTemplate,
} from "@/components/layout";
import { useInstances } from "@/query/useInstances";
import { useTemplates } from "@/query/useTemplates";
import { useRouter } from "next/router";
import React from "react";
import { SidebarLink } from "../layout/SidebarSection/SidebarLink/SidebarLink";
import { ThrashIcon, LogoutIcon, SettingsIcon } from "../icons";
import { useStore } from "@/store";
import { SettingsModal } from "./modals/SettingsModal";

export function ConnectedSidebar() {
  const {
    data: instances,
    deleteAsync: deleteInstanceAsync,
    updateAsync: updateInstanceAsync,
  } = useInstances();
  const {
    data: templates,
    deleteAsync: deleteTemplateAsync,
    updateAsync: updateTemplateAsync,
  } = useTemplates();

  const router = useRouter();

  const {
    isSettingsOpen,
    settings,
    changeSettings,
    openSettings,
    closeSettings,
  } = useStore();

  const handleInstanceSave = React.useCallback(
    (...args: Parameters<typeof updateInstanceAsync>) => {
      updateInstanceAsync(...args);
    },
    [updateInstanceAsync]
  );

  const handleInstanceDelete = React.useCallback(
    (...args: Parameters<typeof deleteInstanceAsync>) => {
      deleteInstanceAsync(...args);
      router.push("/");
    },
    [deleteInstanceAsync]
  );

  const handleTemplateSave = React.useCallback(
    (...args: Parameters<typeof updateTemplateAsync>) => {
      updateTemplateAsync(...args);
    },
    [updateTemplateAsync]
  );

  const handleTemplateDelete = React.useCallback(
    (...args: Parameters<typeof deleteTemplateAsync>) => {
      deleteTemplateAsync(...args);
      router.push("/template");
    },
    [deleteTemplateAsync]
  );

  return (
    <Sidebar>
      <SidebarSection
        title={"Instances"}
        onNewItemClick={() => {
          router.push("/");
        }}
      >
        {(instances || []).map((instance) => (
          <SidebarLinkInstance
            key={instance.id}
            id={instance.id}
            onDelete={handleInstanceDelete}
            onSave={(title) => handleInstanceSave(instance.id, { title })}
            label={instance.title}
          />
        ))}
      </SidebarSection>
      <SidebarSection fitContent>
        <SidebarLink icon={<ThrashIcon />} label="Clear conversations" />
        <SidebarLink
          icon={<SettingsIcon />}
          label="Settings"
          onClick={openSettings}
        />
        <SidebarLink icon={<LogoutIcon />} label="Log out" />
      </SidebarSection>
      {isSettingsOpen && (
        <SettingsModal
          initialSettings={settings}
          onSave={(settings) => {
            changeSettings(settings);
            closeSettings();
          }}
          onCancel={closeSettings}
        />
      )}
      {/* <SidebarSection
        title={"Templates"}
        onNewItemClick={() => {
          router.push("/template");
        }}
      >
        {(templates || []).map((template) => (
          <SidebarLinkTemplate
            key={template.id}
            id={template.id}
            onDelete={handleTemplateDelete}
            onSave={(title) => handleTemplateSave(template.id, { title })}
            label={`${template.title} (${template.type})`}
          />
        ))}
      </SidebarSection> */}
    </Sidebar>
  );
}
