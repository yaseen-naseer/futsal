import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Team, Player } from '../types';
import { GAME_PRESETS, shouldAutoAdvance } from '../utils/gamePresets';

const calculatePossession = (prev: GameState, now: number) => {
  const timeDiff = now - prev.possessionStartTime;
  const updatedPossessionTime = {
    ...prev.totalPossessionTime,
    [prev.ballPossession]: prev.totalPossessionTime[prev.ballPossession] + timeDiff,
  } as const;
  const totalTime = updatedPossessionTime.home + updatedPossessionTime.away;
  if (totalTime < 1000) {
    return {
      updatedPossessionTime,
      homePossession: 50,
      awayPossession: 50,
    };
  }

  const home = parseFloat(((updatedPossessionTime.home / totalTime) * 100).toFixed(1));
  const away = parseFloat((100 - home).toFixed(1));
  return { updatedPossessionTime, homePossession: home, awayPossession: away };
};

const adjustTeamStatsForType = (team: Team, type: GameState['gamePreset']['type']): Team => {
  if (type === 'football') {
    return {
      ...team,
      stats: {
        ...team.stats,
        offsides: team.stats.offsides ?? 0,
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { offsides: _unused, ...rest } = team.stats;
  return {
    ...team,
    stats: rest,
  };
};

const initialState: GameState = {
  homeTeam: {
    name: 'Home Team',
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
  },
  awayTeam: {
    name: 'Away Team',
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
  },
  time: {
    minutes: 20, // Will be set by preset
    seconds: 0,
  },
  half: 1,
  isRunning: false,
  ballPossession: 'home',
  possessionStartTime: Date.now(),
  totalPossessionTime: {
    home: 0,
    away: 0,
  },
  gamePreset: GAME_PRESETS[3], // Default to Futsal Regular
  matchPhase: 'regular',
};

const STORAGE_KEY = 'gameState';

export const useGameState = () => {
  const [gameState, _setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<GameState>;
          return {
            ...initialState,
            ...parsed,
            homeTeam: {
              ...initialState.homeTeam,
              ...parsed.homeTeam,
              stats: {
                ...initialState.homeTeam.stats,
                ...parsed.homeTeam?.stats,
              },
              players: parsed.homeTeam?.players ?? [],
            },
            awayTeam: {
              ...initialState.awayTeam,
              ...parsed.awayTeam,
              stats: {
                ...initialState.awayTeam.stats,
                ...parsed.awayTeam?.stats,
              },
              players: parsed.awayTeam?.players ?? [],
            },
            time: {
              ...initialState.time,
              ...parsed.time,
            },
            totalPossessionTime: {
              ...initialState.totalPossessionTime,
              ...parsed.totalPossessionTime,
            },
            gamePreset: {
              ...initialState.gamePreset,
              ...parsed.gamePreset,
            },
          } as GameState;
        } catch {
          // ignore malformed stored state
        }
      }
    }
    return initialState;
  });
  const historyRef = useRef<{ past: GameState[]; future: GameState[] }>({ past: [], future: [] });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const keyboardListenerRef = useRef<((event: KeyboardEvent) => void) | null>(null);
  const skipStorageRef = useRef(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const setGameState = useCallback(
    (updater: GameState | ((prev: GameState) => GameState)) => {
      _setGameState(prev => {
        const newState =
          typeof updater === 'function'
            ? (updater as (p: GameState) => GameState)(prev)
            : updater;
        historyRef.current.past.push(prev);
        historyRef.current.future = [];
        return newState;
      });
    },
    [],
  );

  const updateTeam = useCallback(
    <K extends keyof Pick<Team, 'name' | 'score' | 'fouls' | 'logo'>>(
      team: 'home' | 'away',
      field: K,
      value: Team[K],
    ) => {
      setGameState(prev => ({
        ...prev,
        [team === 'home' ? 'homeTeam' : 'awayTeam']: {
          ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
          [field]: value,
        },
      }));
    },
    [setGameState],
  );

  const updateTournamentLogo = useCallback((logo: string) => {
    setGameState(prev => ({
      ...prev,
      tournamentLogo: logo,
    }));
  }, [setGameState]);

  const updateTeamStats = useCallback((team: 'home' | 'away', stat: keyof Team['stats'], value: number) => {
    setGameState(prev => {
      if (!prev.isRunning) return prev;
      return {
        ...prev,
        [team === 'home' ? 'homeTeam' : 'awayTeam']: {
          ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
          stats: {
            ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'].stats,
            [stat]: Math.max(0, value),
          },
        },
      };
    });
  }, [setGameState]);

  const addPlayer = useCallback(
    (team: 'home' | 'away', name: string, number?: number) => {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name,
        number,
        goals: 0,
        yellowCards: 0,
        redCards: 0,
      };
      setGameState(prev => ({
        ...prev,
        [team === 'home' ? 'homeTeam' : 'awayTeam']: {
          ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
          players: [
            ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'].players,
            newPlayer,
          ],
        },
      }));
    },
    [setGameState],
  );

  const removePlayer = useCallback(
    (team: 'home' | 'away', playerId: string) => {
      setGameState(prev => ({
        ...prev,
        [team === 'home' ? 'homeTeam' : 'awayTeam']: {
          ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
          players: prev[team === 'home' ? 'homeTeam' : 'awayTeam'].players.filter(
            p => p.id !== playerId,
          ),
        },
      }));
    },
    [setGameState],
  );

  const updatePlayerStats = useCallback(
    (
      team: 'home' | 'away',
      playerId: string,
      field: 'goals' | 'yellowCards' | 'redCards',
      value: number,
    ) => {
      setGameState(prev => {
        const teamKey = team === 'home' ? 'homeTeam' : 'awayTeam';
        const players = prev[teamKey].players.map(p =>
          p.id === playerId ? { ...p, [field]: Math.max(0, value) } : p,
        );
        let newTeam = { ...prev[teamKey], players };
        if (field === 'goals') {
          const teamScore = players.reduce((sum, p) => sum + p.goals, 0);
          newTeam = { ...newTeam, score: teamScore };
        }
        return {
          ...prev,
          [teamKey]: newTeam,
        };
      });
    },
    [setGameState],
  );

  const switchBallPossession = useCallback((newTeam: 'home' | 'away') => {
    setGameState(prev => {
      // Only allow possession switching when timer is running
      if (!prev.isRunning) {
        return prev;
      }

      const now = Date.now();
      const { updatedPossessionTime, homePossession, awayPossession } =
        calculatePossession(prev, now);

      return {
        ...prev,
        ballPossession: newTeam,
        possessionStartTime: now,
        totalPossessionTime: updatedPossessionTime,
        homeTeam: {
          ...prev.homeTeam,
          stats: {
            ...prev.homeTeam.stats,
            possession: homePossession,
          },
        },
        awayTeam: {
          ...prev.awayTeam,
          stats: {
            ...prev.awayTeam.stats,
            possession: awayPossession,
          },
        },
      };
    });
  }, [setGameState]);
  const updateTime = useCallback((minutes: number, seconds: number) => {
    setGameState(prev => ({
      ...prev,
      time: { minutes, seconds },
    }));
  }, [setGameState]);

  const toggleTimer = useCallback(() => {
    setGameState(prev => {
      const now = Date.now();
      if (prev.isRunning) {
        const { updatedPossessionTime, homePossession, awayPossession } =
          calculatePossession(prev, now);
        return {
          ...prev,
          isRunning: false,
          possessionStartTime: now,
          totalPossessionTime: updatedPossessionTime,
          homeTeam: {
            ...prev.homeTeam,
            stats: { ...prev.homeTeam.stats, possession: homePossession },
          },
          awayTeam: {
            ...prev.awayTeam,
            stats: { ...prev.awayTeam.stats, possession: awayPossession },
          },
        };
      }
      return { ...prev, isRunning: true, possessionStartTime: now };
    });
  }, [setGameState]);

  const resetTimer = useCallback(() => {
    setGameState(prev => {
      const now = Date.now();
      const { updatedPossessionTime, homePossession, awayPossession } =
        prev.isRunning
          ? calculatePossession(prev, now)
          : {
              updatedPossessionTime: prev.totalPossessionTime,
              homePossession: prev.homeTeam.stats.possession,
              awayPossession: prev.awayTeam.stats.possession,
            };
      return {
        ...prev,
        time: { minutes: prev.gamePreset.halfDuration, seconds: 0 },
        isRunning: false,
        possessionStartTime: now,
        totalPossessionTime: updatedPossessionTime,
        homeTeam: {
          ...prev.homeTeam,
          stats: { ...prev.homeTeam.stats, possession: homePossession },
        },
        awayTeam: {
          ...prev.awayTeam,
          stats: { ...prev.awayTeam.stats, possession: awayPossession },
        },
      };
    });
  }, [setGameState]);

  const updatePeriod = useCallback((period: number) => {
    setGameState(prev => {
      const now = Date.now();
      const { updatedPossessionTime, homePossession, awayPossession } =
        prev.isRunning
          ? calculatePossession(prev, now)
          : {
              updatedPossessionTime: prev.totalPossessionTime,
              homePossession: prev.homeTeam.stats.possession,
              awayPossession: prev.awayTeam.stats.possession,
            };

      const preset = prev.gamePreset;
      let newHalf = period;
      let newPhase: GameState['matchPhase'] = prev.matchPhase;
      let minutes = prev.time.minutes;
      let seconds = prev.time.seconds;

      if (preset.hasExtraTime) {
        if (period <= 2) {
          newPhase = 'regular';
          minutes = preset.halfDuration;
          seconds = 0;
        } else if (period === 3 || period === 4) {
          newPhase = 'extra-time';
          minutes = preset.extraTimeDuration;
          seconds = 0;
        } else if (preset.hasPenalties) {
          newHalf = 5;
          newPhase = 'penalties';
          minutes = 0;
          seconds = 0;
        } else {
          newHalf = 4;
        }
      } else {
        if (period <= 2) {
          newPhase = 'regular';
          minutes = preset.halfDuration;
          seconds = 0;
          newHalf = period;
        } else if (preset.hasPenalties) {
          newHalf = 5;
          newPhase = 'penalties';
          minutes = 0;
          seconds = 0;
        } else {
          newHalf = 2;
        }
      }

      return {
        ...prev,
        half: newHalf,
        matchPhase: newPhase,
        time: { minutes, seconds },
        isRunning: false,
        possessionStartTime: now,
        totalPossessionTime: updatedPossessionTime,
        homeTeam: {
          ...prev.homeTeam,
          stats: { ...prev.homeTeam.stats, possession: homePossession },
        },
        awayTeam: {
          ...prev.awayTeam,
          stats: { ...prev.awayTeam.stats, possession: awayPossession },
        },
      };
    });
  }, [setGameState]);

  const changeGamePreset = useCallback((presetIndex: number) => {
    const preset = GAME_PRESETS[presetIndex];
    setGameState(prev => {
      const now = Date.now();
      const { updatedPossessionTime, homePossession, awayPossession } =
        prev.isRunning
          ? calculatePossession(prev, now)
          : {
              updatedPossessionTime: prev.totalPossessionTime,
              homePossession: prev.homeTeam.stats.possession,
              awayPossession: prev.awayTeam.stats.possession,
            };
      return {
        ...prev,
        gamePreset: preset,
        time: { minutes: preset.halfDuration, seconds: 0 },
        half: 1,
        matchPhase: 'regular',
        isRunning: false,
        possessionStartTime: now,
        totalPossessionTime: updatedPossessionTime,
        homeTeam: adjustTeamStatsForType(
          { ...prev.homeTeam, stats: { ...prev.homeTeam.stats, possession: homePossession } },
          preset.type,
        ),
        awayTeam: adjustTeamStatsForType(
          { ...prev.awayTeam, stats: { ...prev.awayTeam.stats, possession: awayPossession } },
          preset.type,
        ),
      };
    });
  }, [setGameState]);
  const resetGame = useCallback(() => {
    skipStorageRef.current = true;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setGameState(prev => {
      const base = {
        ...initialState,
        gamePreset: prev.gamePreset, // Keep current preset
        time: { minutes: prev.gamePreset.halfDuration, seconds: 0 },
        possessionStartTime: Date.now(),
      };

      return {
        ...base,
        homeTeam: adjustTeamStatsForType(base.homeTeam, prev.gamePreset.type),
        awayTeam: adjustTeamStatsForType(base.awayTeam, prev.gamePreset.type),
      };
    });
  }, [setGameState]);

  const undo = useCallback(() => {
    _setGameState(prev => {
      const past = historyRef.current.past;
      if (past.length === 0) return prev;
      const previous = past.pop() as GameState;
      historyRef.current.future.push(prev);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    _setGameState(prev => {
      const future = historyRef.current.future;
      if (future.length === 0) return prev;
      const next = future.pop() as GameState;
      historyRef.current.past.push(prev);
      return next;
    });
  }, []);

  useEffect(() => {
    if (skipStorageRef.current) {
      skipStorageRef.current = false;
      return;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  // Keyboard shortcuts for external control
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only respond to keyboard shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          toggleTimer();
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetTimer();
          }
          break;
        case 'Escape':
          event.preventDefault();
          setGameState(prev => ({ ...prev, isRunning: false }));
          break;
        case 'KeyA':
        case 'Digit1':
          event.preventDefault();
          switchBallPossession('home');
          break;
        case 'KeyD':
        case 'Digit2':
          event.preventDefault();
          switchBallPossession('away');
          break;
      }
    };

    keyboardListenerRef.current = handleKeyPress;
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      if (keyboardListenerRef.current) {
        document.removeEventListener('keydown', keyboardListenerRef.current);
      }
    };
  }, [toggleTimer, resetTimer, switchBallPossession, setGameState]);

  const handleRemoteMessage = useCallback(
    (data: unknown) => {
      if (typeof data !== 'object' || data === null) {
        return;
      }

      const { type } = data as { type?: string };

      switch (type) {
        case 'TIMER_CONTROL': {
          const { action } = data as { action?: string };
          switch (action) {
            case 'START':
              setGameState(prev => ({ ...prev, isRunning: true }));
              break;
            case 'STOP':
              setGameState(prev => ({ ...prev, isRunning: false }));
              break;
            case 'TOGGLE':
              toggleTimer();
              break;
            case 'RESET':
              resetTimer();
              break;
            default:
              break;
          }
          break;
        }
        case 'TEAM_UPDATE': {
          const { team, field, value } = data as {
            team?: 'home' | 'away';
            field?: keyof Pick<Team, 'name' | 'score' | 'fouls' | 'logo'>;
            value?: string | number;
          };
          if (team === 'home' || team === 'away') {
            if (field) {
              updateTeam(team, field, value as Team[keyof Team]);
            }
          }
          break;
        }
        default:
          break;
      }
    },
    [toggleTimer, resetTimer, setGameState, updateTeam],
  );

  // API endpoint simulation for external control
  useEffect(() => {
    const windowHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      handleRemoteMessage(event.data);
    };

    window.addEventListener('message', windowHandler);
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('game-state');
      channel.addEventListener('message', e => handleRemoteMessage(e.data));
      channelRef.current = channel;
    }
    return () => {
      window.removeEventListener('message', windowHandler);
      channel?.close();
    };
  }, [handleRemoteMessage]);

  useEffect(() => {
    channelRef.current?.postMessage({ type: 'STATE_UPDATE', state: gameState });
  }, [gameState]);

  useEffect(() => {
    if (gameState.isRunning) {
      intervalRef.current = setInterval(() => {
        _setGameState(prev => {
          const { minutes, seconds } = prev.time;
          const now = Date.now();
          const { updatedPossessionTime, homePossession, awayPossession } =
            calculatePossession(prev, now);

          if (minutes === 0 && seconds === 0) {
            // Timer has reached 00:00 - check if we should auto-advance
            const autoAdvance = shouldAutoAdvance(
              prev.half,
              prev.gamePreset,
              prev.matchPhase,
              prev.homeTeam.score,
              prev.awayTeam.score
            );

            if (autoAdvance.advance) {
              // Auto-advance to next phase
              const newDuration = autoAdvance.newPhase === 'extra-time'
                ? prev.gamePreset.extraTimeDuration
                : autoAdvance.newPhase === 'penalties'
                ? 0 // Penalties don't have a timer
                : prev.gamePreset.halfDuration;

              return {
                ...prev,
                half: autoAdvance.newHalf,
                matchPhase: autoAdvance.newPhase,
                time: { minutes: newDuration, seconds: 0 },
                isRunning: false,
                possessionStartTime: now,
                totalPossessionTime: updatedPossessionTime,
                homeTeam: {
                  ...prev.homeTeam,
                  stats: { ...prev.homeTeam.stats, possession: homePossession },
                },
                awayTeam: {
                  ...prev.awayTeam,
                  stats: { ...prev.awayTeam.stats, possession: awayPossession },
                },
              };
            } else {
              // End of match or phase, just stop the timer
              return {
                ...prev,
                isRunning: false,
                possessionStartTime: now,
                totalPossessionTime: updatedPossessionTime,
                homeTeam: {
                  ...prev.homeTeam,
                  stats: { ...prev.homeTeam.stats, possession: homePossession },
                },
                awayTeam: {
                  ...prev.awayTeam,
                  stats: { ...prev.awayTeam.stats, possession: awayPossession },
                },
              };
            }
          }

          if (seconds > 0) {
            return {
              ...prev,
              time: { minutes, seconds: seconds - 1 },
              possessionStartTime: now,
              totalPossessionTime: updatedPossessionTime,
              homeTeam: {
                ...prev.homeTeam,
                stats: { ...prev.homeTeam.stats, possession: homePossession },
              },
              awayTeam: {
                ...prev.awayTeam,
                stats: { ...prev.awayTeam.stats, possession: awayPossession },
              },
            };
          } else {
            return {
              ...prev,
              time: { minutes: minutes - 1, seconds: 59 },
              possessionStartTime: now,
              totalPossessionTime: updatedPossessionTime,
              homeTeam: {
                ...prev.homeTeam,
                stats: { ...prev.homeTeam.stats, possession: homePossession },
              },
              awayTeam: {
                ...prev.awayTeam,
                stats: { ...prev.awayTeam.stats, possession: awayPossession },
              },
            };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.isRunning]);

  return {
    gameState,
    updateTeam,
    updateTournamentLogo,
    updateTeamStats,
    addPlayer,
    removePlayer,
    updatePlayerStats,
    switchBallPossession,
    updateTime,
    toggleTimer,
    resetTimer,
    updatePeriod,
    changeGamePreset,
    resetGame,
    undo,
    redo,
  };
};
