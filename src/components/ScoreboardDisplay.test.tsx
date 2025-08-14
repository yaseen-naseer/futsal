import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { ScoreboardDisplay } from './ScoreboardDisplay';

const baseTeam = {
  name: 'Team',
  score: 0,
  fouls: 0,
  stats: {
    shotsOffTarget: 0,
    shotsOnTarget: 0,
    corners: 0,
    yellowCards: 0,
    redCards: 0,
    possession: 50,
  },
  players: [],
};

const baseGameState = {
  homeTeam: { ...baseTeam, name: 'Home' },
  awayTeam: { ...baseTeam, name: 'Away' },
  time: { minutes: 12, seconds: 34 },
  half: 1,
  isRunning: false,
  ballPossession: 'home' as const,
  possessionStartTime: 0,
  totalPossessionTime: { home: 0, away: 0 },
  gamePreset: {
    type: 'futsal' as const,
    format: 'regular' as const,
    name: 'Preset',
    description: '',
    halfDuration: 20,
    totalHalves: 2,
    hasExtraTime: false,
    extraTimeDuration: 5,
    hasPenalties: false,
    allowsDraws: true,
  },
  matchPhase: 'regular' as const,
};

describe('ScoreboardDisplay', () => {
  it('shows paused indicator when game is not running', () => {
    const { getByText } = render(<ScoreboardDisplay gameState={baseGameState} />);
    expect(getByText(/paused/i)).toBeInTheDocument();
  });

  it('does not show paused indicator when game is running', () => {
    const runningState = { ...baseGameState, isRunning: true };
    const { queryByText } = render(<ScoreboardDisplay gameState={runningState} />);
    expect(queryByText(/paused/i)).toBeNull();
  });
});

