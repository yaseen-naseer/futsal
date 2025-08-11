import React from 'react';
import { GameState } from '../types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Scoreboard } from './Scoreboard';
import { ControlPanelButton } from './ControlPanelButton';

interface Props {
  gameState: GameState;
}

export const ScoreboardPage: React.FC<Props> = ({ gameState }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const width = parseInt(params.get('width') || '800', 10);
  const height = parseInt(params.get('height') || '200', 10);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <ControlPanelButton onClick={() => navigate('/scoreboard/control')} />
      <Scoreboard gameState={gameState} width={width} height={height} />
    </div>
  );
};
