import React, { useState } from 'react';
import { GameState } from '../types';
import { ScoreboardDisplay } from './ScoreboardDisplay';
import { ControlPanelButton } from './ControlPanelButton';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface Props {
  gameState: GameState;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Scoreboard: React.FC<Props> = ({ gameState, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(200);

  const resolutions = [
    { label: '800x200', width: 800, height: 200 },
    { label: '1024x256', width: 1024, height: 256 },
    { label: '1280x720', width: 1280, height: 720 },
    { label: '1920x1080', width: 1920, height: 1080 },
    { label: 'Custom', width: null, height: null },
  ];
  const [resolution, setResolution] = useState(resolutions[0].label);

  const [showScore, setShowScore] = useState(true);
  const [showFouls, setShowFouls] = useState(false);
  const [showHalf, setShowHalf] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [timerMode, setTimerMode] = useState<'elapsed' | 'remaining'>('elapsed');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [bgColor, setBgColor] = useState('#1d4ed8');
  const [textColor, setTextColor] = useState('#ffffff');

  const handleResolutionChange = (value: string) => {
    setResolution(value);
    const selected = resolutions.find(r => r.label === value);
    if (selected && selected.width && selected.height) {
      setWidth(selected.width);
      setHeight(selected.height);
    }
  };

  const url = `${window.location.origin}/scoreboard/display?width=${width}&height=${height}` +
    `&showScore=${showScore ? 1 : 0}&showFouls=${showFouls ? 1 : 0}&showHalf=${showHalf ? 1 : 0}` +
    `&showTimer=${showTimer ? 1 : 0}&timerMode=${timerMode}&layout=${layout}` +
    `&bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}`;

  return (
    <div className="min-h-screen p-4 space-y-4 relative bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <ControlPanelButton onClick={() => navigate('/dashboard')} />
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col">
          <span className="text-sm mb-1">Resolution</span>
          <select
            value={resolution}
            onChange={e => handleResolutionChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            {resolutions.map(r => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        {resolution === 'Custom' && (
          <>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Width</span>
              <input
                type="number"
                value={width}
                onChange={e => {
                  setWidth(parseInt(e.target.value) || 0);
                  setResolution('Custom');
                }}
              className="border border-gray-300 dark:border-gray-600 rounded p-1 w-24 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Height</span>
            <input
              type="number"
              value={height}
              onChange={e => {
                setHeight(parseInt(e.target.value) || 0);
                setResolution('Custom');
              }}
              className="border border-gray-300 dark:border-gray-600 rounded p-1 w-24 bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </label>
        </>
      )}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showScore} onChange={e => setShowScore(e.target.checked)} />
          <span>Score</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showFouls} onChange={e => setShowFouls(e.target.checked)} />
          <span>Fouls</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showHalf} onChange={e => setShowHalf(e.target.checked)} />
          <span>Half</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showTimer} onChange={e => setShowTimer(e.target.checked)} />
          <span>Timer</span>
        </label>
        <div className="flex items-center gap-2">
          <span>Timer Mode:</span>
          <select
            value={timerMode}
            onChange={e => setTimerMode(e.target.value as 'elapsed' | 'remaining')}
            className="border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="elapsed">Elapsed</option>
            <option value="remaining">Remaining</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>Layout:</span>
          <select
            value={layout}
            onChange={e => setLayout(e.target.value as 'horizontal' | 'vertical')}
            className="border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
        <label className="flex items-center gap-2">
          <span>BG</span>
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Text</span>
          <input
            type="color"
            value={textColor}
            onChange={e => setTextColor(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded bg-transparent"
          />
        </label>
      </div>
      <div>
        <label className="text-sm mb-1 block">Shareable Link</label>
        <input
          type="text"
          readOnly
          value={url}
          className="border border-gray-300 dark:border-gray-600 rounded p-2 w-full bg-white dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          onClick={() => window.open(url, '_blank')}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Open Scoreboard
        </button>
      </div>
      <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-gray-100 dark:bg-gray-800">
        <ScoreboardDisplay
          gameState={gameState}
          width={width}
          height={height}
          options={{
            showScore,
            showFouls,
            showHalf,
            showTimer,
            timerMode,
            layout,
            bgColor,
            textColor,
          }}
        />
      </div>
    </div>
  );
};
