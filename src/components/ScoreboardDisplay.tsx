import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';

interface ScoreboardDisplayOptions {
  showScore?: boolean;
  showFouls?: boolean;
  showHalf?: boolean;
  showTimer?: boolean;
  timerMode?: 'elapsed' | 'remaining';
  layout?: 'horizontal' | 'vertical';
  bgColor?: string;
  teamAColor?: string;
  teamBColor?: string;
  timerColor?: string;
}

interface ScoreboardDisplayProps {
  gameState: GameState;
  width?: number;
  height?: number;
  options?: ScoreboardDisplayOptions;
}

const TeamLogo: React.FC<{ src?: string; size: string }> = ({ src, size }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className="fill-current">
        <polygon points="50,10 90,90 10,90" />
      </svg>
    );
  }
  return (
    <img
      src={src}
      alt="Team logo"
      onError={() => setError(true)}
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );
};

const TournamentLogo: React.FC<{ src?: string; width: string; height: string }> = ({
  src,
  width,
  height,
}) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <svg viewBox="0 0 100 60" width={width} height={height} className="stroke-current fill-none">
        <rect x="5" y="5" width="90" height="50" rx="15" ry="15" strokeWidth="10" />
        <ellipse cx="50" cy="30" rx="25" ry="12" strokeWidth="10" />
      </svg>
    );
  }
  return (
    <img
      src={src}
      alt="Competition logo"
      onError={() => setError(true)}
      style={{ width, height }}
      className="object-contain"
    />
  );
};

export const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({
  gameState,
  width,
  height,
  options,
}) => {
  const {
    showScore = true,
    showFouls = false,
    showHalf = true,
    showTimer = true,
    timerMode = 'elapsed',
    layout = 'horizontal',
    bgColor = '#1d4ed8',
    teamAColor = '#3b82f6',
    teamBColor = '#ef4444',
    timerColor = '#ffffff',
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

  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    backgroundColor: bgColor,
    '--team-a-color': teamAColor,
    '--team-b-color': teamBColor,
    '--timer-color': timerColor,
  } as React.CSSProperties;

  // Account for padding (p-2 => 8px each side) and vertical gaps (gap-y-2 => 8px each)
  // to ensure the computed content sizes fit within the provided height.
  const innerHeight = (height ?? 200) - 32;

  const makeFont = (min: number, ratio: number, max: number) =>
    `clamp(${min}px, ${innerHeight * ratio}px, ${max}px)`;

  const logoSize = `${innerHeight * 0.4}px`;
  const compWidth = `${innerHeight * 0.4}px`;
  const compHeight = `${innerHeight * 0.2}px`;
  const timerFont = makeFont(20, 0.3, innerHeight * 0.4);
  const scoreFont = makeFont(20, 0.35, innerHeight * 0.5);
  const teamFontBase = innerHeight * 0.25;
  const teamFont = makeFont(16, 0.25, innerHeight * 0.3);
  const pausedFont = makeFont(12, 0.15, innerHeight * 0.2);
  const halfFont = makeFont(12, 0.15, innerHeight * 0.2);
  const foulsFont = makeFont(10, 0.15, innerHeight * 0.2);

  const homeNameRef = useRef<HTMLSpanElement>(null);
  const awayNameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fit = (ref: React.RefObject<HTMLSpanElement>) => {
      const el = ref.current;
      if (!el) return;
      const containerWidth = el.parentElement?.clientWidth || 0;
      let size = teamFontBase;
      el.style.fontSize = `${size}px`;
      while (el.scrollWidth > containerWidth && size > 8) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };
    fit(homeNameRef);
    fit(awayNameRef);
  }, [gameState.homeTeam.name, gameState.awayTeam.name, width, height, teamFontBase]);

  const halfText = `Half ${gameState.half}`;

  const horizontalLayout = (
    <div className="grid grid-rows-[auto_1fr_auto] w-full h-full p-2 gap-y-2" style={style}>
      <div className="grid grid-cols-3 items-center">
        <div className="justify-self-start" style={{ color: 'var(--team-a-color)' }}>
          <TeamLogo src={gameState.homeTeam.logo} size={logoSize} />
        </div>
        <div className="justify-self-center font-mono font-bold flex flex-col items-center">
          {showHalf && <span style={{ fontSize: halfFont, color: 'var(--timer-color)' }}>{halfText}</span>}
          {showTimer && (
            <span style={{ fontSize: timerFont, color: 'var(--timer-color)' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          )}
          {!gameState.isRunning && (
            <span className="uppercase" style={{ fontSize: pausedFont, color: 'var(--timer-color)' }}>
              Paused
            </span>
          )}
        </div>
        <div className="justify-self-end" style={{ color: 'var(--team-b-color)' }}>
          <TeamLogo src={gameState.awayTeam.logo} size={logoSize} />
        </div>
      </div>

      <div className="grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <div className="flex flex-col items-start">
            {showScore && (
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont, color: 'var(--team-a-color)' }}>
                {String(gameState.homeTeam.score).padStart(2, '0')}
              </span>
            )}
            {showFouls && (
              <span className="font-mono leading-none" style={{ fontSize: foulsFont, color: 'var(--team-a-color)' }}>
                F:{gameState.homeTeam.fouls}
              </span>
            )}
          </div>
        </div>
        <div className="justify-self-center" style={{ color: 'var(--timer-color)' }}>
          <TournamentLogo src={gameState.tournamentLogo} width={compWidth} height={compHeight} />
        </div>
        <div className="justify-self-end">
          <div className="flex flex-col items-end">
            {showScore && (
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont, color: 'var(--team-b-color)' }}>
                {String(gameState.awayTeam.score).padStart(2, '0')}
              </span>
            )}
            {showFouls && (
              <span className="font-mono leading-none" style={{ fontSize: foulsFont, color: 'var(--team-b-color)' }}>
                F:{gameState.awayTeam.fouls}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center">
        <span
          ref={homeNameRef}
          className="justify-self-start truncate font-semibold leading-none"
          style={{ fontSize: teamFont, color: 'var(--team-a-color)' }}
        >
          {gameState.homeTeam.name}
        </span>
        <span
          ref={awayNameRef}
          className="justify-self-end truncate font-semibold text-right leading-none"
          style={{ fontSize: teamFont, color: 'var(--team-b-color)' }}
        >
          {gameState.awayTeam.name}
        </span>
      </div>
    </div>
  );

  const verticalLayout = (
    <div className="flex flex-col w-full h-full p-2 gap-y-2" style={style}>
      <div className="flex flex-col items-center font-mono font-bold">
        {showHalf && <span style={{ fontSize: halfFont, color: 'var(--timer-color)' }}>{halfText}</span>}
        {showTimer && (
          <span style={{ fontSize: timerFont, color: 'var(--timer-color)' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        )}
        {!gameState.isRunning && (
          <span className="uppercase" style={{ fontSize: pausedFont, color: 'var(--timer-color)' }}>
            Paused
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div className="flex items-center justify-between">
          <div style={{ color: 'var(--team-a-color)' }}>
            <TeamLogo src={gameState.homeTeam.logo} size={logoSize} />
          </div>
          <div className="flex flex-col items-center">
            {showScore && (
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont, color: 'var(--team-a-color)' }}>
                {String(gameState.homeTeam.score).padStart(2, '0')}
              </span>
            )}
            {showFouls && (
              <span className="font-mono leading-none" style={{ fontSize: foulsFont, color: 'var(--team-a-color)' }}>
                F:{gameState.homeTeam.fouls}
              </span>
            )}
          </div>
          <span
            ref={homeNameRef}
            className="font-semibold leading-none truncate text-right flex-1 ml-2"
            style={{ fontSize: teamFont, color: 'var(--team-a-color)' }}
          >
            {gameState.homeTeam.name}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div style={{ color: 'var(--team-b-color)' }}>
            <TeamLogo src={gameState.awayTeam.logo} size={logoSize} />
          </div>
          <div className="flex flex-col items-center">
            {showScore && (
              <span className="font-mono font-bold leading-none" style={{ fontSize: scoreFont, color: 'var(--team-b-color)' }}>
                {String(gameState.awayTeam.score).padStart(2, '0')}
              </span>
            )}
            {showFouls && (
              <span className="font-mono leading-none" style={{ fontSize: foulsFont, color: 'var(--team-b-color)' }}>
                F:{gameState.awayTeam.fouls}
              </span>
            )}
          </div>
          <span
            ref={awayNameRef}
            className="font-semibold leading-none truncate text-right flex-1 ml-2"
            style={{ fontSize: teamFont, color: 'var(--team-b-color)' }}
          >
            {gameState.awayTeam.name}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center" style={{ color: 'var(--timer-color)' }}>
        <TournamentLogo src={gameState.tournamentLogo} width={compWidth} height={compHeight} />
      </div>
    </div>
  );

  return layout === 'vertical' ? verticalLayout : horizontalLayout;
};

