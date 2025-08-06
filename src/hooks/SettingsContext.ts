import { createContext } from 'react';

export interface Settings {
  showUndo: boolean;
  showRedo: boolean;
}

export interface SettingsContextType {
  settings: Settings;
  toggleUndo: () => void;
  toggleRedo: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
