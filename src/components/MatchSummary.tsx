import React from 'react';
import { GameState } from '../types';

interface MatchSummaryProps {
  gameState: GameState;
}

export const MatchSummary: React.FC<MatchSummaryProps> = ({ gameState }) => {
  const { homeTeam, awayTeam, gamePreset } = gameState;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Match Summary</h2>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {homeTeam.logo ? (
                  <img src={homeTeam.logo} alt="Home" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                    {homeTeam.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="font-semibold">{homeTeam.name}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">vs</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{awayTeam.name}</span>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {awayTeam.logo ? (
                  <img src={awayTeam.logo} alt="Away" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                    {awayTeam.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{gamePreset.name}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Game Type</span>
            <span className="font-medium capitalize">{gamePreset.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Format</span>
            <span className="font-medium capitalize">{gamePreset.format}</span>
          </div>
          <div className="flex justify-between">
            <span>Half Duration</span>
            <span className="font-medium">{gamePreset.halfDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Total Halves</span>
            <span className="font-medium">{gamePreset.totalHalves}</span>
          </div>
          <div className="flex justify-between">
            <span>Extra Time</span>
            <span className="font-medium">
              {gamePreset.hasExtraTime
                ? `${gamePreset.extraTimeDuration} minutes per half`
                : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Penalties</span>
            <span className="font-medium">{gamePreset.hasPenalties ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span>Allows Draws</span>
            <span className="font-medium">{gamePreset.allowsDraws ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {gamePreset.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {gamePreset.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchSummary;
