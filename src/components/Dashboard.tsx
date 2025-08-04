import React, { useState } from 'react';
import { GameState, Team } from '../types';
import { ExternalControlInfo } from './ExternalControlInfo';
import { GamePresetSelector } from './GamePresetSelector';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus,
  Minus,
  Settings,
  Upload,
  Monitor,
  BarChart3,
  Timer
} from 'lucide-react';

interface DashboardProps {
  gameState: GameState;
  updateTeam: (team: 'home' | 'away', field: 'name' | 'score' | 'fouls' | 'logo', value: string | number) => void;
  updateTournamentLogo: (logo: string) => void;
  updateTeamStats: (team: 'home' | 'away', stat: keyof Team['stats'], value: number) => void;
  switchBallPossession: (team: 'home' | 'away') => void;
  updateTime: (minutes: number, seconds: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  updatePeriod: (period: number) => void;
  changeGamePreset: (presetIndex: number) => void;
  resetGame: () => void;
  onViewChange: (view: 'scoreboard' | 'dashboard' | 'overlay' | 'stats' | 'possession') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  gameState,
  updateTeam,
  updateTournamentLogo,
  updateTeamStats,
  switchBallPossession,
  updateTime,
  toggleTimer,
  resetTimer,
  updatePeriod,
  changeGamePreset,
  resetGame,
  onViewChange,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'timer' | 'format' | 'settings'>('teams');

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

  const adjustTime = (type: 'minutes' | 'seconds', delta: number) => {
    const { minutes, seconds } = gameState.time;
    if (type === 'minutes') {
      const newMinutes = Math.max(0, Math.min(60, minutes + delta));
      updateTime(newMinutes, seconds);
    } else {
      let newSeconds = seconds + delta;
      let newMinutes = minutes;
      
      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes = Math.min(60, minutes + 1);
      } else if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes = Math.max(0, minutes - 1);
      }
      
      updateTime(newMinutes, newSeconds);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Futsal Scoreboard Control</h1>
            <div className="flex gap-3">
              <button
                onClick={() => onViewChange('scoreboard')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Monitor className="w-4 h-4" />
                View Scoreboard
              </button>
              <button
                onClick={() => onViewChange('overlay')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Monitor className="w-4 h-4" />
                Streaming Overlay
              </button>
              <button
                onClick={() => onViewChange('stats')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Stats Tracker
              </button>
              <button
                onClick={() => onViewChange('possession')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Timer className="w-4 h-4" />
                Possession Control
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['teams', 'timer', 'format', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'format' ? 'Game Format' : tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Teams Tab */}
        {activeTab === 'teams' && (
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
                    gameState.isRunning 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
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
                      gameState.isRunning
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
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
        )}

        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">Timer Control</h3>
            
            <div className="space-y-8">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-green-600 mb-4">
                  {gameState.time.minutes.toString().padStart(2, '0')}:
                  {gameState.time.seconds.toString().padStart(2, '0')}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  gameState.isRunning 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    gameState.isRunning ? 'bg-green-500' : 'bg-red-500'
                  } ${gameState.isRunning ? 'animate-pulse' : ''}`}></div>
                  <span className="font-semibold">
                    {gameState.isRunning ? 'RUNNING' : 'PAUSED'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">Period {gameState.half}</span>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    gameState.isRunning
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {gameState.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {gameState.isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Time Adjustment */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Minutes</label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => adjustTime('minutes', -1)}
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                      {gameState.time.minutes}
                    </span>
                    <button
                      onClick={() => adjustTime('minutes', 1)}
                      className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Seconds</label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => adjustTime('seconds', -1)}
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                      {gameState.time.seconds}
                    </span>
                    <button
                      onClick={() => adjustTime('seconds', 1)}
                      className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Period Control */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-3">Game Period</label>
                <div className="text-sm text-gray-600 mb-3">
                  {gameState.half === 1 ? 'First Half' : gameState.half === 2 ? 'Second Half' : `Extra Time ${gameState.half - 2}`}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => updatePeriod(Math.max(1, gameState.half - 1))}
                    className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">
                    {gameState.half}
                  </span>
                  <button
                    onClick={() => updatePeriod(gameState.half + 1)}
                    className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Current Format: {gameState.gamePreset.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Format Tab */}
        {activeTab === 'format' && (
          <GamePresetSelector
            currentPreset={gameState.gamePreset}
            onPresetChange={changeGamePreset}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
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
                  <RotateCcw className="w-5 h-5" />
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
        )}
      </div>
    </div>
  );
};