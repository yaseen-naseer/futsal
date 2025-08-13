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
    bgColor = '#1d4ed8',
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
      ? 'flex flex-col items-center gap-6 px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-sm'
      : 'flex items-center justify-between gap-8 px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-sm';

  const renderTeam = (
    team: GameState['homeTeam'],
    reverse = false,
    variant: 'home' | 'away' = 'home'
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
          className="h-[clamp(2.5rem,5vw,3.5rem)] w-[clamp(2.5rem,5vw,3.5rem)] object-cover rounded-full shadow-md"
        />
      )}
      <div
        className={`flex flex-col px-3 py-1 rounded-lg text-white ${
          variant === 'home'
            ? 'bg-gradient-to-br from-blue-500 to-indigo-700'
            : 'bg-gradient-to-br from-red-500 to-pink-700'
        }`}
      >
        <span className="font-semibold uppercase tracking-wide truncate text-[clamp(1rem,2.5vw,2.5rem)]">
          {team.name}
        </span>
        {showFouls && (
          <span className="text-[clamp(0.75rem,1.5vw,1rem)] opacity-90">Fouls: {team.fouls}</span>
        )}
      </div>
    </div>
  );

  const renderCenter = () => (
    <div className="flex flex-col items-center mx-6">
      {showScore && (
        <div className="font-mono font-bold leading-none drop-shadow-md text-[clamp(2.5rem,8vw,6rem)]">
          {gameState.homeTeam.score} - {gameState.awayTeam.score}
        </div>
      )}
      {(showTimer || showHalf) && (
        <div className="flex items-center gap-3 mt-2 text-[clamp(1rem,2.5vw,1.5rem)]">
          {showTimer && (
            <span className="font-mono tracking-widest">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          )}
          {showHalf && <span className="uppercase tracking-wide">{period}</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className={containerClass} style={style}>
      {renderTeam(gameState.homeTeam, false, 'home')}
      {renderCenter()}
      {renderTeam(gameState.awayTeam, true, 'away')}
    </div>
  );
};
