import React from "react";
import { ISettings, IStore } from "./types";
import { useLocalStorageState } from "@/hooks";

const Store = React.createContext<IStore>({
  isSettingsOpen: false,
  openSettings: () => {},
  closeSettings: () => {},
  settings: {
    apikey: "",
  },
  changeSettings: () => {},
});

export function useStore() {
  return React.useContext(Store);
}

export function useAPIKey() {
  const {
    settings: { apikey },
  } = useStore();

  return apikey;
}

export function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [settings, setSettings] = useLocalStorageState<ISettings>("settings", {
    apikey: "",
  });
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);

  const contextValue = React.useMemo(() => {
    return {
      isSettingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
      settings,
      changeSettings: setSettings,
    };
  }, [settings, isSettingsOpen]);

  return <Store.Provider value={contextValue}>{props.children}</Store.Provider>;
}
