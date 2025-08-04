import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Team } from '../types';
import { GAME_PRESETS, shouldAutoAdvance } from '../utils/gamePresets';

const initialState: GameState = {
  homeTeam: {
    name: 'Home Team',
    score: 0,
    fouls: 0,
    stats: {
      shots: 0,
      shotsOnTarget: 0,
      corners: 0,
      offsides: 0,
      yellowCards: 0,
      redCards: 0,
      possession: 50,
    },
  },
  awayTeam: {
    name: 'Away Team',
    score: 0,
    fouls: 0,
    stats: {
      shots: 0,
      shotsOnTarget: 0,
      corners: 0,
      offsides: 0,
      yellowCards: 0,
      redCards: 0,
      possession: 50,
    },
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

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const keyboardListenerRef = useRef<((event: KeyboardEvent) => void) | null>(null);

  type TeamField = 'name' | 'score' | 'fouls' | 'logo';
  type TeamFieldValue<T extends TeamField> = T extends 'name' | 'logo' ? string : number;

  const updateTeam = useCallback(<T extends TeamField>(team: 'home' | 'away', field: T, value: TeamFieldValue<T>) => {
    setGameState(prev => ({
      ...prev,
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
        [field]: value,
      },
    }));
  }, []);

  const updateTournamentLogo = useCallback((logo: string) => {
    setGameState(prev => ({
      ...prev,
      tournamentLogo: logo,
    }));
  }, []);

  const updateTeamStats = useCallback((team: 'home' | 'away', stat: keyof Team['stats'], value: number) => {
    setGameState(prev => ({
      ...prev,
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
        stats: {
          ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'].stats,
          [stat]: Math.max(0, value),
        },
      },
    }));
  }, []);

  const switchBallPossession = useCallback((newTeam: 'home' | 'away') => {
    setGameState(prev => {
      // Only allow possession switching when timer is running
      if (!prev.isRunning) {
        return prev;
      }
      
      const now = Date.now();
      const timeDiff = now - prev.possessionStartTime;
      
      // Update possession time for previous team
      const updatedPossessionTime = {
        ...prev.totalPossessionTime,
        [prev.ballPossession]: prev.totalPossessionTime[prev.ballPossession] + timeDiff,
      };
      
      // Calculate possession percentages
      const totalTime = updatedPossessionTime.home + updatedPossessionTime.away;
      const homePossession = totalTime > 0 ? Math.round((updatedPossessionTime.home / totalTime) * 100) : 50;
      const awayPossession = 100 - homePossession;
      
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
  }, []);
  const updateTime = useCallback((minutes: number, seconds: number) => {
    setGameState(prev => ({
      ...prev,
      time: { minutes, seconds },
    }));
  }, []);

  const toggleTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      time: { minutes: prev.gamePreset.halfDuration, seconds: 0 },
      isRunning: false,
    }));
  }, []);

  const updatePeriod = useCallback((period: number) => {
    setGameState(prev => ({
      ...prev,
      half: period,
    }));
  }, []);

  const changeGamePreset = useCallback((presetIndex: number) => {
    const preset = GAME_PRESETS[presetIndex];
    setGameState(prev => ({
      ...prev,
      gamePreset: preset,
      time: { minutes: preset.halfDuration, seconds: 0 },
      half: 1,
      matchPhase: 'regular',
      isRunning: false,
    }));
  }, []);
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...initialState,
      gamePreset: prev.gamePreset, // Keep current preset
      time: { minutes: prev.gamePreset.halfDuration, seconds: 0 },
      possessionStartTime: Date.now(),
    }));
  }, []);

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
        case 'KeyD':
        case 'Digit1':
          event.preventDefault();
          switchBallPossession('home');
          break;
        case 'KeyA':
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
  }, [toggleTimer, resetTimer, switchBallPossession]);

  // API endpoint simulation for external control
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      const { type, action } = event.data;
      if (type === 'TIMER_CONTROL') {
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
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toggleTimer, resetTimer]);

  useEffect(() => {
    if (gameState.isRunning) {
      intervalRef.current = setInterval(() => {
        setGameState(prev => {
          const { minutes, seconds } = prev.time;
          
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
              };
            } else {
              // End of match or phase, just stop the timer
              return {
                ...prev,
                isRunning: false,
              };
            }
          }
          
          if (seconds > 0) {
            return {
              ...prev,
              time: { minutes, seconds: seconds - 1 },
            };
          } else {
            return {
              ...prev,
              time: { minutes: minutes - 1, seconds: 59 },
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
    switchBallPossession,
    updateTime,
    toggleTimer,
    resetTimer,
    updatePeriod,
    changeGamePreset,
    resetGame,
  };
};
