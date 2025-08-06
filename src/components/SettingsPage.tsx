import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ExternalControlInfo } from './ExternalControlInfo';
import { GameState } from '../types';

interface SettingsPageProps {
  gameState: GameState;
  updateTeam: (
    team: 'home' | 'away',
    field: 'name' | 'score' | 'fouls' | 'logo',
    value: string | number
  ) => void;
  resetGame: (options?: { force?: boolean }) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  gameState,
  updateTeam,
  resetGame,
}) => {
  const handleResetGame = () => {
    const hasStarted =
      gameState.isRunning ||
      gameState.time.minutes !== gameState.gamePreset.halfDuration ||
      gameState.time.seconds !== 0 ||
      gameState.homeTeam.score !== 0 ||
      gameState.awayTeam.score !== 0 ||
      gameState.homeTeam.fouls !== 0 ||
      gameState.awayTeam.fouls !== 0 ||
      Object.values(gameState.homeTeam.stats).some(v => v !== 0) ||
      Object.values(gameState.awayTeam.stats).some(v => v !== 0);

    if (!hasStarted || window.confirm('Are you sure you want to reset the entire game?')) {
      resetGame({ force: true });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto mt-24">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">
        Game Settings
      </h3>

      <div className="space-y-8">
        {/* External Control Info */}
        <ExternalControlInfo />

        <div className="text-center">
          <button
            onClick={handleResetGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Entire Game
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This will reset scores, fouls, timer, and all settings to default values.
          </p>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                updateTeam('home', 'score', 0);
                updateTeam('away', 'score', 0);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Reset Scores
            </button>
            <button
              onClick={() => {
                updateTeam('home', 'fouls', 0);
                updateTeam('away', 'fouls', 0);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Reset Fouls
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

