import React from 'react';
import { GameState } from '../types';
import { getHalfName } from '../utils/gamePresets';
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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 px-8 py-4 shadow-2xl">
          <div className="flex items-center gap-8">
            {/* Home Team */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {homeTeam.logo ? (
                  <img 
                    src={homeTeam.logo} 
                    alt={homeTeam.name}
                    className="w-12 h-12 object-cover rounded-full border-2 border-blue-400"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border-2 border-blue-400">
                    <span className="text-lg font-bold text-white">{homeTeam.name.charAt(0)}</span>
                  </div>
                )}
                {isWinning(homeTeam.score, awayTeam.score) && (
                  <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                )}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-blue-400">{homeTeam.name}</div>
                <div className="text-2xl font-bold text-white">{homeTeam.score}</div>
              </div>
            </div>

            {/* Center - Time */}
            <div className="text-center px-6">
              <div className="text-sm text-green-400 mb-1">
                {getHalfName(gameState.half, gameState.gamePreset, gameState.matchPhase)}
              </div>
              <div className="text-3xl font-mono font-bold text-green-400">
                {formatTime(time.minutes, time.seconds)}
              </div>
              <div className={`inline-flex items-center gap-1 mt-1 ${
                gameState.isRunning ? 'text-green-400' : 'text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  gameState.isRunning ? 'bg-green-400' : 'bg-red-400'
                } ${gameState.isRunning ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs font-semibold">
                  {gameState.isRunning ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-sm font-medium text-red-400">{awayTeam.name}</div>
                <div className="text-2xl font-bold text-white">{awayTeam.score}</div>
              </div>
              <div className="relative">
                {awayTeam.logo ? (
                  <img 
                    src={awayTeam.logo} 
                    alt={awayTeam.name}
                    className="w-12 h-12 object-cover rounded-full border-2 border-red-400"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center border-2 border-red-400">
                    <span className="text-lg font-bold text-white">{awayTeam.name.charAt(0)}</span>
                  </div>
                )}
                {isWinning(awayTeam.score, homeTeam.score) && (
                  <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                )}
              </div>
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