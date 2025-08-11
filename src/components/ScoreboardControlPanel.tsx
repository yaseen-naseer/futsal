import React, { useState } from 'react';
import { GameState } from '../types';
import { Scoreboard } from './Scoreboard';
import { ControlPanelButton } from './ControlPanelButton';
import { useNavigate } from 'react-router-dom';

interface Props {
  gameState: GameState;
}

export const ScoreboardControlPanel: React.FC<Props> = ({ gameState }) => {
  const navigate = useNavigate();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(200);

  const url = `${window.location.origin}/scoreboard?width=${width}&height=${height}`;

  return (
    <div className="p-4 space-y-4 relative">
      <ControlPanelButton onClick={() => navigate('/dashboard')} />
      <div className="flex gap-4">
        <label className="flex flex-col">
          <span className="text-sm mb-1">Width</span>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(parseInt(e.target.value) || 0)}
            className="border rounded p-1 w-24"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm mb-1">Height</span>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(parseInt(e.target.value) || 0)}
            className="border rounded p-1 w-24"
          />
        </label>
      </div>
      <div>
        <label className="text-sm mb-1 block">Shareable Link</label>
        <input type="text" readOnly value={url} className="border rounded p-2 w-full" />
        <button
          onClick={() => window.open(url, '_blank')}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Open Scoreboard
        </button>
      </div>
      <div className="border rounded p-4 bg-gray-100 dark:bg-gray-800">
        <Scoreboard gameState={gameState} width={width} height={height} />
      </div>
    </div>
  );
};
