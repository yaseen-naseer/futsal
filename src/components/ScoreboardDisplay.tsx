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

const TeamLogo: React.FC<{ src?: string; size: string }> = ({ src, size }) =>
  src ? (
    <img src={src} alt="Team logo" style={{ width: size, height: size }} className="object-contain" />
  ) : (
    <svg viewBox="0 0 100 100" width={size} height={size} className="fill-current">
      <polygon points="50,10 90,90 10,90" />
    </svg>
  );

const TournamentLogo: React.FC<{ src?: string; width: string; height: string }> = ({ src, width, height }) =>
  src ? (
    <img src={src} alt="Competition logo" style={{ width, height }} className="object-contain" />
  ) : (
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

  const baseHeight = height ?? 200;
  const logoSize = `${baseHeight * 0.4}px`;
  const compWidth = `${baseHeight * 0.4}px`;
  const compHeight = `${baseHeight * 0.2}px`;
  const timerFont = `${baseHeight * 0.3}px`;
  const scoreFont = `${baseHeight * 0.35}px`;
  const teamFont = `${baseHeight * 0.25}px`;

  return (
    <div className="grid grid-rows-3 w-full h-full p-2 gap-y-2" style={style}>
      <div className="grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <TeamLogo src={gameState.homeTeam.logo} size={logoSize} />
        </div>
        <div className="justify-self-center font-mono font-bold" style={{ fontSize: timerFont }}>
          {showTimer ? (
            <>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>
          ) : null}
        </div>
        <div className="justify-self-end">
          <TeamLogo src={gameState.awayTeam.logo} size={logoSize} />
        </div>
      </div>

      <div className="grid grid-cols-3 items-center">
        <div className="justify-self-start">
          {showScore && (
            <div className="flex flex-col items-start">
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont }}>
                {String(gameState.homeTeam.score).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
        <div className="justify-self-center">
          <TournamentLogo src={gameState.tournamentLogo} width={compWidth} height={compHeight} />
        </div>
        <div className="justify-self-end">
          {showScore && (
            <div className="flex flex-col items-end">
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont }}>
                {String(gameState.awayTeam.score).padStart(2, '0')}
              </span>
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

