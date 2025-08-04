import React from 'react';
import { GamePreset } from '../../types';
import { GamePresetSelector } from '../GamePresetSelector';

interface FormatSelectionProps {
  gamePreset: GamePreset;
  changeGamePreset: (presetIndex: number) => void;
}

export const FormatSelection: React.FC<FormatSelectionProps> = ({
  gamePreset,
  changeGamePreset,
}) => {
  return (
    <GamePresetSelector currentPreset={gamePreset} onPresetChange={changeGamePreset} />
  );
};
