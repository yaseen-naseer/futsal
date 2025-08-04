import React, { useState } from 'react';
import { GameState } from '../types';
import { Monitor, BarChart3, Timer as TimerIcon } from 'lucide-react';
import { TeamsTab } from './dashboard/TeamsTab';
import { TimerTab } from './dashboard/TimerTab';
import { FormatTab } from './dashboard/FormatTab';
import { SettingsTab } from './dashboard/SettingsTab';

interface DashboardProps {
  gameState: GameState;
  updateTeam: <T extends 'name' | 'score' | 'fouls' | 'logo'>(
    team: 'home' | 'away',
    field: T,
    value: T extends 'name' | 'logo' ? string : number
  ) => void;
  updateTournamentLogo: (logo: string) => void;
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
  updateTime,
  toggleTimer,
  resetTimer,
  updatePeriod,
  changeGamePreset,
  resetGame,
  onViewChange,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'timer' | 'format' | 'settings'>('teams');

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
                <TimerIcon className="w-4 h-4" />
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
              {(['teams', 'timer', 'format', 'settings'] as Array<'teams' | 'timer' | 'format' | 'settings'>).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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

        {activeTab === 'teams' && (
          <TeamsTab
            gameState={gameState}
            updateTeam={updateTeam}
            updateTournamentLogo={updateTournamentLogo}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
          />
        )}

        {activeTab === 'timer' && (
          <TimerTab
            gameState={gameState}
            updateTime={updateTime}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            updatePeriod={updatePeriod}
          />
        )}

        {activeTab === 'format' && (
          <FormatTab currentPreset={gameState.gamePreset} onPresetChange={changeGamePreset} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab resetGame={resetGame} updateTeam={updateTeam} />
        )}
      </div>
    </div>
  );
};

