import React, { useEffect, useRef, useState } from 'react';
import type { GameState } from '../types';

export const RemoteControl: React.FC = () => {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('gameState');
      if (stored) {
        try {
          setGameState(JSON.parse(stored) as GameState);
        } catch {
          // ignore malformed stored state
        }
      }
    }

    const channel = new BroadcastChannel('game-state');
    channelRef.current = channel;
    channel.addEventListener('message', event => {
      if (event.data?.type === 'STATE_UPDATE') {
        setGameState(event.data.state as GameState);
      }
    });

    return () => {
      channel.close();
    };
  }, []);

  const send = (data: unknown) => {
    channelRef.current?.postMessage(data);
  };

  const toggleTimer = () => {
    send({ type: 'TIMER_CONTROL', action: 'TOGGLE' });
  };

  const updateTeam = (
    team: 'home' | 'away',
    field: 'score' | 'fouls',
    value: number,
  ) => {
    send({ type: 'TEAM_UPDATE', team, field, value });
  };

  if (!gameState) {
    return <div className="p-4">Waiting for scoreboard...</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <div className="text-center">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {gameState.isRunning ? 'Pause' : 'Start'} Timer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-center mb-2">{gameState.homeTeam.name}</h2>
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => updateTeam('home', 'score', gameState.homeTeam.score + 1)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              + Score
            </button>
            <button
              onClick={() =>
                updateTeam('home', 'score', Math.max(0, gameState.homeTeam.score - 1))
              }
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              - Score
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => updateTeam('home', 'fouls', gameState.homeTeam.fouls + 1)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              + Foul
            </button>
            <button
              onClick={() =>
                updateTeam('home', 'fouls', Math.max(0, gameState.homeTeam.fouls - 1))
              }
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              - Foul
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-center mb-2">{gameState.awayTeam.name}</h2>
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => updateTeam('away', 'score', gameState.awayTeam.score + 1)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              + Score
            </button>
            <button
              onClick={() =>
                updateTeam('away', 'score', Math.max(0, gameState.awayTeam.score - 1))
              }
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              - Score
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => updateTeam('away', 'fouls', gameState.awayTeam.fouls + 1)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              + Foul
            </button>
            <button
              onClick={() =>
                updateTeam('away', 'fouls', Math.max(0, gameState.awayTeam.fouls - 1))
              }
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              - Foul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteControl;

