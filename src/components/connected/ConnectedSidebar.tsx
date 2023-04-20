import {
  Sidebar,
  SidebarSection,
  SidebarLinkInstance,
} from "@/components/layout";
import { useInstances } from "@/query/useInstances";
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
    </Sidebar>
  );
}
