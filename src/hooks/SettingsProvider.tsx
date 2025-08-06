import { useState, useEffect, ReactNode } from 'react';
import { SettingsContext, Settings } from './SettingsContext';

const defaultSettings: Settings = { showUndo: true, showRedo: true };

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

  return (
    <SettingsContext.Provider value={{ settings, toggleUndo, toggleRedo }}>
      {children}
    </SettingsContext.Provider>
  );
};
