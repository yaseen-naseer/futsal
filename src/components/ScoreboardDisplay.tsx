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
    textColor = '#ffffff',
  } = options || {};

  const period = getHalfName(
    gameState.half,
    gameState.gamePreset,
    gameState.matchPhase,
  );

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

  const renderTeam = (
    team: GameState['homeTeam'],
  ) => (
    <div className="flex flex-col items-center min-w-0">
      {team.logo && (
        <img
          src={team.logo}
          alt="Team logo"
          className="w-12 h-12 object-cover rounded-full mb-2"
        />
      )}
      <span className="text-lg font-semibold truncate">
        {team.name}
      </span>
      {showFouls && (
        <span className="text-sm opacity-80">Fouls: {team.fouls}</span>
      )}
    </div>
  );

  const renderCenter = () => (
    <div className="flex flex-col items-center">
      {showScore && (
        <div className="text-4xl font-bold font-mono mb-2">
          {gameState.homeTeam.score} - {gameState.awayTeam.score}
        </div>
      )}
      {(showTimer || showHalf) && (
        <div className="text-sm flex items-center space-x-2">
          {showTimer && (
            <span className="font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          )}
          {showHalf && <span className="uppercase tracking-wide">{period}</span>}
        </div>
      )}
    </div>
  );

  const horizontalLayout = (
    <div className="grid grid-cols-3 items-center gap-4">
      {renderTeam(gameState.homeTeam)}
      {renderCenter()}
      {renderTeam(gameState.awayTeam)}
    </div>
  );

  const verticalLayout = (
    <div className="flex flex-col items-center space-y-4">
      {renderTeam(gameState.homeTeam)}
      {renderCenter()}
      {renderTeam(gameState.awayTeam)}
    </div>
  );

  return (
    <div
      className="p-4 rounded-xl shadow-xl"
      style={style}
    >
      {layout === 'vertical' ? verticalLayout : horizontalLayout}
    </div>
  );
};
