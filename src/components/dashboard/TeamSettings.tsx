import React from 'react';
import { GameState } from '../../types';
import { Play, Pause, RotateCcw, Plus, Minus, Upload } from 'lucide-react';

interface TeamSettingsProps {
  gameState: GameState;
  updateTeam: (team: 'home' | 'away', field: 'name' | 'score' | 'fouls' | 'logo', value: string | number) => void;
  updateTournamentLogo: (logo: string) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}

export const TeamSettings: React.FC<TeamSettingsProps> = ({
  gameState,
  updateTeam,
  updateTournamentLogo,
  toggleTimer,
  resetTimer,
}) => {
  const handleImageUpload = (team: 'home' | 'away', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateTeam(team, 'logo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTournamentLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateTournamentLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustScore = (team: 'home' | 'away', delta: number) => {
    const currentScore = gameState[team === 'home' ? 'homeTeam' : 'awayTeam'].score;
    const newScore = Math.max(0, currentScore + delta);
    updateTeam(team, 'score', newScore);
  };

  const adjustFouls = (team: 'home' | 'away', delta: number) => {
    const currentFouls = gameState[team === 'home' ? 'homeTeam' : 'awayTeam'].fouls;
    const newFouls = Math.max(0, currentFouls + delta);
    updateTeam(team, 'fouls', newFouls);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Tournament Logo Section */}
      <div className="lg:col-span-2 bg-purple-50 rounded-xl border border-purple-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Tournament Logo</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300">
            {gameState.tournamentLogo ? (
              <img src={gameState.tournamentLogo} alt="Tournament" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 text-xs text-center">No Logo</span>
            )}
          </div>
          <div className="flex gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Tournament Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleTournamentLogoUpload}
                className="hidden"
              />
            </label>
            {gameState.tournamentLogo && (
              <button
                onClick={() => updateTournamentLogo('')}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Remove Logo
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <p>Upload a tournament logo to display at the top of the scoreboard.</p>
            <p className="text-xs text-gray-500 mt-1">Leave blank to show no header logo.</p>
          </div>
        </div>
      </div>

      {/* Timer Controls - Quick Access */}
      <div className="lg:col-span-2 bg-green-50 rounded-xl border border-green-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono font-bold text-green-600">
              {gameState.time.minutes.toString().padStart(2, '0')}:
              {gameState.time.seconds.toString().padStart(2, '0')}
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              gameState.isRunning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                gameState.isRunning ? 'bg-green-500' : 'bg-red-500'
              } ${gameState.isRunning ? 'animate-pulse' : ''}`}></div>
              <span className="font-semibold">
                {gameState.isRunning ? 'RUNNING' : 'PAUSED'}
              </span>
            </div>
            <span className="text-sm text-gray-600">Period {gameState.period}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTimer}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                gameState.isRunning ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {gameState.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {gameState.isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Home Team */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-6">Home Team</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input
              type="text"
              value={gameState.homeTeam.name}
              onChange={(e) => updateTeam('home', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                {gameState.homeTeam.logo ? (
                  <img src={gameState.homeTeam.logo} alt="Home" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{gameState.homeTeam.name.charAt(0)}</span>
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('home', e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustScore('home', -1)}
                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-3xl font-bold text-blue-600 min-w-[4rem] text-center">
                {gameState.homeTeam.score}
              </span>
              <button
                onClick={() => adjustScore('home', 1)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fouls</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustFouls('home', -1)}
                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-red-600 min-w-[3rem] text-center">
                {gameState.homeTeam.fouls}
              </span>
              <button
                onClick={() => adjustFouls('home', 1)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Away Team */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-6">Away Team</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input
              type="text"
              value={gameState.awayTeam.name}
              onChange={(e) => updateTeam('away', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                {gameState.awayTeam.logo ? (
                  <img src={gameState.awayTeam.logo} alt="Away" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{gameState.awayTeam.name.charAt(0)}</span>
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('away', e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustScore('away', -1)}
                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-3xl font-bold text-red-600 min-w-[4rem] text-center">
                {gameState.awayTeam.score}
              </span>
              <button
                onClick={() => adjustScore('away', 1)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fouls</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustFouls('away', -1)}
                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-red-600 min-w-[3rem] text-center">
                {gameState.awayTeam.fouls}
              </span>
              <button
                onClick={() => adjustFouls('away', 1)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
