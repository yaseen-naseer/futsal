import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGameState } from './useGameState';

describe('useGameState message handling', () => {
  it('ignores invalid messages without throwing', () => {
    const { result, unmount } = renderHook(() => useGameState());

    const invalidMessages = [
      'string',
      { foo: 'bar' },
      { type: 'UNKNOWN', action: 'START' },
      { type: 'TIMER_CONTROL', action: 'UNKNOWN' },
    ];

    invalidMessages.forEach(data => {
      expect(() => {
        window.dispatchEvent(
          new MessageEvent('message', { data, origin: window.location.origin })
        );
      }).not.toThrow();
      expect(result.current.gameState.isRunning).toBe(false);
    });

    unmount();
  });
});

describe('useGameState history', () => {
  it('supports undo and redo of state changes', () => {
    const { result } = renderHook(() => useGameState());

    result.current.updateTeam('home', 'score', 1);
    expect(result.current.gameState.homeTeam.score).toBe(1);

    result.current.undo();
    expect(result.current.gameState.homeTeam.score).toBe(0);

    result.current.redo();
    expect(result.current.gameState.homeTeam.score).toBe(1);
  });

  it('maintains a maximum of 100 history entries', () => {
    const { result } = renderHook(() => useGameState());

    for (let i = 1; i <= 110; i++) {
      result.current.updateTeam('home', 'score', i);
    }

    for (let i = 0; i < 100; i++) {
      result.current.undo();
    }

    expect(result.current.gameState.homeTeam.score).toBe(10);

    result.current.undo();
    expect(result.current.gameState.homeTeam.score).toBe(10);
  });
});

describe('useGameState initialization', () => {
  it('merges stored state with defaults', () => {
    const partial = {
      homeTeam: { name: 'Saved Home' },
      awayTeam: { name: 'Saved Away' },
      time: { minutes: 15 },
    };
    window.localStorage.setItem('gameState', JSON.stringify(partial));

    const { result } = renderHook(() => useGameState());

    expect(result.current.gameState.homeTeam.name).toBe('Saved Home');
    expect(result.current.gameState.awayTeam.name).toBe('Saved Away');
    expect(result.current.gameState.homeTeam.players).toEqual([]);
    expect(result.current.gameState.awayTeam.players).toEqual([]);
    expect(result.current.gameState.time.minutes).toBe(15);
    expect(result.current.gameState.time.seconds).toBe(0);

    window.localStorage.removeItem('gameState');
  });
});

describe('useGameState player management', () => {
  it('removes player and adjusts team totals', () => {
    const { result } = renderHook(() => useGameState());

    result.current.addPlayer('home', 'Test Player');
    const playerId = result.current.gameState.homeTeam.players[0].id;

    result.current.updatePlayerStats('home', playerId, 'goals', 2);
    result.current.updatePlayerStats('home', playerId, 'yellowCards', 1);
    result.current.updatePlayerStats('home', playerId, 'redCards', 1);

    result.current.toggleTimer();
    result.current.updateTeamStats('home', 'yellowCards', 1);
    result.current.updateTeamStats('home', 'redCards', 1);
    result.current.toggleTimer();

    result.current.removePlayer('home', playerId);

    expect(result.current.gameState.homeTeam.score).toBe(0);
    expect(result.current.gameState.homeTeam.stats.yellowCards).toBe(0);
    expect(result.current.gameState.homeTeam.stats.redCards).toBe(0);
    expect(result.current.gameState.homeTeam.players).toHaveLength(0);
  });
});

