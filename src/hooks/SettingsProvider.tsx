import { useState, useEffect, ReactNode } from 'react';
import { SettingsContext, Settings } from './SettingsContext';

const defaultSettings: Settings = {
  showUndo: true,
  showRedo: true,
  homeShortcut: 'KeyA',
  awayShortcut: 'KeyD',
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('settings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...defaultSettings, ...parsed } as Settings;
        } catch {
          // ignore parse errors
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const toggleUndo = () => setSettings(s => ({ ...s, showUndo: !s.showUndo }));
  const toggleRedo = () => setSettings(s => ({ ...s, showRedo: !s.showRedo }));
  const setHomeShortcut = (code: string) => setSettings(s => ({ ...s, homeShortcut: code }));
  const setAwayShortcut = (code: string) => setSettings(s => ({ ...s, awayShortcut: code }));

  return (
    <SettingsContext.Provider
      value={{ settings, toggleUndo, toggleRedo, setHomeShortcut, setAwayShortcut }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
