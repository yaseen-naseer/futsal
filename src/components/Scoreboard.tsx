import React from 'react';
import { GameState } from '../types';
import { getHalfName } from '../utils/gamePresets';

interface ScoreboardProps {
  gameState: GameState;
  width?: number;
  height?: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ gameState, width, height }) => {
  const period = getHalfName(gameState.half, gameState.gamePreset, gameState.matchPhase);
  const style: React.CSSProperties = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  return (
    <div
      className="flex items-center justify-between bg-black/70 text-white px-4 py-2 rounded"
      style={style}
    >
      <div className="flex items-center gap-2">
        {gameState.homeTeam.logo && (
          <img
            src={gameState.homeTeam.logo}
            alt="Home logo"
            className="h-8 w-8 object-contain"
          />
        )}
        <span className="font-bold text-xl">{gameState.homeTeam.name}</span>
      </div>
      <div className="text-3xl font-bold">
        {gameState.homeTeam.score} - {gameState.awayTeam.score}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl">{gameState.awayTeam.name}</span>
        {gameState.awayTeam.logo && (
          <img
            src={gameState.awayTeam.logo}
            alt="Away logo"
            className="h-8 w-8 object-contain"
          />
        )}
      </div>
      <div className="flex flex-col items-end text-sm ml-4">
        <span className="font-mono text-lg">
          {String(gameState.time.minutes).padStart(2, '0')}:
          {String(gameState.time.seconds).padStart(2, '0')}
        </span>
        <span>{period}</span>
      </div>
    </div>
  );
};
