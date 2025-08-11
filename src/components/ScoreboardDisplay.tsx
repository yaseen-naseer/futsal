import React from 'react';
import { GameState } from '../types';
import { getHalfName } from '../utils/gamePresets';

interface ScoreboardDisplayOptions {
  showScore?: boolean;
  showFouls?: boolean;
  showHalf?: boolean;
  showTimer?: boolean;
  timerMode?: 'elapsed' | 'remaining';
  layout?: 'horizontal' | 'vertical';
  bgColor?: string;
  textColor?: string;
}

interface ScoreboardDisplayProps {
  gameState: GameState;
  width?: number;
  height?: number;
  options?: ScoreboardDisplayOptions;
}

export const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({ gameState, width, height, options }) => {
  const {
    showScore = true,
    showFouls = false,
    showHalf = true,
    showTimer = true,
    timerMode = 'elapsed',
    layout = 'horizontal',
    bgColor = '#000000',
    textColor = '#ffffff',
  } = options || {};

  const period = getHalfName(gameState.half, gameState.gamePreset, gameState.matchPhase);

  let minutes = gameState.time.minutes;
  let seconds = gameState.time.seconds;

  if (showTimer && timerMode === 'remaining') {
    const total = gameState.gamePreset.halfDuration * 60;
    const elapsed = gameState.time.minutes * 60 + gameState.time.seconds;
    const remaining = Math.max(total - elapsed, 0);
    minutes = Math.floor(remaining / 60);
    seconds = remaining % 60;
  }

  const style: React.CSSProperties = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    backgroundColor: bgColor,
    color: textColor,
  };

  const containerClass =
    layout === 'vertical'
      ? 'flex flex-col items-center gap-2 px-4 py-2 rounded'
      : 'flex items-center justify-between px-4 py-2 rounded';

  return (
    <div className={containerClass} style={style}>
      <div className="flex items-center gap-2">
        {gameState.homeTeam.logo && (
          <img
            src={gameState.homeTeam.logo}
            alt="Home logo"
            className="h-8 w-8 object-contain"
          />
        )}
        <span className="font-bold text-xl">
          {gameState.homeTeam.name}
          {showFouls && <span className="ml-2 text-sm">F:{gameState.homeTeam.fouls}</span>}
        </span>
      </div>
      {showScore && (
        <div className="text-3xl font-bold">
          {gameState.homeTeam.score} - {gameState.awayTeam.score}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl">
          {gameState.awayTeam.name}
          {showFouls && <span className="ml-2 text-sm">F:{gameState.awayTeam.fouls}</span>}
        </span>
        {gameState.awayTeam.logo && (
          <img
            src={gameState.awayTeam.logo}
            alt="Away logo"
            className="h-8 w-8 object-contain"
          />
        )}
      </div>
      {showTimer && (
        <div className="flex flex-col items-end text-sm ml-4">
          <span className="font-mono text-lg">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          {showHalf && <span>{period}</span>}
        </div>
      )}
      {!showTimer && showHalf && <div className="text-sm ml-4">{period}</div>}
    </div>
  );
};
