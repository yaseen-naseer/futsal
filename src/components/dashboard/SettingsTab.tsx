import React from 'react';
import { ExternalControlInfo } from '../ExternalControlInfo';

interface SettingsTabProps {
  resetGame: () => void;
  updateTeam: <T extends 'name' | 'score' | 'fouls' | 'logo'>(
    team: 'home' | 'away',
    field: T,
    value: T extends 'name' | 'logo' ? string : number
  ) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ resetGame, updateTeam }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
    <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">Game Settings</h3>

    <div className="space-y-8">
      {/* External Control Info */}
      <ExternalControlInfo />

      <div className="text-center">
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Reset Entire Game
        </button>
        <p className="text-sm text-gray-500 mt-2">
          This will reset scores, fouls, timer, and all settings to default values.
        </p>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              updateTeam('home', 'score', 0);
              updateTeam('away', 'score', 0);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Scores
          </button>
          <button
            onClick={() => {
              updateTeam('home', 'fouls', 0);
              updateTeam('away', 'fouls', 0);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Fouls
          </button>
        </div>
      </div>
    </div>
  </div>
);

