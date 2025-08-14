import React from 'react';
import { GameState } from '../types';

interface ScoreboardDisplayOptions {
  showScore?: boolean;
  showTimer?: boolean;
  timerMode?: 'elapsed' | 'remaining';
  bgColor?: string;
  textColor?: string;
}

interface ScoreboardDisplayProps {
  gameState: GameState;
  width?: number;
  height?: number;
  options?: ScoreboardDisplayOptions;
}

const TeamLogoA: React.FC<{ size: string }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className="fill-current">
    <polygon points="50,10 90,90 10,90" />
  </svg>
);

const TeamLogoB: React.FC<{ size: string }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className="fill-current">
    <polygon points="50,10 90,90 10,90" />
    <circle cx="50" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="10" />
  </svg>
);

const CompetitionLogo: React.FC<{ width: string; height: string }> = ({ width, height }) => (
  <svg viewBox="0 0 100 60" width={width} height={height} className="stroke-current fill-none">
    <rect x="5" y="5" width="90" height="50" rx="15" ry="15" strokeWidth="10" />
    <ellipse cx="50" cy="30" rx="25" ry="12" strokeWidth="10" />
  </svg>
);

export const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({
  gameState,
  width,
  height,
  options,
}) => {
  const {
    showScore = true,
    showTimer = true,
    timerMode = 'elapsed',
    bgColor = '#1d4ed8',
    textColor = '#ffffff',
  } = options || {};

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

  const logoSize = 'clamp(2rem, 8vw, 6rem)';
  const compWidth = 'clamp(4rem, 12vw, 8rem)';
  const compHeight = 'clamp(2rem, 6vw, 4rem)';
  const timerFont = 'clamp(1.5rem, 6vw, 4rem)';
  const scoreFont = 'clamp(2rem, 8vw, 5rem)';
  const labelFont = 'clamp(0.5rem, 2vw, 1.25rem)';
  const teamFont = 'clamp(1rem, 4vw, 2.5rem)';

  return (
    <div className="grid grid-rows-3 w-full h-full p-2 gap-y-2" style={style}>
      <div className="grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <TeamLogoA size={logoSize} />
        </div>
        <div className="justify-self-center font-mono font-bold" style={{ fontSize: timerFont }}>
          {showTimer ? (
            <>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>
          ) : null}
        </div>
        <div className="justify-self-end">
          <TeamLogoB size={logoSize} />
        </div>
      </div>

      <div className="grid grid-cols-3 items-center">
        <div className="justify-self-start">
          {showScore && (
            <div className="flex flex-col items-start">
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont }}>
                {String(gameState.homeTeam.score).padStart(2, '0')}
              </span>
              <span style={{ fontSize: labelFont }}>Score</span>
            </div>
          )}
        </div>
        <div className="justify-self-center">
          <CompetitionLogo width={compWidth} height={compHeight} />
        </div>
        <div className="justify-self-end">
          {showScore && (
            <div className="flex flex-col items-end">
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont }}>
                {String(gameState.awayTeam.score).padStart(2, '0')}
              </span>
              <span style={{ fontSize: labelFont }}>Score</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 items-center">
        <span className="justify-self-start truncate font-semibold" style={{ fontSize: teamFont }}>
          {gameState.homeTeam.name}
        </span>
        <span className="justify-self-end truncate font-semibold text-right" style={{ fontSize: teamFont }}>
          {gameState.awayTeam.name}
        </span>
      </div>
    </div>
  );
};

