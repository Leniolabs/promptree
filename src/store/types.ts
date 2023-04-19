export interface ISettings {
  apikey: string;
}

export interface IStore {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  settings: ISettings;
  changeSettings: (settings: ISettings) => void;
}
