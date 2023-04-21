import { Sidebar, SidebarSection } from "@/components/layout";
import { useRouter } from "next/router";
import React from "react";
import { SidebarLink } from "../layout/SidebarSection/SidebarLink/SidebarLink";
import {
  ThrashIcon,
  LogoutIcon,
  SettingsIcon,
  PlusIcon,
  LoginIcon,
} from "../icons";
import { useStore } from "@/store";
import { SettingsModal } from "./modals/SettingsModal";
import { useSession, signOut } from "next-auth/react";
import { HistoryLoginRequiredMsg } from "../misc/HistoryLoginRequiredMsg";
import { ConnectedInstancesList } from "./ConnectedInstancesList";

export function ConnectedSidebar() {
  const session = useSession();

  const router = useRouter();

  const {
    isSettingsOpen,
    settings,
    changeSettings,
    openSettings,
    closeSettings,
  } = useStore();

  const isUnauthenticated = React.useMemo(() => {
    return session.status === "unauthenticated";
  }, [session]);

  const isAuthenticated = React.useMemo(() => {
    return session.status === "authenticated";
  }, [session]);

  return (
    <Sidebar>
      <SidebarSection fitContent>
        <SidebarLink
          icon={<PlusIcon />}
          label="New chat"
          onClick={() => router.push("/")}
          border
        />
      </SidebarSection>
      {isUnauthenticated && <HistoryLoginRequiredMsg />}
      {isAuthenticated && <ConnectedInstancesList />}
      <SidebarSection fitContent>
        {isAuthenticated && (
          <SidebarLink icon={<ThrashIcon />} label="Clear conversations" />
        )}
        <SidebarLink
          icon={<SettingsIcon />}
          label="Settings"
          onClick={openSettings}
        />
        {isUnauthenticated && (
          <SidebarLink href="/login" icon={<LoginIcon />} label="Login" />
        )}
        {isAuthenticated && (
          <SidebarLink
            onClick={() => signOut()}
            icon={<LogoutIcon />}
            label="Log out"
          />
        )}
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
