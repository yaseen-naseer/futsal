import { renderHook, act } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { useGameState } from './useGameState';

describe('useGameState possession tracking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('maintains accurate possession across pauses and restarts', () => {
    const { result } = renderHook(() => useGameState());

    // Start timer with home possession
    act(() => {
      result.current.toggleTimer();
    });

    // Home team possesses for 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Switch to away possession
    act(() => {
      result.current.switchBallPossession('away');
    });

    // Away team possesses for 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Pause timer
    act(() => {
      result.current.toggleTimer();
    });

    expect(result.current.gameState.homeTeam.stats.possession).toBe(75);
    expect(result.current.gameState.awayTeam.stats.possession).toBe(25);

    // Restart timer with away possession
    act(() => {
      result.current.toggleTimer();
    });

    // Away team possesses for another second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Switch back to home possession
    act(() => {
      result.current.switchBallPossession('home');
    });

    // Home team possesses for one more second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Stop timer
    act(() => {
      result.current.toggleTimer();
    });

    expect(result.current.gameState.homeTeam.stats.possession).toBe(67);
    expect(result.current.gameState.awayTeam.stats.possession).toBe(33);
  });
});
