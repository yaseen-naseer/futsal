export interface Player {
  id: string;
  name: string;
  number?: number;
  role: 'starter' | 'substitute';
  goals: number;
  yellowCards: number;
  redCards: number;
}

export interface Team {
  name: string;
  logo?: string;
  score: number;
  fouls: number;
  stats: {
    shotsOffTarget: number;
    shotsOnTarget: number;
    corners: number;
    offsides?: number;
    yellowCards: number;
    redCards: number;
    possession: number; // percentage
  };
  players: Player[];
}

export type GameType = 'football' | 'futsal';
export type MatchFormat = 'regular' | 'knockout' | 'penalty-shootout';

export interface GamePreset {
  type: GameType;
  format: MatchFormat;
  name: string;
  description: string;
  halfDuration: number; // minutes
  totalHalves: number;
  hasExtraTime: boolean;
  extraTimeDuration: number; // minutes per extra half
  hasPenalties: boolean;
  allowsDraws: boolean;
}

export interface GameState {
  homeTeam: Team;
  awayTeam: Team;
  tournamentLogo?: string;
  tournamentName?: string;
  time: {
    minutes: number;
    seconds: number;
  };
  half: number;
  isRunning: boolean;
  ballPossession: 'home' | 'away';
  possessionStartTime: number;
  totalPossessionTime: {
    home: number;
    away: number;
  };
  gamePreset: GamePreset;
  matchPhase: 'regular' | 'extra-time' | 'penalties';
}
