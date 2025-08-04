import React from 'react';
import { GamePreset } from '../../types';
import { GamePresetSelector } from '../GamePresetSelector';

interface FormatTabProps {
  currentPreset: GamePreset;
  onPresetChange: (presetIndex: number) => void;
}

export const FormatTab: React.FC<FormatTabProps> = ({ currentPreset, onPresetChange }) => (
  <GamePresetSelector currentPreset={currentPreset} onPresetChange={onPresetChange} />
);

