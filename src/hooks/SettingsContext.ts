import { createContext } from 'react';

export interface Settings {
  showUndo: boolean;
  showRedo: boolean;
  homeShortcut: string;
  awayShortcut: string;
}

export interface SettingsContextType {
  settings: Settings;
  toggleUndo: () => void;
  toggleRedo: () => void;
  setHomeShortcut: (code: string) => void;
  setAwayShortcut: (code: string) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
