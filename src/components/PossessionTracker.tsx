import React from 'react';
import { GameState } from '../types';
import { Timer, Users, Play, Pause } from 'lucide-react';

interface PossessionTrackerProps {
  gameState: GameState;
  switchBallPossession: (team: 'home' | 'away') => void;
}

export const PossessionTracker: React.FC<PossessionTrackerProps> = ({
  gameState,
  switchBallPossession,
}) => {
  const { homeTeam, awayTeam, ballPossession, isRunning } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Timer className="w-6 h-6 text-green-600" />
              Ball Possession Control
            </h1>
            <div className="text-sm text-gray-600">
              Dedicated Possession Operator Interface
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Match Status</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                isRunning 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isRunning ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="font-semibold">
                  {isRunning ? 'MATCH LIVE' : 'MATCH PAUSED'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Score</div>
              <div className="text-xl font-bold">
                <span className="text-blue-600">{homeTeam.name} {homeTeam.score}</span>
                <span className="text-gray-400 mx-2">-</span>
                <span className="text-red-600">{awayTeam.score} {awayTeam.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Possession Control */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            Ball Possession Control
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Home Team Button */}
            <button
              onClick={() => switchBallPossession('home')}
              className={`p-8 rounded-xl border-4 transition-all transform hover:scale-105 ${
                ballPossession === 'home'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  {homeTeam.logo ? (
                    <img 
                      src={homeTeam.logo} 
                      alt={homeTeam.name}
                      className="w-full h-full object-cover rounded-full border-2 border-current"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {homeTeam.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="font-bold text-lg mb-2">{homeTeam.name}</div>
                <div className="text-sm">Click for Possession (A or 1)</div>
                <div className="text-2xl font-bold">{homeTeam.stats.possession}%</div>
                {ballPossession === 'home' && (
                  <div className="mt-2 text-xs font-semibold text-blue-600">
                    ● CURRENT POSSESSION
                  </div>
                )}
              </div>
            </button>

            {/* Center Status */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-3">Current Ball Possession</div>
              <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-full font-bold text-lg ${
                ballPossession === 'home' 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                  : 'bg-red-100 text-red-700 border-2 border-red-300'
              }`}>
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  ballPossession === 'home' ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
                {ballPossession === 'home' ? homeTeam.name : awayTeam.name}
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                Click team buttons to switch possession (only when timer is running)
              </div>
            </div>

            {/* Away Team Button */}
            <button
              onClick={() => switchBallPossession('away')}
              className={`p-8 rounded-xl border-4 transition-all transform hover:scale-105 ${
                ballPossession === 'away'
                  ? 'border-red-500 bg-red-50 text-red-700 shadow-lg'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  {awayTeam.logo ? (
                    <img 
                      src={awayTeam.logo} 
                      alt={awayTeam.name}
                      className="w-full h-full object-cover rounded-full border-2 border-current"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {awayTeam.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="font-bold text-lg mb-2">{awayTeam.name}</div>
                <div className="text-sm mb-2">Click for Possession</div>
                <div className="text-2xl font-bold">{awayTeam.stats.possession}%</div>
                {ballPossession === 'away' && (
                  <div className="mt-2 text-xs font-semibold text-red-600">
                    ● CURRENT POSSESSION
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Possession Summary</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{homeTeam.name}</div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-xl font-bold text-blue-600">{homeTeam.stats.possession}%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{awayTeam.name}</div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xl font-bold text-red-600">{awayTeam.stats.possession}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-100 rounded-lg h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${homeTeam.stats.possession}%` }}
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-green-50 rounded-xl border border-green-200 p-6">
          <h4 className="font-semibold text-green-900 mb-3">Operator Instructions</h4>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• <strong>Click team buttons</strong> to switch ball possession when play changes</li>
            <li>• <strong>Keyboard shortcuts</strong>: Press <kbd className="bg-green-100 px-2 py-1 rounded text-xs">A</kbd> or <kbd className="bg-green-100 px-2 py-1 rounded text-xs">1</kbd> for Home team, <kbd className="bg-green-100 px-2 py-1 rounded text-xs">D</kbd> or <kbd className="bg-green-100 px-2 py-1 rounded text-xs">2</kbd> for Away team</li>
            <li>• <strong>Shortcuts only work when timer is running</strong> - prevents accidental possession changes during breaks</li>
            <li>• <strong>Possession percentages</strong> are calculated automatically based on time</li>
            <li>• <strong>Only track possession changes</strong> - other operators handle different stats</li>
            <li>• <strong>Watch the match closely</strong> for turnovers, throw-ins, and restarts</li>
            <li>• <strong>Updates are instant</strong> - all displays will show your changes immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
