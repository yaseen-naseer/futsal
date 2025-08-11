import React from 'react';
import { GameState } from '../types';
import { useSearchParams } from 'react-router-dom';
import { Scoreboard } from './Scoreboard';

interface Props {
  gameState: GameState;
}

export const ScoreboardPage: React.FC<Props> = ({ gameState }) => {
  const [params] = useSearchParams();
  const width = parseInt(params.get('width') || '800', 10);
  const height = parseInt(params.get('height') || '200', 10);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <Scoreboard gameState={gameState} width={width} height={height} />
    </div>
  );
};
