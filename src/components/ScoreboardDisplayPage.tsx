import React, { useEffect, useState } from 'react';
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

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / width;
      const scaleY = window.innerHeight / height;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [width, height]);

  const options = {
    showScore: params.get('showScore') !== '0',
    showFouls: params.get('showFouls') === '1',
    showHalf: params.get('showHalf') !== '0',
    showTimer: params.get('showTimer') !== '0',
    timerMode: (params.get('timerMode') as 'elapsed' | 'remaining') || 'elapsed',
    layout: (params.get('layout') as 'horizontal' | 'vertical') || 'horizontal',
    bgColor: params.get('bgColor') ? decodeURIComponent(params.get('bgColor') as string) : '#1d4ed8',
    teamAColor: params.get('teamAColor') ? decodeURIComponent(params.get('teamAColor') as string) : '#3b82f6',
    teamBColor: params.get('teamBColor') ? decodeURIComponent(params.get('teamBColor') as string) : '#ef4444',
    timerColor: params.get('timerColor') ? decodeURIComponent(params.get('timerColor') as string) : '#ffffff',
  } as const;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <ControlPanelButton onClick={() => navigate('/scoreboard')} />
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <ScoreboardDisplay gameState={gameState} width={width} height={height} options={options} />
      </div>
    </div>
  );
};
