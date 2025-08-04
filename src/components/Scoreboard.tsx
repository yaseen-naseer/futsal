import React from 'react';
import { GameState } from '../types';
import { getHalfName } from '../utils/gamePresets';
import { Crown } from 'lucide-react';
import { formatTime, isWinning } from '../utils/format';

interface ScoreboardProps {
  gameState: GameState;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ gameState }) => {
  const { homeTeam, awayTeam, time } = gameState;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white flex items-center justify-center overflow-hidden font-sans">
      <div className="w-full h-full flex items-center justify-center px-8 py-6">
        {/* Main Scoreboard */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl w-full max-w-7xl h-full max-h-[900px] flex flex-col justify-center p-18">
          {/* Header */}
          {gameState.tournamentLogo && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm px-8 py-6 rounded-2xl border border-white/20">
                <img 
                  src={gameState.tournamentLogo} 
                  alt="Tournament Logo"
                  className="max-h-16 max-w-64 object-contain"
                />
              </div>
            </div>
          )}

          {/* Teams and Score */}
          <div className={`grid grid-cols-3 gap-18 items-center flex-1 ${!gameState.tournamentLogo ? 'justify-center' : ''}`}>
            {/* Home Team */}
            <div className="text-center space-y-6">
              <div className="relative">
                {homeTeam.logo ? (
                  <img 
                    src={homeTeam.logo} 
                    alt={homeTeam.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-600"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full mx-auto flex items-center justify-center border-4 border-gray-600">
                    <span className="text-4xl font-display">{homeTeam.name.charAt(0)}</span>
                  </div>
                )}
                {isWinning(homeTeam.score, awayTeam.score) && (
                  <Crown className="w-8 h-8 text-yellow-400 absolute -top-3 -right-3" />
                )}
              </div>
              <h2 className="text-3xl font-display text-brand-400 truncate">{homeTeam.name}</h2>
              <div className="bg-brand-500/20 rounded-xl p-6">
                <div className="text-8xl font-display text-brand-400">{homeTeam.score}</div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-gray-400">Fouls:</span>
                <span className="bg-accent-500/20 text-accent-400 px-4 py-2 rounded-full text-xl font-semibold">
                  {homeTeam.fouls}
                </span>
              </div>
            </div>

            {/* Center - Time and Period */}
            <div className="text-center space-y-8">
              <div className="bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-2xl p-8 border border-brand-500/30">
                <div className="text-lg text-brand-400 mb-3">TIME</div>
                <div className="text-7xl font-mono font-bold text-brand-400 mb-4">
                  {formatTime(time.minutes, time.seconds)}
                </div>
                <div className="text-lg text-gray-400">
                  {getHalfName(gameState.half, gameState.gamePreset, gameState.matchPhase)}
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
                  gameState.isRunning 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    gameState.isRunning ? 'bg-green-400' : 'bg-red-400'
                  } ${gameState.isRunning ? 'animate-pulse' : ''}`}></div>
                  <span className="text-lg font-semibold">
                    {gameState.isRunning ? 'LIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center space-y-6">
              <div className="relative">
                {awayTeam.logo ? (
                  <img
                    src={awayTeam.logo}
                    alt={awayTeam.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-600"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-accent-500 to-accent-700 rounded-full mx-auto flex items-center justify-center border-4 border-gray-600">
                    <span className="text-4xl font-display">{awayTeam.name.charAt(0)}</span>
                  </div>
                )}
                {isWinning(awayTeam.score, homeTeam.score) && (
                  <Crown className="w-8 h-8 text-yellow-400 absolute -top-3 -right-3" />
                )}
              </div>
              <h2 className="text-3xl font-display text-accent-400 truncate">{awayTeam.name}</h2>
              <div className="bg-accent-500/20 rounded-xl p-6">
                <div className="text-8xl font-display text-accent-400">{awayTeam.score}</div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-gray-400">Fouls:</span>
                <span className="bg-accent-500/20 text-accent-400 px-4 py-2 rounded-full text-xl font-semibold">
                  {awayTeam.fouls}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
