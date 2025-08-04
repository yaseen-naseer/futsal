import { GamePreset } from '../types';

export const GAME_PRESETS: GamePreset[] = [
  // Football Presets
  {
    type: 'football',
    format: 'regular',
    name: 'Football - Regular Match',
    description: '90 minutes (45min halves), allows draws',
    halfDuration: 45,
    totalHalves: 2,
    hasExtraTime: false,
    extraTimeDuration: 15,
    hasPenalties: false,
    allowsDraws: true,
  },
  {
    type: 'football',
    format: 'knockout',
    name: 'Football - Knockout Match',
    description: '90 minutes + Extra Time (30min) + Penalties',
    halfDuration: 45,
    totalHalves: 2,
    hasExtraTime: true,
    extraTimeDuration: 15,
    hasPenalties: true,
    allowsDraws: false,
  },
  {
    type: 'football',
    format: 'penalty-shootout',
    name: 'Football - Direct to Penalties',
    description: '90 minutes, then direct to penalty shootout',
    halfDuration: 45,
    totalHalves: 2,
    hasExtraTime: false,
    extraTimeDuration: 0,
    hasPenalties: true,
    allowsDraws: false,
  },
  
  // Futsal Presets
  {
    type: 'futsal',
    format: 'regular',
    name: 'Futsal - Regular Match',
    description: '40 minutes (20min halves), allows draws',
    halfDuration: 20,
    totalHalves: 2,
    hasExtraTime: false,
    extraTimeDuration: 10,
    hasPenalties: false,
    allowsDraws: true,
  },
  {
    type: 'futsal',
    format: 'penalty-shootout',
    name: 'Futsal - Direct to Penalties',
    description: '40 minutes, then direct to penalty shootout',
    halfDuration: 20,
    totalHalves: 2,
    hasExtraTime: false,
    extraTimeDuration: 0,
    hasPenalties: true,
    allowsDraws: false,
  },
];

export const getPresetByType = (type: GamePreset['type'], format: GamePreset['format']): GamePreset => {
  return GAME_PRESETS.find(preset => preset.type === type && preset.format === format) || GAME_PRESETS[0];
};

export const getHalfName = (half: number, preset: GamePreset, matchPhase: 'regular' | 'extra-time' | 'penalties'): string => {
  if (matchPhase === 'penalties') {
    return 'Penalty Shootout';
  }
  
  if (matchPhase === 'extra-time') {
    if (half === 3) return 'Extra Time - First Half';
    if (half === 4) return 'Extra Time - Second Half';
    return `Extra Time ${half - 2}`;
  }
  
  if (half === 1) return 'First Half';
  if (half === 2) return 'Second Half';
  return `Half ${half}`;
};

export const shouldAutoAdvance = (
  half: number, 
  preset: GamePreset, 
  matchPhase: 'regular' | 'extra-time' | 'penalties',
  homeScore: number,
  awayScore: number
): { advance: boolean; newHalf: number; newPhase: 'regular' | 'extra-time' | 'penalties' } => {
  // End of first half - always advance to second half
  if (half === 1 && matchPhase === 'regular') {
    return { advance: true, newHalf: 2, newPhase: 'regular' };
  }
  
  // End of second half
  if (half === 2 && matchPhase === 'regular') {
    // If it's a draw and knockout format with extra time
    if (homeScore === awayScore && preset.hasExtraTime) {
      return { advance: true, newHalf: 3, newPhase: 'extra-time' };
    }
    // If it's a draw and direct to penalties
    if (homeScore === awayScore && preset.hasPenalties && !preset.hasExtraTime) {
      return { advance: true, newHalf: 5, newPhase: 'penalties' };
    }
    // Regular match end or winner decided
    return { advance: false, newHalf: half, newPhase: matchPhase };
  }
  
  // End of first extra time half
  if (half === 3 && matchPhase === 'extra-time') {
    return { advance: true, newHalf: 4, newPhase: 'extra-time' };
  }
  
  // End of second extra time half
  if (half === 4 && matchPhase === 'extra-time') {
    // If still a draw and has penalties
    if (homeScore === awayScore && preset.hasPenalties) {
      return { advance: true, newHalf: 5, newPhase: 'penalties' };
    }
    // Extra time ends
    return { advance: false, newHalf: half, newPhase: matchPhase };
  }
  
  return { advance: false, newHalf: half, newPhase: matchPhase };
};
