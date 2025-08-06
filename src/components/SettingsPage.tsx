import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { GameState } from '../types';
import { ExternalControlInfo } from './ExternalControlInfo';
import { ConfirmModal } from './ConfirmModal';

interface SettingsPageProps {
  gameState: GameState;
  updateTeam: (team: 'home' | 'away', field: 'score' | 'fouls', value: number) => void;
  resetGame: (options?: { force?: boolean }) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  gameState,
  updateTeam,
  resetGame,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

    if (!hasStarted) {
      resetGame({ force: true });
    } else {
      setShowResetConfirm(true);
    }
  };

  const confirmResetGame = () => {
    resetGame({ force: true });
    setShowResetConfirm(false);
  };

  const cancelResetGame = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">Game Settings</h3>

          <div className="space-y-8">
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
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h4>
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
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Game"
        message="Are you sure you want to reset the entire game?"
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={confirmResetGame}
        onCancel={cancelResetGame}
      />
    </div>
  );
};

export default SettingsPage;
