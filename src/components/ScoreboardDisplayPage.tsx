import React from 'react';
import { GameState } from '../types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ScoreboardDisplay } from './ScoreboardDisplay';
import { ControlPanelButton } from './ControlPanelButton';

interface Props {
  gameState: GameState;
}

export const ScoreboardDisplayPage: React.FC<Props> = ({ gameState }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const width = parseInt(params.get('width') || '800', 10);
  const height = parseInt(params.get('height') || '200', 10);

  const options = {
    showScore: params.get('showScore') !== '0',
    showFouls: params.get('showFouls') === '1',
    showHalf: params.get('showHalf') !== '0',
    showTimer: params.get('showTimer') !== '0',
    timerMode: (params.get('timerMode') as 'elapsed' | 'remaining') || 'elapsed',
    layout: (params.get('layout') as 'horizontal' | 'vertical') || 'horizontal',
    bgColor: params.get('bgColor') ? decodeURIComponent(params.get('bgColor') as string) : '#000000',
    textColor: params.get('textColor') ? decodeURIComponent(params.get('textColor') as string) : '#ffffff',
  } as const;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <ControlPanelButton onClick={() => navigate('/scoreboard')} />
      <ScoreboardDisplay gameState={gameState} width={width} height={height} options={options} />
    </div>
  );
};
