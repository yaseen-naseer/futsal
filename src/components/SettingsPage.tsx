import React, { useState, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { GameState } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { Upload, RotateCcw } from 'lucide-react';

interface SettingsPageProps {
  gameState: GameState;
  updateTournamentLogo: (logo: string) => void;
  updateTournamentName: (name: string) => void;
  resetGame: (options?: { force?: boolean }) => void;
  updateTeam: (
    team: 'home' | 'away',
    field: 'score' | 'fouls',
    value: number,
  ) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const formatKey = (code: string) => {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
};

export const SettingsPage: React.FC<SettingsPageProps> = ({
  gameState,
  updateTournamentLogo,
  updateTournamentName,
  resetGame,
  updateTeam,
  theme,
  toggleTheme,
}) => {
  const {
    settings,
    toggleUndo,
    toggleRedo,
    setHomeShortcut,
    setAwayShortcut,
  } = useSettings();

  const [tournamentLogoError, setTournamentLogoError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const tournamentLogoUrlRef = useRef<string | null>(null);

  const handleTournamentLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      setTournamentLogoError('Please upload a valid image (SVG not allowed).');
      return;
    }

    const url = URL.createObjectURL(file);
    if (tournamentLogoUrlRef.current) {
      URL.revokeObjectURL(tournamentLogoUrlRef.current);
    }
    tournamentLogoUrlRef.current = url;
    updateTournamentLogo(url);
    setTournamentLogoError('');
  };

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

  const cancelResetGame = () => setShowResetConfirm(false);

  const scoreboardUrl = `${window.location.origin}/scoreboard?embed=true&theme=${theme}`;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
      <div className="space-y-4 mb-8">
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
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="w-4 h-4"
          />
          <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Scoreboard Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={scoreboardUrl}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              onClick={() => navigator.clipboard.writeText(scoreboardUrl)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
          Keyboard Shortcuts
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Home Possession Key
            </label>
            <input
              type="text"
              readOnly
              value={formatKey(settings.homeShortcut)}
              onKeyDown={e => {
                e.preventDefault();
                setHomeShortcut(e.code);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Away Possession Key
            </label>
            <input
              type="text"
              readOnly
              value={formatKey(settings.awayShortcut)}
              onKeyDown={e => {
                e.preventDefault();
                setAwayShortcut(e.code);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Game Settings
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tournament Name
            </label>
            <input
              type="text"
              value={gameState.tournamentName}
              onChange={e => updateTournamentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tournament Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                {gameState.tournamentLogo ? (
                  <img src={gameState.tournamentLogo} alt="Tournament" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-xs text-center">No Logo</span>
                )}
              </div>
              <div className="flex gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                  <input type="file" accept="image/*" onChange={handleTournamentLogoUpload} className="hidden" />
                </label>
                {gameState.tournamentLogo && (
                  <button
                    onClick={() => updateTournamentLogo('')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
            {tournamentLogoError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{tournamentLogoError}</p>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
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

        <div className="border-t pt-6 mt-6">
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
