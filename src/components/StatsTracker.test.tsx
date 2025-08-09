import { render, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { StatsTracker } from './StatsTracker';

vi.mock('../hooks/useSettings', () => ({
  useSettings: () => ({
    settings: { showUndo: false, showRedo: false, homeShortcut: 'KeyA', awayShortcut: 'KeyD' },
  }),
}));

describe('StatsTracker', () => {
  it('does not allow stat changes when match is not running', () => {
    const updateTeamStats = vi.fn();
    const updateTeamScore = vi.fn();
    const updateTeamFouls = vi.fn();
    const updatePlayerStats = vi.fn();
    const switchBallPossession = vi.fn();
    const undo = vi.fn();
    const redo = vi.fn();

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

    const gameState = {
      homeTeam: { ...baseTeam, name: 'Home' },
      awayTeam: { ...baseTeam, name: 'Away' },
      time: { minutes: 0, seconds: 0 },
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

    const { getAllByText } = render(
      <StatsTracker
        gameState={gameState}
        updateTeamStats={updateTeamStats}
        updateTeamScore={updateTeamScore}
        updateTeamFouls={updateTeamFouls}
        updatePlayerStats={updatePlayerStats}
        switchBallPossession={switchBallPossession}
        undo={undo}
        redo={redo}
      />,
    );

    const section = getAllByText('Shots Off Target')[0].closest('div')?.parentElement?.parentElement;
    const plusButton = section ? within(section).getAllByRole('button')[1] : null;
    if (!plusButton) throw new Error('Plus button not found');

    fireEvent.click(plusButton);
    expect(updateTeamStats).not.toHaveBeenCalled();
  });
});
