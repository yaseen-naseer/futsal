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

  const renderTeam = (
    team: GameState['homeTeam'],
    reverse = false
  ) => (
    <div
      className={`flex items-center gap-2 ${
        reverse ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {team.logo && (
        <img
          src={team.logo}
          alt="Team logo"
          className="h-10 w-10 object-contain"
        />
      )}
      <div className="flex flex-col">
        <span className="font-bold text-xl truncate">{team.name}</span>
        {showFouls && <span className="text-xs">Fouls: {team.fouls}</span>}
      </div>
    </div>
  );

  const renderCenter = () => (
    <div className="flex flex-col items-center mx-4">
      {showScore && (
        <div className="text-4xl font-extrabold leading-none">
          {gameState.homeTeam.score} - {gameState.awayTeam.score}
        </div>
      )}
      {(showTimer || showHalf) && (
        <div className="flex items-center gap-2 text-sm mt-1">
          {showTimer && (
            <span className="font-mono text-lg">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          )}
          {showHalf && <span>{period}</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className={containerClass} style={style}>
      {renderTeam(gameState.homeTeam)}
      {renderCenter()}
      {renderTeam(gameState.awayTeam, true)}
    </div>
  );
};
