import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameState } from './useGameState';
import { GAME_PRESETS } from '../utils/gamePresets';

vi.mock('./useSettings', () => ({
  useSettings: () => ({
    settings: { showUndo: true, showRedo: true, homeShortcut: 'KeyA', awayShortcut: 'KeyD' },
    toggleUndo: () => {},
    toggleRedo: () => {},
    setHomeShortcut: () => {},
    setAwayShortcut: () => {},
  }),
}));

beforeEach(() => {
  window.localStorage.removeItem('gameState');
});

describe('useGameState message handling', () => {
  it('ignores invalid messages without throwing', () => {
    const { result, unmount } = renderHook(() => useGameState(), { legacyRoot: true });

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
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeam('home', 'score', 1);
    });
    expect(result.current.gameState.homeTeam.score).toBe(1);

    act(() => {
      result.current.undo();
    });
    expect(result.current.gameState.homeTeam.score).toBe(0);

    act(() => {
      result.current.redo();
    });
    expect(result.current.gameState.homeTeam.score).toBe(1);
  });

  it('maintains a maximum of 100 history entries', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      for (let i = 1; i <= 110; i++) {
        result.current.updateTeam('home', 'score', i);
      }
    });

    act(() => {
      for (let i = 0; i < 50; i++) {
        result.current.undo();
      }
    });

    act(() => {
      for (let i = 0; i < 60; i++) {
        result.current.redo();
      }
    });

    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.undo();
      }
    });

    expect(result.current.gameState.homeTeam.score).toBe(10);

    act(() => {
      result.current.undo();
    });
    expect(result.current.gameState.homeTeam.score).toBe(10);
  });

  it('clears history after a game reset', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeam('home', 'score', 1);
    });
    expect(result.current.gameState.homeTeam.score).toBe(1);

    act(() => {
      result.current.resetGame({ force: true });
    });
    expect(result.current.gameState.homeTeam.score).toBe(0);

    act(() => {
      result.current.undo();
    });
    expect(result.current.gameState.homeTeam.score).toBe(0);

    act(() => {
      result.current.redo();
    });
    expect(result.current.gameState.homeTeam.score).toBe(0);
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

    const { result } = renderHook(() => useGameState(), { legacyRoot: true });

    expect(result.current.gameState.homeTeam.name).toBe('Saved Home');
    expect(result.current.gameState.awayTeam.name).toBe('Saved Away');
    expect(result.current.gameState.homeTeam.players).toEqual([]);
    expect(result.current.gameState.awayTeam.players).toEqual([]);
    expect(result.current.gameState.time.minutes).toBe(15);
    expect(result.current.gameState.time.seconds).toBe(0);

    window.localStorage.removeItem('gameState');
  });
});

describe('tournament settings', () => {
  it('updates tournament name and logo', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTournamentName('Championship');
      result.current.updateTournamentLogo('logo-url');
    });

    expect(result.current.gameState.tournamentName).toBe('Championship');
    expect(result.current.gameState.tournamentLogo).toBe('logo-url');
  });
});

describe('useGameState player management', () => {
  it('removes player and adjusts team totals', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.addPlayer('home', 'Test Player', 'starter');
    });
    const playerId = result.current.gameState.homeTeam.players[0].id;

    act(() => {
      result.current.updatePlayerStats('home', playerId, 'goals', 2);
      result.current.updatePlayerStats('home', playerId, 'yellowCards', 1);
      result.current.updatePlayerStats('home', playerId, 'redCards', 1);

      result.current.toggleTimer();
      result.current.updateTeamStats('home', 'yellowCards', 1);
      result.current.updateTeamStats('home', 'redCards', 1);
      result.current.toggleTimer();

      result.current.removePlayer('home', playerId);
    });

    expect(result.current.gameState.homeTeam.score).toBe(0);
    expect(result.current.gameState.homeTeam.stats.yellowCards).toBe(0);
    expect(result.current.gameState.homeTeam.stats.redCards).toBe(0);
    expect(result.current.gameState.homeTeam.players).toHaveLength(0);
  });
});

describe('team sheet limits', () => {
  it('enforces futsal player limits', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.addPlayer('home', `Starter${i}`, 'starter');
      }
      for (let i = 0; i < 10; i++) {
        result.current.addPlayer('home', `Sub${i}`, 'substitute');
      }
    });
    const starters = result.current.gameState.homeTeam.players.filter(p => p.role === 'starter');
    const subs = result.current.gameState.homeTeam.players.filter(p => p.role === 'substitute');
    expect(starters).toHaveLength(5);
    expect(subs).toHaveLength(9);
  });

  it('enforces football player limits', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.changeGamePreset(0);
      for (let i = 0; i < 12; i++) {
        result.current.addPlayer('home', `Starter${i}`, 'starter');
      }
      for (let i = 0; i < 13; i++) {
        result.current.addPlayer('home', `Sub${i}`, 'substitute');
      }
    });
    const starters = result.current.gameState.homeTeam.players.filter(p => p.role === 'starter');
    const subs = result.current.gameState.homeTeam.players.filter(p => p.role === 'substitute');
    expect(starters).toHaveLength(11);
    expect(subs).toHaveLength(12);
    expect(result.current.gameState.homeTeam.players).toHaveLength(23);
  });
});

describe('foul tracking', () => {
  it('increments fouls when team stats receive cards', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.toggleTimer();
    });
    act(() => {
      result.current.updateTeamStats('home', 'yellowCards', 1);
    });
    act(() => {
      result.current.updateTeamStats('home', 'redCards', 1);
    });
    expect(result.current.gameState.homeTeam.fouls).toBe(2);
  });

  it('increments fouls when player receives cards', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.addPlayer('home', 'Player', 'starter');
    });
    const playerId = result.current.gameState.homeTeam.players[0].id;
    act(() => {
      result.current.updatePlayerStats('home', playerId, 'yellowCards', 1);
    });
    act(() => {
      result.current.updatePlayerStats('home', playerId, 'redCards', 1);
    });
    expect(result.current.gameState.homeTeam.fouls).toBe(2);
  });

  it('reduces fouls when carded player is removed', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.addPlayer('home', 'Player', 'starter');
    });
    const playerId = result.current.gameState.homeTeam.players[0].id;
    act(() => {
      result.current.updatePlayerStats('home', playerId, 'yellowCards', 1);
    });
    expect(result.current.gameState.homeTeam.fouls).toBe(1);
    act(() => {
      result.current.removePlayer('home', playerId);
    });
    expect(result.current.gameState.homeTeam.fouls).toBe(0);
  });
});

describe('paused stat adjustment limits', () => {
  it('clamps goal changes to one when paused', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeam('home', 'score', 5);
    });
    expect(result.current.gameState.homeTeam.score).toBe(1);

    act(() => {
      result.current.updateTeam('home', 'score', 2);
      result.current.updateTeam('home', 'score', 3);
      result.current.updateTeam('home', 'score', 4);
      result.current.updateTeam('home', 'score', 5);
    });
    expect(result.current.gameState.homeTeam.score).toBe(5);
    act(() => {
      result.current.updateTeam('home', 'score', 0);
    });
    expect(result.current.gameState.homeTeam.score).toBe(4);
  });

  it('clamps corner changes to one when paused', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeamStats('home', 'corners', 5);
    });
    expect(result.current.gameState.homeTeam.stats.corners).toBe(1);

    act(() => {
      result.current.updateTeamStats('home', 'corners', 2);
      result.current.updateTeamStats('home', 'corners', 3);
      result.current.updateTeamStats('home', 'corners', 4);
      result.current.updateTeamStats('home', 'corners', 5);
    });
    expect(result.current.gameState.homeTeam.stats.corners).toBe(5);
    act(() => {
      result.current.updateTeamStats('home', 'corners', 0);
    });
    expect(result.current.gameState.homeTeam.stats.corners).toBe(4);
  });

  it('allows cards and fouls to change freely when paused', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeamStats('home', 'yellowCards', 5);
      result.current.updateTeam('home', 'fouls', 5);
    });
    expect(result.current.gameState.homeTeam.stats.yellowCards).toBe(5);
    expect(result.current.gameState.homeTeam.fouls).toBe(5);
  });

  it('clamps player goal changes to one when paused', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.addPlayer('home', 'Player', 'starter');
    });
    const playerId = result.current.gameState.homeTeam.players[0].id;
    act(() => {
      result.current.updatePlayerStats('home', playerId, 'goals', 5);
    });
    expect(result.current.gameState.homeTeam.players[0].goals).toBe(1);
    expect(result.current.gameState.homeTeam.score).toBe(1);

    act(() => {
      result.current.updatePlayerStats('home', playerId, 'goals', 2);
      result.current.updatePlayerStats('home', playerId, 'goals', 3);
      result.current.updatePlayerStats('home', playerId, 'goals', 4);
      result.current.updatePlayerStats('home', playerId, 'goals', 5);
    });
    expect(result.current.gameState.homeTeam.players[0].goals).toBe(5);
    expect(result.current.gameState.homeTeam.score).toBe(5);
    act(() => {
      result.current.updatePlayerStats('home', playerId, 'goals', 0);
    });
    expect(result.current.gameState.homeTeam.players[0].goals).toBe(4);
    expect(result.current.gameState.homeTeam.score).toBe(4);
  });
});

describe('possession switching', () => {
  it('switches to opponent and pauses after a goal', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.toggleTimer();
      result.current.switchBallPossession('away');
      result.current.updateTeam('away', 'score', 1);
    });
    expect(result.current.gameState.ballPossession).toBe('home');
    expect(result.current.gameState.isRunning).toBe(false);
    expect(result.current.gameState.awayTeam.score).toBe(1);
  });

  it('switches to opponent and pauses after a foul', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.toggleTimer();
      result.current.updateTeam('home', 'fouls', 1);
    });
    expect(result.current.gameState.ballPossession).toBe('away');
    expect(result.current.gameState.isRunning).toBe(false);
  });
});

describe('foul reset behavior', () => {
  it('resets fouls between halves in futsal', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeam('home', 'fouls', 3);
      result.current.updateTeam('away', 'fouls', 2);
      result.current.updatePeriod(2);
    });
    expect(result.current.gameState.homeTeam.fouls).toBe(0);
    expect(result.current.gameState.awayTeam.fouls).toBe(0);
  });

  it('carries fouls between halves in football', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.changeGamePreset(0);
      result.current.updateTeam('home', 'fouls', 3);
      result.current.updateTeam('away', 'fouls', 2);
      result.current.updatePeriod(2);
    });
    expect(result.current.gameState.homeTeam.fouls).toBe(3);
    expect(result.current.gameState.awayTeam.fouls).toBe(2);
  });
});

describe('useGameState time limits', () => {
  it('clamps time to half duration in regular phase', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTime(999, 30);
    });
    expect(result.current.gameState.time.minutes).toBe(
      result.current.gameState.gamePreset.halfDuration
    );
    expect(result.current.gameState.time.seconds).toBe(0);
  });

  it('clamps time to extra-time duration in extra-time phase', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.changeGamePreset(1); // preset with extra time and penalties
      result.current.updatePeriod(3); // switch to extra-time
      result.current.updateTime(999, 30);
    });
    expect(result.current.gameState.matchPhase).toBe('extra-time');
    expect(result.current.gameState.time.minutes).toBe(
      result.current.gameState.gamePreset.extraTimeDuration
    );
    expect(result.current.gameState.time.seconds).toBe(0);
  });

  it('keeps timer at zero during penalties', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.changeGamePreset(1);
      result.current.updatePeriod(5); // switch to penalties
      result.current.updateTime(5, 30);
    });
    expect(result.current.gameState.matchPhase).toBe('penalties');
    expect(result.current.gameState.time.minutes).toBe(0);
    expect(result.current.gameState.time.seconds).toBe(0);
  });

  it('resetTimer respects current phase duration', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.changeGamePreset(1);
      result.current.updatePeriod(3);
    });
    act(() => {
      result.current.resetTimer();
    });
    expect(result.current.gameState.time.minutes).toBe(
      result.current.gameState.gamePreset.extraTimeDuration
    );
    act(() => {
      result.current.updatePeriod(5);
      result.current.resetTimer();
    });
    expect(result.current.gameState.time.minutes).toBe(0);
    expect(result.current.gameState.time.seconds).toBe(0);
  });
});

describe('game restrictions', () => {
  it('prevents changing game format after start', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updateTeam('home', 'score', 1);
      result.current.changeGamePreset(0);
    });
    expect(result.current.gameState.gamePreset).not.toBe(GAME_PRESETS[0]);
  });

  it('does not allow reverting to previous half', () => {
    const { result } = renderHook(() => useGameState(), { legacyRoot: true });
    act(() => {
      result.current.updatePeriod(2);
      result.current.updatePeriod(1);
    });
    expect(result.current.gameState.half).toBe(2);
  });
});

