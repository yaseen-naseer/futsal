import React from 'react';
import { GameState, Team } from '../types';
import {
  Plus,
  Minus,
  Target,
  CornerDownLeft,
  Flag,
  AlertTriangle,
  Square,
  Timer
} from 'lucide-react';
import { formatTime } from '../utils/format';

interface StatsTrackerProps {
  gameState: GameState;
  updateTeamStats: (team: 'home' | 'away', stat: keyof Team['stats'], value: number) => void;
  switchBallPossession: (team: 'home' | 'away') => void;
}

export const StatsTracker: React.FC<StatsTrackerProps> = ({
  gameState,
  updateTeamStats,
  switchBallPossession,
}) => {
  const { homeTeam, awayTeam, ballPossession } = gameState;

  const adjustStat = (team: 'home' | 'away', stat: keyof Team['stats'], delta: number) => {
    const currentValue = gameState[team === 'home' ? 'homeTeam' : 'awayTeam'].stats[stat];
    updateTeamStats(team, stat, currentValue + delta);
  };

  const StatControl = ({ 
    label, 
    icon: Icon, 
    stat, 
    homeValue, 
    awayValue 
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    stat: keyof Team['stats'];
    homeValue: number;
    awayValue: number;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{label}</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Home Team */}
        <div className="text-center">
          <div className="text-sm text-blue-600 font-medium mb-2 dark:text-blue-400">{homeTeam.name}</div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => adjustStat('home', stat, -1)}
              className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-blue-600 min-w-[2rem] dark:text-blue-400">
              {stat === 'possession' ? `${homeValue}%` : homeValue}
            </span>
            <button
              onClick={() => adjustStat('home', stat, 1)}
              className="w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800"
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
              className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-red-600 min-w-[2rem] dark:text-red-400">
              {stat === 'possession' ? `${awayValue}%` : awayValue}
            </span>
            <button
              onClick={() => adjustStat('away', stat, 1)}
              className="w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800"
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
          <StatControl
            label="Shots"
            icon={Target}
            stat="shots"
            homeValue={homeTeam.stats.shots}
            awayValue={awayTeam.stats.shots}
          />

          <StatControl
            label="Shots on Target"
            icon={Target}
            stat="shotsOnTarget"
            homeValue={homeTeam.stats.shotsOnTarget}
            awayValue={awayTeam.stats.shotsOnTarget}
          />

          <StatControl
            label="Corners"
            icon={CornerDownLeft}
            stat="corners"
            homeValue={homeTeam.stats.corners}
            awayValue={awayTeam.stats.corners}
          />

          {gameState.gamePreset.type === 'football' && (
            <StatControl
              label="Offsides"
              icon={Flag}
              stat="offsides"
              homeValue={homeTeam.stats.offsides ?? 0}
              awayValue={awayTeam.stats.offsides ?? 0}
            />
          )}

          <StatControl
            label="Yellow Cards"
            icon={Square}
            stat="yellowCards"
            homeValue={homeTeam.stats.yellowCards}
            awayValue={awayTeam.stats.yellowCards}
          />

          <StatControl
            label="Red Cards"
            icon={AlertTriangle}
            stat="redCards"
            homeValue={homeTeam.stats.redCards}
            awayValue={awayTeam.stats.redCards}
          />
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Match Summary</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Shots</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {homeTeam.stats.shots + awayTeam.stats.shots}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Corners</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {homeTeam.stats.corners + awayTeam.stats.corners}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Cards</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {homeTeam.stats.yellowCards + awayTeam.stats.yellowCards + 
                 homeTeam.stats.redCards + awayTeam.stats.redCards}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shot Accuracy</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {homeTeam.stats.shots + awayTeam.stats.shots > 0 
                  ? Math.round(((homeTeam.stats.shotsOnTarget + awayTeam.stats.shotsOnTarget) / 
                      (homeTeam.stats.shots + awayTeam.stats.shots)) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
