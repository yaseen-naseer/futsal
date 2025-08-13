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

  // derive a few sizing values from the provided height.  This keeps
  // the scoreboard looking consistent for any resolution because the
  // font and logo sizes scale with the physical size of the board
  // rather than with the browser viewport.
  const baseHeight = height || 200;
  const logoSize = baseHeight * 0.4; // 40% of the board height
  const teamFontSize = baseHeight * 0.2;
  const foulsFontSize = baseHeight * 0.12;
  const scoreFontSize = baseHeight * 0.5;
  const infoFontSize = baseHeight * 0.2;

  const containerClass =
    layout === 'vertical'
      ? 'flex flex-col items-center gap-6 px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-sm'
      : 'grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-sm';

  const renderTeam = (
    team: GameState['homeTeam'],
    reverse = false,
    variant: 'home' | 'away' = 'home'
  ) => (
    <div
      className={`flex items-center gap-2 ${reverse ? 'flex-row-reverse text-right' : ''}`}
      style={{ gap: baseHeight * 0.05 }}
    >
      {team.logo && (
        <img
          src={team.logo}
          alt="Team logo"
          style={{ width: logoSize, height: logoSize }}
          className="object-cover rounded-full shadow-md flex-shrink-0"
        />
      )}
      <div
        className={`flex flex-col px-3 py-1 rounded-lg text-white ${
          variant === 'home'
            ? 'bg-gradient-to-br from-blue-500 to-indigo-700'
            : 'bg-gradient-to-br from-red-500 to-pink-700'
        }`}
        style={{ fontSize: teamFontSize }}
      >
        <span className="font-semibold uppercase tracking-wide truncate">
          {team.name}
        </span>
        {showFouls && (
          <span style={{ fontSize: foulsFontSize }} className="opacity-90">
            Fouls: {team.fouls}
          </span>
        )}
      </div>
    </div>
  );

  const renderCenter = () => (
    <div
      className="flex flex-col items-center flex-shrink-0"
      style={{ gap: baseHeight * 0.1 }}
    >
      {showScore && (
        <div
          className="font-mono font-bold leading-none drop-shadow-md"
          style={{ fontSize: scoreFontSize }}
        >
          {gameState.homeTeam.score} - {gameState.awayTeam.score}
        </div>
      )}
      {(showTimer || showHalf) && (
        <div className="flex items-center gap-3" style={{ fontSize: infoFontSize }}>
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
      <div className="min-w-0 justify-self-start">{renderTeam(gameState.homeTeam, false, 'home')}</div>
      <div className="justify-self-center">{renderCenter()}</div>
      <div className="min-w-0 justify-self-end">{renderTeam(gameState.awayTeam, true, 'away')}</div>
    </div>
  );
};
