import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';

export interface ScoreboardDisplayOptions {
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
  options?: ScoreboardDisplayOptions;
}

const defaultOptions: Required<ScoreboardDisplayOptions> = {
  showScore: true,
  showFouls: true,
  showHalf: true,
  showTimer: true,
  timerMode: 'elapsed',
  layout: 'horizontal',
  bgColor: '#1F2937',
  teamAColor: '#3B82F6',
  teamBColor: '#EF4444',
  timerColor: '#10B981',
};

const pad = (num: number) => num.toString().padStart(2, '0');

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({
  gameState,
  options = {},
}) => {
  const [displayOptions, setDisplayOptions] = useState<
    Required<ScoreboardDisplayOptions>
  >({ ...defaultOptions, ...options });

  const containerRef = useRef<HTMLDivElement>(null);
  const [nameFontSize, setNameFontSize] = useState(48);

  // Merge URL params with provided options
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed: ScoreboardDisplayOptions = {};
    if (params.get('showScore') === 'false') parsed.showScore = false;
    if (params.get('showFouls') === 'false') parsed.showFouls = false;
    if (params.get('showHalf') === 'false') parsed.showHalf = false;
    if (params.get('showTimer') === 'false') parsed.showTimer = false;
    const timerMode = params.get('timerMode');
    if (timerMode === 'elapsed' || timerMode === 'remaining')
      parsed.timerMode = timerMode;
    const layout = params.get('layout');
    if (layout === 'horizontal' || layout === 'vertical') parsed.layout = layout;
    const bgColor = params.get('bgColor');
    if (bgColor) parsed.bgColor = bgColor;
    const teamAColor = params.get('teamAColor');
    if (teamAColor) parsed.teamAColor = teamAColor;
    const teamBColor = params.get('teamBColor');
    if (teamBColor) parsed.teamBColor = teamBColor;
    const timerColor = params.get('timerColor');
    if (timerColor) parsed.timerColor = timerColor;
    setDisplayOptions({ ...defaultOptions, ...options, ...parsed });
  }, [options]);

  // Dynamic font sizing for team names
  useEffect(() => {
    const names = [gameState.homeTeam.name, gameState.awayTeam.name];
    const longest = names.reduce((a, b) => (a.length > b.length ? a : b), '');
    const containerWidth = containerRef.current?.clientWidth || 0;
    if (!containerWidth) return;
    const perNameWidth = containerWidth / 2 - 32; // approximate padding
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let size = 48;
    ctx.font = `${size}px sans-serif`;
    let width = ctx.measureText(longest).width;
    while (width > perNameWidth && size > 16) {
      size -= 2;
      ctx.font = `${size}px sans-serif`;
      width = ctx.measureText(longest).width;
    }
    setNameFontSize(size);
  }, [gameState.homeTeam.name, gameState.awayTeam.name]);

  const totalElapsed = gameState.time.minutes * 60 + gameState.time.seconds;
  const totalDuration = gameState.gamePreset?.halfDuration
    ? gameState.gamePreset.halfDuration * 60
    : 0;
  const displaySeconds =
    displayOptions.timerMode === 'remaining'
      ? Math.max(totalDuration - totalElapsed, 0)
      : totalElapsed;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;

  const renderLogo = (logo?: string, name?: string) =>
    logo ? (
      <img
        src={logo}
        alt={name || ''}
        className="h-16 w-16 object-contain rounded-lg shadow"
      />
    ) : (
      <div className="h-16 w-16 rounded-lg bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-100">
        {name ? getInitials(name) : ''}
      </div>
    );

  if (displayOptions.layout === 'vertical') {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col gap-4 p-4 text-gray-100"
        style={{ backgroundColor: displayOptions.bgColor }}
      >
        {displayOptions.showTimer && (
          <div className="flex flex-col items-center">
            <div
              className="font-bold"
              style={{
                color: displayOptions.timerColor,
                fontSize: 64,
              }}
            >
              {pad(minutes)}:{pad(seconds)}
            </div>
            <div
              className={`text-sm font-semibold ${
                gameState.isRunning ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {gameState.isRunning ? 'LIVE' : 'PAUSED'}
            </div>
            {displayOptions.showHalf && (
              <div className="text-xs text-gray-300">H{gameState.half}</div>
            )}
          </div>
        )}
        <div className="flex justify-between items-center">
          {renderLogo(gameState.homeTeam.logo, gameState.homeTeam.name)}
          {renderLogo(gameState.awayTeam.logo, gameState.awayTeam.name)}
        </div>
        <div className="flex justify-between text-center">
          <div>
            {displayOptions.showScore && (
              <div
                className="font-bold"
                style={{ color: displayOptions.teamAColor, fontSize: 72 }}
              >
                {pad(gameState.homeTeam.score)}
              </div>
            )}
            {displayOptions.showFouls && (
              <div className="text-sm">F: {gameState.homeTeam.fouls}</div>
            )}
            <div
              className="font-semibold"
              style={{ fontSize: nameFontSize, color: displayOptions.teamAColor }}
            >
              {gameState.homeTeam.name}
            </div>
          </div>
          <div>
            {displayOptions.showScore && (
              <div
                className="font-bold"
                style={{ color: displayOptions.teamBColor, fontSize: 72 }}
              >
                {pad(gameState.awayTeam.score)}
              </div>
            )}
            {displayOptions.showFouls && (
              <div className="text-sm">F: {gameState.awayTeam.fouls}</div>
            )}
            <div
              className="font-semibold"
              style={{ fontSize: nameFontSize, color: displayOptions.teamBColor }}
            >
              {gameState.awayTeam.name}
            </div>
          </div>
        </div>
        {(gameState.tournamentLogo || gameState.tournamentName) && (
          <div className="flex flex-col items-center">
            {gameState.tournamentLogo && (
              <img
                src={gameState.tournamentLogo}
                alt="Tournament Logo"
                className="h-12 object-contain mb-1"
              />
            )}
            {gameState.tournamentName && (
              <span className="text-sm font-medium text-gray-300">
                {gameState.tournamentName}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div
      ref={containerRef}
      className="w-full h-full grid grid-rows-3 text-gray-100 p-4 rounded-xl shadow-xl"
      style={{ backgroundColor: displayOptions.bgColor }}
    >
      {/* Row 1: Logos and Timer */}
      <div className="grid grid-cols-3 items-center">
        <div className="flex justify-start">{renderLogo(gameState.homeTeam.logo, gameState.homeTeam.name)}</div>
        {displayOptions.showTimer ? (
          <div className="text-center">
            <div
              className="font-bold"
              style={{ color: displayOptions.timerColor, fontSize: 64 }}
            >
              {pad(minutes)}:{pad(seconds)}
            </div>
            <div
              className={`text-sm font-semibold ${
                gameState.isRunning ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {gameState.isRunning ? 'LIVE' : 'PAUSED'}
            </div>
            {displayOptions.showHalf && (
              <div className="text-xs text-gray-300">H{gameState.half}</div>
            )}
          </div>
        ) : (
          <div />
        )}
        <div className="flex justify-end">{renderLogo(gameState.awayTeam.logo, gameState.awayTeam.name)}</div>
      </div>

      {/* Row 2: Scores and Tournament */}
      <div className="grid grid-cols-3 items-center">
        <div className="text-center">
          {displayOptions.showScore && (
            <div
              className="font-bold"
              style={{ color: displayOptions.teamAColor, fontSize: 72 }}
            >
              {pad(gameState.homeTeam.score)}
            </div>
          )}
          {displayOptions.showFouls && (
            <div className="text-sm">F: {gameState.homeTeam.fouls}</div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          {gameState.tournamentLogo && (
            <img
              src={gameState.tournamentLogo}
              alt="Tournament Logo"
              className="h-12 object-contain mb-1"
            />
          )}
          {gameState.tournamentName && (
            <span className="text-sm font-medium text-gray-300">
              {gameState.tournamentName}
            </span>
          )}
        </div>
        <div className="text-center">
          {displayOptions.showScore && (
            <div
              className="font-bold"
              style={{ color: displayOptions.teamBColor, fontSize: 72 }}
            >
              {pad(gameState.awayTeam.score)}
            </div>
          )}
          {displayOptions.showFouls && (
            <div className="text-sm">F: {gameState.awayTeam.fouls}</div>
          )}
        </div>
      </div>

      {/* Row 3: Team Names */}
      <div className="grid grid-cols-3 items-end">
        <div
          className="text-center font-semibold"
          style={{ fontSize: nameFontSize, color: displayOptions.teamAColor }}
        >
          {gameState.homeTeam.name}
        </div>
        <div></div>
        <div
          className="text-center font-semibold"
          style={{ fontSize: nameFontSize, color: displayOptions.teamBColor }}
        >
          {gameState.awayTeam.name}
        </div>
      </div>
    </div>
  );
};

export default ScoreboardDisplay;

