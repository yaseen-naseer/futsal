import React, { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  showUndo: boolean;
  showRedo: boolean;
}

interface SettingsContextType {
  settings: Settings;
  toggleUndo: () => void;
  toggleRedo: () => void;
}

const defaultSettings: Settings = { showUndo: true, showRedo: true };

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

