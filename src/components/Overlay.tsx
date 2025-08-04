import React from 'react';
import { GameState } from '../types';
import { Crown } from 'lucide-react';

interface OverlayProps {
  gameState: GameState;
}

export const Overlay: React.FC<OverlayProps> = ({ gameState }) => {
  const { homeTeam, awayTeam, time } = gameState;
  
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isWinning = (teamScore: number, opponentScore: number) => {
    return teamScore > opponentScore;
  };


  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 flex justify-center items-center h-16 z-50">
        <div className="flex h-full text-white shadow-2xl">
          {/* Home Team */}
          <div className="flex items-center gap-2 px-4 h-full bg-blue-600/80 backdrop-blur-md">
            <div className="relative">
              {homeTeam.logo ? (
                <img
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{homeTeam.name.charAt(0)}</span>
                </div>
              )}
              {isWinning(homeTeam.score, awayTeam.score) && (
                <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </div>
            <span className="font-medium">{homeTeam.name}</span>
            <span className="text-2xl font-bold">{homeTeam.score}</span>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center px-6 bg-black/80 backdrop-blur-md">
            <span className="text-3xl font-mono font-bold text-green-400">
              {formatTime(time.minutes, time.seconds)}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 px-4 h-full bg-red-600/80 backdrop-blur-md">
            <span className="text-2xl font-bold">{awayTeam.score}</span>
            <span className="font-medium">{awayTeam.name}</span>
            <div className="relative">
              {awayTeam.logo ? (
                <img
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{awayTeam.name.charAt(0)}</span>
                </div>
              )}
              {isWinning(awayTeam.score, homeTeam.score) && (
                <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar (Optional - can be toggled) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 px-6 py-2">
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-medium">{homeTeam.name}</span>
              <span className="text-white/60">Fouls:</span>
              <span className="text-red-400 font-bold">{homeTeam.fouls}</span>
              <span className="text-white/60">|</span>
              <span className="text-white/60">Poss:</span>
              <span className="text-blue-400 font-bold">{homeTeam.stats.possession}%</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-medium">{awayTeam.name}</span>
              <span className="text-white/60">Fouls:</span>
              <span className="text-red-400 font-bold">{awayTeam.fouls}</span>
              <span className="text-white/60">|</span>
              <span className="text-white/60">Poss:</span>
              <span className="text-red-400 font-bold">{awayTeam.stats.possession}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
