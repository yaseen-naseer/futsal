import React from 'react';
import { GameState, Team } from '../types';
import {
  Plus,
  Minus,
  Target,
  XCircle,
  CornerDownLeft,
  Flag,
  Square,
  Timer,
  Goal,
  Undo2,
  Redo2,
  Hand,
} from 'lucide-react';
import { formatTime } from '../utils/format';
import { useSettings } from '../hooks/useSettings';

interface StatsTrackerProps {
  gameState: GameState;
  updateTeamStats: (team: 'home' | 'away', stat: keyof Team['stats'], value: number) => void;
  updateTeamScore: (team: 'home' | 'away', value: number) => void;
  updateTeamFouls: (team: 'home' | 'away', value: number) => void;
  updatePlayerStats: (
    team: 'home' | 'away',
    playerId: string,
    field: 'goals' | 'yellowCards' | 'redCards',
    value: number,
  ) => void;
  switchBallPossession: (team: 'home' | 'away') => void;
  undo: () => void;
  redo: () => void;
}

export const StatsTracker: React.FC<StatsTrackerProps> = ({
  gameState,
  updateTeamStats,
  updateTeamScore,
  updateTeamFouls,
  updatePlayerStats,
  switchBallPossession,
  undo,
  redo,
}) => {
  const { homeTeam, awayTeam, ballPossession } = gameState;
  const { settings } = useSettings();
  const homePlayers = homeTeam.players ?? [];
  const awayPlayers = awayTeam.players ?? [];

  const totalShotsHome =
    homeTeam.stats.shotsOffTarget + homeTeam.stats.shotsOnTarget;
  const totalShotsAway =
    awayTeam.stats.shotsOffTarget + awayTeam.stats.shotsOnTarget;

  const summaryStats = [
    {
      label: 'Shots on Target',
      home: homeTeam.stats.shotsOnTarget,
      away: awayTeam.stats.shotsOnTarget,
    },
    {
      label: 'Shots Off Target',
      home: homeTeam.stats.shotsOffTarget,
      away: awayTeam.stats.shotsOffTarget,
    },
    {
      label: 'Total Shots',
      home: totalShotsHome,
      away: totalShotsAway,
    },
    {
      label: 'Shot Accuracy',
      home:
        totalShotsHome > 0
          ? `${Math.round((homeTeam.stats.shotsOnTarget / totalShotsHome) * 100)}%`
          : '0%',
      away:
        totalShotsAway > 0
          ? `${Math.round((awayTeam.stats.shotsOnTarget / totalShotsAway) * 100)}%`
          : '0%',
    },
    {
      label: 'Corners',
      home: homeTeam.stats.corners,
      away: awayTeam.stats.corners,
    },
    ...(gameState.gamePreset.type === 'football'
      ? [
          {
            label: 'Offsides',
            home: homeTeam.stats.offsides ?? 0,
            away: awayTeam.stats.offsides ?? 0,
          },
        ]
      : []),
    {
      label: 'Yellow Cards',
      home: homeTeam.stats.yellowCards,
      away: awayTeam.stats.yellowCards,
    },
    {
      label: 'Red Cards',
      home: homeTeam.stats.redCards,
      away: awayTeam.stats.redCards,
    },
    {
      label: 'Fouls',
      home: homeTeam.fouls,
      away: awayTeam.fouls,
    },
    {
      label: 'Possession',
      home: `${homeTeam.stats.possession}%`,
      away: `${awayTeam.stats.possession}%`,
    },
  ];

  const adjustStat = (team: 'home' | 'away', stat: keyof Team['stats'], delta: number) => {
    if (!gameState.isRunning) return;
    const currentValue =
      gameState[team === 'home' ? 'homeTeam' : 'awayTeam'].stats[stat];
    updateTeamStats(team, stat, currentValue + delta);
  };

  const adjustScore = (team: 'home' | 'away', delta: number) => {
    if (!gameState.isRunning) return;
    const currentScore = gameState[team === 'home' ? 'homeTeam' : 'awayTeam'].score;
    updateTeamScore(team, Math.max(0, currentScore + delta));
  };

  const adjustFouls = (team: 'home' | 'away', delta: number) => {
    if (!gameState.isRunning) return;
    const currentFouls = gameState[team === 'home' ? 'homeTeam' : 'awayTeam'].fouls;
    updateTeamFouls(team, Math.max(0, currentFouls + delta));
  };

  const adjustPlayerStat = (
    team: 'home' | 'away',
    playerId: string,
    field: 'goals' | 'yellowCards' | 'redCards',
    delta: number,
  ) => {
    if (!gameState.isRunning) return;
    const teamObj = team === 'home' ? homeTeam : awayTeam;
    const player = (teamObj.players ?? []).find(p => p.id === playerId);
    if (!player) return;
    const newValue = Math.max(0, player[field] + delta);
    updatePlayerStats(team, playerId, field, newValue);
  };

  const StatControl = ({
    label,
    icon: Icon,
    iconColor,
    stat,
    homeValue,
    awayValue,
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    stat: keyof Team['stats'];
    homeValue: number;
    awayValue: number;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{label}</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Home Team */}
        <div className="text-center">
          <div className="text-sm text-blue-600 font-medium mb-2 dark:text-blue-400">{homeTeam.name}</div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => adjustStat('home', stat, -1)}
              disabled={!gameState.isRunning}
              className={`w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 ${
                gameState.isRunning
                  ? 'hover:bg-red-200 dark:hover:bg-red-800'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-blue-600 min-w-[2rem] dark:text-blue-400">
              {stat === 'possession' ? `${homeValue}%` : homeValue}
            </span>
            <button
              onClick={() => adjustStat('home', stat, 1)}
              disabled={!gameState.isRunning}
              className={`w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 ${
                gameState.isRunning
                  ? 'hover:bg-green-200 dark:hover:bg-green-800'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          <div className="text-sm text-red-600 font-medium mb-2 dark:text-red-400">{awayTeam.name}</div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => adjustStat('away', stat, -1)}
              disabled={!gameState.isRunning}
              className={`w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 ${
                gameState.isRunning
                  ? 'hover:bg-red-200 dark:hover:bg-red-800'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-red-600 min-w-[2rem] dark:text-red-400">
              {stat === 'possession' ? `${awayValue}%` : awayValue}
            </span>
            <button
              onClick={() => adjustStat('away', stat, 1)}
              disabled={!gameState.isRunning}
              className={`w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 ${
                gameState.isRunning
                  ? 'hover:bg-green-200 dark:hover:bg-green-800'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Match Statistics Tracker</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  {homeTeam.name} vs {awayTeam.name}
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(gameState.time.minutes, gameState.time.seconds)}</span>
                </div>
                <div
                  className={`px-2 py-1 rounded-full font-medium ${
                    gameState.isRunning
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {gameState.isRunning ? 'Live' : 'Paused'}
                </div>
              </div>
              <div className="flex gap-2">
                {settings.showUndo && (
                  <button
                    onClick={undo}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Undo2 className="w-4 h-4" /> Undo
                  </button>
                )}
                {settings.showRedo && (
                  <button
                    onClick={redo}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Redo2 className="w-4 h-4" /> Redo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ball Possession Control */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-xl border border-green-200 dark:border-green-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Ball Possession Control
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <button
              onClick={() => switchBallPossession('home')}
              className={`p-4 rounded-lg border-2 transition-all ${
                ballPossession === 'home'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{homeTeam.name}</div>
                <div className="text-sm">Has Possession (A or 1)</div>
                <div className="text-lg font-bold mt-1">{homeTeam.stats.possession}%</div>
              </div>
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Possession</div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                ballPossession === 'home'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  ballPossession === 'home' ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
                {ballPossession === 'home' ? homeTeam.name : awayTeam.name}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Press A/1 for Home, D/2 for Away (only when timer running)
              </div>
            </div>

            <button
              onClick={() => switchBallPossession('away')}
              className={`p-4 rounded-lg border-2 transition-all ${
                ballPossession === 'away'
                  ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-500'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{awayTeam.name}</div>
                <div className="text-sm">Has Possession (D or 2)</div>
                <div className="text-lg font-bold mt-1">{awayTeam.stats.possession}%</div>
              </div>
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Goal className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Goals</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Home Team */}
              <div className="text-center">
                <div className="text-sm text-blue-600 font-medium mb-2 dark:text-blue-400">{homeTeam.name}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => adjustScore('home', -1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 ${
                      gameState.isRunning
                        ? 'hover:bg-red-200 dark:hover:bg-red-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-blue-600 min-w-[2rem] dark:text-blue-400">
                    {homeTeam.score}
                  </span>
                  <button
                    onClick={() => adjustScore('home', 1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 ${
                      gameState.isRunning
                        ? 'hover:bg-green-200 dark:hover:bg-green-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Away Team */}
              <div className="text-center">
                <div className="text-sm text-red-600 font-medium mb-2 dark:text-red-400">{awayTeam.name}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => adjustScore('away', -1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 ${
                      gameState.isRunning
                        ? 'hover:bg-red-200 dark:hover:bg-red-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-red-600 min-w-[2rem] dark:text-red-400">
                    {awayTeam.score}
                  </span>
                  <button
                    onClick={() => adjustScore('away', 1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 ${
                      gameState.isRunning
                        ? 'hover:bg-green-200 dark:hover:bg-green-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hand className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Fouls</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Home Team */}
              <div className="text-center">
                <div className="text-sm text-blue-600 font-medium mb-2 dark:text-blue-400">{homeTeam.name}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => adjustFouls('home', -1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 ${
                      gameState.isRunning
                        ? 'hover:bg-red-200 dark:hover:bg-red-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-blue-600 min-w-[2rem] dark:text-blue-400">
                    {homeTeam.fouls}
                  </span>
                  <button
                    onClick={() => adjustFouls('home', 1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 ${
                      gameState.isRunning
                        ? 'hover:bg-green-200 dark:hover:bg-green-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Away Team */}
              <div className="text-center">
                <div className="text-sm text-red-600 font-medium mb-2 dark:text-red-400">{awayTeam.name}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => adjustFouls('away', -1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 ${
                      gameState.isRunning
                        ? 'hover:bg-red-200 dark:hover:bg-red-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-red-600 min-w-[2rem] dark:text-red-400">
                    {awayTeam.fouls}
                  </span>
                  <button
                    onClick={() => adjustFouls('away', 1)}
                    disabled={!gameState.isRunning}
                    className={`w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 ${
                      gameState.isRunning
                        ? 'hover:bg-green-200 dark:hover:bg-green-800'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <StatControl
            label="Shots Off Target"
            icon={XCircle}
            iconColor="text-red-500"
            stat="shotsOffTarget"
            homeValue={homeTeam.stats.shotsOffTarget}
            awayValue={awayTeam.stats.shotsOffTarget}
          />

          <StatControl
            label="Shots on Target"
            icon={Target}
            iconColor="text-green-500"
            stat="shotsOnTarget"
            homeValue={homeTeam.stats.shotsOnTarget}
            awayValue={awayTeam.stats.shotsOnTarget}
          />

          <StatControl
            label="Corners"
            icon={CornerDownLeft}
            iconColor="text-purple-500"
            stat="corners"
            homeValue={homeTeam.stats.corners}
            awayValue={awayTeam.stats.corners}
          />

          {gameState.gamePreset.type === 'football' && (
            <StatControl
              label="Offsides"
              icon={Flag}
              iconColor="text-yellow-500"
              stat="offsides"
              homeValue={homeTeam.stats.offsides ?? 0}
              awayValue={awayTeam.stats.offsides ?? 0}
            />
          )}

          <StatControl
            label="Yellow Cards"
            icon={Square}
            iconColor="text-yellow-400"
            stat="yellowCards"
            homeValue={homeTeam.stats.yellowCards}
            awayValue={awayTeam.stats.yellowCards}
          />

          <StatControl
            label="Red Cards"
            icon={Square}
            iconColor="text-red-600"
            stat="redCards"
            homeValue={homeTeam.stats.redCards}
            awayValue={awayTeam.stats.redCards}
          />
        </div>

        {/* Player Stats */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Player Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-center font-medium text-blue-600 dark:text-blue-400 mb-4">{homeTeam.name}</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-400">
                    <th className="text-left">Player</th>
                    <th className="text-center">G</th>
                    <th className="text-center">YC</th>
                    <th className="text-center">RC</th>
                  </tr>
                </thead>
                <tbody>
                  {homePlayers.map(p => (
                    <tr key={p.id} className="text-gray-700 dark:text-gray-300">
                      <td className="py-1">{p.name}</td>
                      <td className="py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => adjustPlayerStat('home', p.id, 'goals', -1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center dark:bg-red-900 dark:text-red-400 ${gameState.isRunning ? 'hover:bg-red-200 dark:hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{p.goals}</span>
                          <button
                            onClick={() => adjustPlayerStat('home', p.id, 'goals', 1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center dark:bg-green-900 dark:text-green-400 ${gameState.isRunning ? 'hover:bg-green-200 dark:hover:bg-green-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => adjustPlayerStat('home', p.id, 'yellowCards', -1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center dark:bg-red-900 dark:text-red-400 ${gameState.isRunning ? 'hover:bg-red-200 dark:hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{p.yellowCards}</span>
                          <button
                            onClick={() => adjustPlayerStat('home', p.id, 'yellowCards', 1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center dark:bg-green-900 dark:text-green-400 ${gameState.isRunning ? 'hover:bg-green-200 dark:hover:bg-green-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => adjustPlayerStat('home', p.id, 'redCards', -1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center dark:bg-red-900 dark:text-red-400 ${gameState.isRunning ? 'hover:bg-red-200 dark:hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{p.redCards}</span>
                          <button
                            onClick={() => adjustPlayerStat('home', p.id, 'redCards', 1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center dark:bg-green-900 dark:text-green-400 ${gameState.isRunning ? 'hover:bg-green-200 dark:hover:bg-green-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-center font-medium text-red-600 dark:text-red-400 mb-4">{awayTeam.name}</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-400">
                    <th className="text-left">Player</th>
                    <th className="text-center">G</th>
                    <th className="text-center">YC</th>
                    <th className="text-center">RC</th>
                  </tr>
                </thead>
                <tbody>
                  {awayPlayers.map(p => (
                    <tr key={p.id} className="text-gray-700 dark:text-gray-300">
                      <td className="py-1">{p.name}</td>
                      <td className="py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => adjustPlayerStat('away', p.id, 'goals', -1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center dark:bg-red-900 dark:text-red-400 ${gameState.isRunning ? 'hover:bg-red-200 dark:hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{p.goals}</span>
                          <button
                            onClick={() => adjustPlayerStat('away', p.id, 'goals', 1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center dark:bg-green-900 dark:text-green-400 ${gameState.isRunning ? 'hover:bg-green-200 dark:hover:bg-green-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => adjustPlayerStat('away', p.id, 'yellowCards', -1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center dark:bg-red-900 dark:text-red-400 ${gameState.isRunning ? 'hover:bg-red-200 dark:hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{p.yellowCards}</span>
                          <button
                            onClick={() => adjustPlayerStat('away', p.id, 'yellowCards', 1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center dark:bg-green-900 dark:text-green-400 ${gameState.isRunning ? 'hover:bg-green-200 dark:hover:bg-green-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => adjustPlayerStat('away', p.id, 'redCards', -1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center dark:bg-red-900 dark:text-red-400 ${gameState.isRunning ? 'hover:bg-red-200 dark:hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{p.redCards}</span>
                          <button
                            onClick={() => adjustPlayerStat('away', p.id, 'redCards', 1)}
                            disabled={!gameState.isRunning}
                            className={`w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center dark:bg-green-900 dark:text-green-400 ${gameState.isRunning ? 'hover:bg-green-200 dark:hover:bg-green-800' : 'opacity-50 cursor-not-allowed'}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Match Summary</h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="font-semibold text-blue-600 dark:text-blue-400">{homeTeam.name}</div>
            <div className="font-semibold text-gray-600 dark:text-gray-400">Stat</div>
            <div className="font-semibold text-red-600 dark:text-red-400">{awayTeam.name}</div>
            {summaryStats.map((row) => (
              <React.Fragment key={row.label}>
                <div className="font-medium text-gray-900 dark:text-gray-100">{row.home}</div>
                <div className="text-gray-600 dark:text-gray-400">{row.label}</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{row.away}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
