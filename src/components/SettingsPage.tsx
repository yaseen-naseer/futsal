import React from 'react';
import { useSettings } from '../hooks/useSettings';

export const SettingsPage: React.FC = () => {
  const { settings, toggleUndo, toggleRedo } = useSettings();

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showUndo}
            onChange={toggleUndo}
            className="w-4 h-4"
          />
          <span className="text-gray-800 dark:text-gray-200">Show Undo Button</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showRedo}
            onChange={toggleRedo}
            className="w-4 h-4"
          />
          <span className="text-gray-800 dark:text-gray-200">Show Redo Button</span>
        </label>
      </div>
    </div>
  );
};

