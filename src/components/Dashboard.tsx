import React, { useState, useRef, useEffect } from 'react';
import { GameState } from '../types';
import { getHalfName } from '../utils/gamePresets';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Upload,
  BarChart3,
  Undo2,
  Redo2,
  Settings,
  Monitor,
  SlidersHorizontal,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { GamePresetSelector } from './GamePresetSelector';

interface DashboardProps {
  gameState: GameState;
  updateTeam: (team: 'home' | 'away', field: 'name' | 'score' | 'fouls' | 'logo', value: string | number) => void;
  updateTime: (minutes: number, seconds: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  updatePeriod: (period: number) => void;
  changeGamePreset: (presetIndex: number) => void;
  undo: () => void;
  redo: () => void;
  addPlayer: (team: 'home' | 'away', name: string, role: 'starter' | 'substitute') => void;
  removePlayer: (team: 'home' | 'away', playerId: string) => void;
  onViewChange: (
    view: 'dashboard' | 'stats' | 'settings'
  ) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  gameState,
  updateTeam,
  updateTime,
  toggleTimer,
  resetTimer,
  updatePeriod,
  changeGamePreset,
  undo,
  redo,
  addPlayer,
  removePlayer,
  onViewChange,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'timer' | 'format'>('teams');
  const { settings } = useSettings();

  const [homeLogoError, setHomeLogoError] = useState('');
  const [awayLogoError, setAwayLogoError] = useState('');
  const [homePlayerName, setHomePlayerName] = useState('');
  const [awayPlayerName, setAwayPlayerName] = useState('');
  const [homePlayerRole, setHomePlayerRole] = useState<'starter' | 'substitute'>('starter');
  const [awayPlayerRole, setAwayPlayerRole] = useState<'starter' | 'substitute'>('starter');

  const homeLogoUrlRef = useRef<string | null>(null);
  const awayLogoUrlRef = useRef<string | null>(null);

  const homePlayers = gameState.homeTeam.players ?? [];
  const awayPlayers = gameState.awayTeam.players ?? [];

  const playerLimits =
    gameState.gamePreset.type === 'football'
      ? { starters: 11, substitutes: 12, total: 23 }
      : { starters: 5, substitutes: 9, total: 14 };

  const homeStarters = homePlayers.filter(p => p.role === 'starter');
  const homeSubs = homePlayers.filter(p => p.role === 'substitute');
  const awayStarters = awayPlayers.filter(p => p.role === 'starter');
  const awaySubs = awayPlayers.filter(p => p.role === 'substitute');

  const hasStarted =
    gameState.isRunning ||
    gameState.half !== 1 ||
    gameState.time.minutes !== gameState.gamePreset.halfDuration ||
    gameState.time.seconds !== 0 ||
    gameState.homeTeam.score !== 0 ||
    gameState.awayTeam.score !== 0 ||
    gameState.homeTeam.fouls !== 0 ||
    gameState.awayTeam.fouls !== 0 ||
    Object.entries(gameState.homeTeam.stats).some(
      ([key, value]) => key !== 'possession' && value !== 0,
    ) ||
    Object.entries(gameState.awayTeam.stats).some(
      ([key, value]) => key !== 'possession' && value !== 0,
    );

  const handleImageUpload = (team: 'home' | 'away', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const errorMessage = 'Please upload a valid image (SVG not allowed).';
      if (team === 'home') {
        setHomeLogoError(errorMessage);
      } else {
        setAwayLogoError(errorMessage);
      }
      return;
    }

    const url = URL.createObjectURL(file);
    const logoUrlRef = team === 'home' ? homeLogoUrlRef : awayLogoUrlRef;
    if (logoUrlRef.current) {
      URL.revokeObjectURL(logoUrlRef.current);
    }
    logoUrlRef.current = url;
    updateTeam(team, 'logo', url);

    if (team === 'home') {
      setHomeLogoError('');
    } else {
      setAwayLogoError('');
    }
  };

  useEffect(() => {
    const homeUrl = homeLogoUrlRef.current;
    const awayUrl = awayLogoUrlRef.current;
    return () => {
      if (homeUrl) {
        URL.revokeObjectURL(homeUrl);
      }
      if (awayUrl) {
        URL.revokeObjectURL(awayUrl);
      }
    };
  }, []);

  const adjustTime = (type: 'minutes' | 'seconds', delta: number) => {
    const { minutes, seconds } = gameState.time;
    const maxMinutes =
      gameState.matchPhase === 'regular'
        ? gameState.gamePreset.halfDuration
        : gameState.matchPhase === 'extra-time'
        ? gameState.gamePreset.extraTimeDuration
        : 0;
    if (maxMinutes === 0) {
      return;
    }
    if (minutes === 0 && seconds === 0 && delta < 0) {
      return;
    }
    if (type === 'minutes') {
      const newMinutes = Math.max(0, Math.min(maxMinutes, minutes + delta));
      updateTime(newMinutes, seconds);
    } else {
      let newSeconds = seconds + delta;
      let newMinutes = minutes;

      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes = Math.min(maxMinutes, minutes + 1);
      } else if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes = Math.max(0, minutes - 1);
      }

      if (newMinutes >= maxMinutes) {
        newMinutes = maxMinutes;
        if (newSeconds > 0) {
          newSeconds = 0;
        }
      }

      updateTime(newMinutes, newSeconds);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Futsal Control Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => window.open('/scoreboard', '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Monitor className="w-4 h-4" />
                Scoreboard
              </button>
              <button
                onClick={() => window.open('/scoreboard/control', '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Control Panel
              </button>
              <button
                onClick={() => onViewChange('stats')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Stats Tracker
              </button>
              <button
                onClick={() => onViewChange('settings')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              {settings.showUndo && (
                <button
                  onClick={undo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo
                </button>
              )}
              {settings.showRedo && (
                <button
                  onClick={redo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Redo2 className="w-4 h-4" />
                  Redo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'teams'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'timer'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Timer
            </button>
            <button
              onClick={() => !hasStarted && setActiveTab('format')}
              disabled={hasStarted}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'format'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : hasStarted
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Game Format
            </button>
          </div>
        </div>

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timer Controls - Quick Access */}
            <div className="lg:col-span-2 bg-green-50 dark:bg-green-900 rounded-xl border border-green-200 dark:border-green-700 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                    {gameState.time.minutes.toString().padStart(2, '0')}:
                    {gameState.time.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    gameState.isRunning
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      gameState.isRunning
                        ? 'bg-green-500 dark:bg-green-400'
                        : 'bg-red-500 dark:bg-red-400'
                    } ${gameState.isRunning ? 'animate-pulse' : ''}`}></div>
                    <span className="font-semibold">
                      {gameState.isRunning ? 'RUNNING' : 'PAUSED'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Period {gameState.period}</span>
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
                </div>
              </div>
            </div>

            {/* Home Team */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-6">Home Team</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={gameState.homeTeam.name}
                    onChange={(e) => updateTeam('home', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                      {gameState.homeTeam.logo ? (
                        <img src={gameState.homeTeam.logo} alt="Home" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">{gameState.homeTeam.name.charAt(0)}</span>
                      )}
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
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
                  {homeLogoError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">{homeLogoError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Players</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={homePlayerName}
                      onChange={(e) => setHomePlayerName(e.target.value)}
                      placeholder="Player name"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <select
                      value={homePlayerRole}
                      onChange={e => setHomePlayerRole(e.target.value as 'starter' | 'substitute')}
                      className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="starter">Starter</option>
                      <option value="substitute">Substitute</option>
                    </select>
                    <button
                      onClick={() => {
                        if (homePlayerName.trim()) {
                          addPlayer('home', homePlayerName.trim(), homePlayerRole);
                          setHomePlayerName('');
                          setHomePlayerRole('starter');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Starters ({homeStarters.length}/{playerLimits.starters})
                      </h4>
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {homeStarters.map(p => (
                          <li
                            key={p.id}
                            className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span>
                              {p.name} - G:{p.goals} YC:{p.yellowCards} RC:{p.redCards}
                            </span>
                            <button
                              onClick={() => removePlayer('home', p.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Substitutes ({homeSubs.length}/{playerLimits.substitutes})
                      </h4>
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {homeSubs.map(p => (
                          <li
                            key={p.id}
                            className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span>
                              {p.name} - G:{p.goals} YC:{p.yellowCards} RC:{p.redCards}
                            </span>
                            <button
                              onClick={() => removePlayer('home', p.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-300 mb-6">Away Team</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={gameState.awayTeam.name}
                    onChange={(e) => updateTeam('away', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                      {gameState.awayTeam.logo ? (
                        <img src={gameState.awayTeam.logo} alt="Away" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">{gameState.awayTeam.name.charAt(0)}</span>
                      )}
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
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
                  {awayLogoError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">{awayLogoError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Players</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={awayPlayerName}
                      onChange={(e) => setAwayPlayerName(e.target.value)}
                      placeholder="Player name"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <select
                      value={awayPlayerRole}
                      onChange={e => setAwayPlayerRole(e.target.value as 'starter' | 'substitute')}
                      className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="starter">Starter</option>
                      <option value="substitute">Substitute</option>
                    </select>
                    <button
                      onClick={() => {
                        if (awayPlayerName.trim()) {
                          addPlayer('away', awayPlayerName.trim(), awayPlayerRole);
                          setAwayPlayerName('');
                          setAwayPlayerRole('starter');
                        }
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Starters ({awayStarters.length}/{playerLimits.starters})
                      </h4>
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {awayStarters.map(p => (
                          <li
                            key={p.id}
                            className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span>
                              {p.name} - G:{p.goals} YC:{p.yellowCards} RC:{p.redCards}
                            </span>
                            <button
                              onClick={() => removePlayer('away', p.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Substitutes ({awaySubs.length}/{playerLimits.substitutes})
                      </h4>
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {awaySubs.map(p => (
                          <li
                            key={p.id}
                            className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span>
                              {p.name} - G:{p.goals} YC:{p.yellowCards} RC:{p.redCards}
                            </span>
                            <button
                              onClick={() => removePlayer('away', p.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">Timer Control</h3>

            <div className="space-y-8">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-green-600 dark:text-green-400 mb-4">
                  {gameState.time.minutes.toString().padStart(2, '0')}:
                  {gameState.time.seconds.toString().padStart(2, '0')}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  gameState.isRunning
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    gameState.isRunning
                      ? 'bg-green-500 dark:bg-green-400'
                      : 'bg-red-500 dark:bg-red-400'
                  } ${gameState.isRunning ? 'animate-pulse' : ''}`}></div>
                  <span className="font-semibold">
                    {gameState.isRunning ? 'RUNNING' : 'PAUSED'}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {getHalfName(gameState.half, gameState.gamePreset, gameState.matchPhase)}
                </span>
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Time Adjustment */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Minutes</label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => adjustTime('minutes', -1)}
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                      {gameState.time.minutes}
                    </span>
                    <button
                      onClick={() => adjustTime('minutes', 1)}
                      className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Seconds</label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => adjustTime('seconds', -1)}
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                      {gameState.time.seconds}
                    </span>
                    <button
                      onClick={() => adjustTime('seconds', 1)}
                      className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Period Control */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Game Period</label>
                {(() => {
                  const preset = gameState.gamePreset;
                  const maxHalf = preset.hasExtraTime
                    ? (preset.hasPenalties ? 5 : 4)
                    : preset.hasPenalties ? 5 : preset.totalHalves;

                  const getNextHalf = () => {
                    if (!preset.hasExtraTime && preset.hasPenalties && gameState.half === 2) {
                      return 5; // direct to penalties
                    }
                    return gameState.half + 1;
                  };

                  const getPrevHalf = () => {
                    if (!preset.hasExtraTime && preset.hasPenalties && gameState.half === 5) {
                      return 2; // back to second half
                    }
                    return Math.max(1, gameState.half - 1);
                  };

                  return (
                    <>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {getHalfName(gameState.half, preset, gameState.matchPhase)}
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => updatePeriod(getPrevHalf())}
                          disabled={gameState.half > 1}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            gameState.half > 1
                              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                          {gameState.half}
                        </span>
                        <button
                          onClick={() => updatePeriod(getNextHalf())}
                          disabled={gameState.half >= maxHalf}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            gameState.half >= maxHalf
                              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  );
                })()}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Current Format: {gameState.gamePreset.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Format Tab */}
        {activeTab === 'format' && (
          <div className="max-w-4xl mx-auto">
            {hasStarted ? (
              <div className="text-center text-gray-600 dark:text-gray-300">
                Game format cannot be changed after the game has started.
              </div>
            ) : (
              <GamePresetSelector
                currentPreset={gameState.gamePreset}
                onPresetChange={changeGamePreset}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
