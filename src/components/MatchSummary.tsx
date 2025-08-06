import React from 'react';
import { GameState } from '../types';
import { Info } from 'lucide-react';

interface MatchSummaryProps {
  gameState: GameState;
}

export const MatchSummary: React.FC<MatchSummaryProps> = ({ gameState }) => {
  const { homeTeam, awayTeam, gamePreset, half, matchPhase } = gameState;

  return (
    <div className="bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-200 dark:border-blue-700 p-4 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5" />
        Match Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900 dark:text-blue-100">
        <div>
          <span className="font-medium">Home Team:</span> {homeTeam.name}
        </div>
        <div>
          <span className="font-medium">Away Team:</span> {awayTeam.name}
        </div>
        <div>
          <span className="font-medium">Format:</span> {gamePreset.name}
        </div>
        <div>
          <span className="font-medium">Half Duration:</span> {gamePreset.halfDuration} min
        </div>
        <div>
          <span className="font-medium">Total Halves:</span> {gamePreset.totalHalves}
        </div>
        {gamePreset.hasExtraTime && (
          <div>
            <span className="font-medium">Extra Time:</span> {gamePreset.extraTimeDuration} min halves
          </div>
        )}
        {gamePreset.hasPenalties && (
          <div>
            <span className="font-medium">Penalties:</span> Yes
          </div>
        )}
        <div>
          <span className="font-medium">Current Period:</span> {half}
        </div>
        <div>
          <span className="font-medium">Phase:</span> {matchPhase}
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
