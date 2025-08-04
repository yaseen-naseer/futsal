import React from 'react';
import { GameState } from '../../types';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface TimerTabProps {
  gameState: GameState;
  updateTime: (minutes: number, seconds: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  updatePeriod: (period: number) => void;
}

export const TimerTab: React.FC<TimerTabProps> = ({
  gameState,
  updateTime,
  toggleTimer,
  resetTimer,
  updatePeriod,
}) => {
  const adjustTime = (type: 'minutes' | 'seconds', delta: number) => {
    const { minutes, seconds } = gameState.time;
    if (type === 'minutes') {
      const newMinutes = Math.max(0, Math.min(60, minutes + delta));
      updateTime(newMinutes, seconds);
    } else {
      let newSeconds = seconds + delta;
      let newMinutes = minutes;
      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes = Math.min(60, minutes + 1);
      } else if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes = Math.max(0, minutes - 1);
      }
      updateTime(newMinutes, newSeconds);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">Timer Control</h3>

      <div className="space-y-8">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-green-600 mb-4">
            {gameState.time.minutes.toString().padStart(2, '0')}:{gameState.time.seconds.toString().padStart(2, '0')}
          </div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              gameState.isRunning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                gameState.isRunning ? 'bg-green-500' : 'bg-red-500'
              } ${gameState.isRunning ? 'animate-pulse' : ''}`}
            ></div>
            <span className="font-semibold">{gameState.isRunning ? 'RUNNING' : 'PAUSED'}</span>
          </div>
          <span className="text-sm text-gray-600">Period {gameState.half}</span>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              gameState.isRunning ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {gameState.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {gameState.isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Time Adjustment */}
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">Minutes</label>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => adjustTime('minutes', -1)}
                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{gameState.time.minutes}</span>
              <button
                onClick={() => adjustTime('minutes', 1)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">Seconds</label>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => adjustTime('seconds', -1)}
                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{gameState.time.seconds}</span>
              <button
                onClick={() => adjustTime('seconds', 1)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Period Control */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">Game Period</label>
          <div className="text-sm text-gray-600 mb-3">
            {gameState.half === 1 ? 'First Half' : gameState.half === 2 ? 'Second Half' : `Extra Time ${gameState.half - 2}`}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => updatePeriod(Math.max(1, gameState.half - 1))}
              className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">{gameState.half}</span>
            <button
              onClick={() => updatePeriod(gameState.half + 1)}
              className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">Current Format: {gameState.gamePreset.name}</div>
        </div>
      </div>
    </div>
  );
};

