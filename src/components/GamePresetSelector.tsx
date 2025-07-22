import React from 'react';
import { GamePreset } from '../types';
import { GAME_PRESETS } from '../utils/gamePresets';
import { Clock, Trophy, Target, Settings } from 'lucide-react';

interface GamePresetSelectorProps {
  currentPreset: GamePreset;
  onPresetChange: (presetIndex: number) => void;
}

export const GamePresetSelector: React.FC<GamePresetSelectorProps> = ({
  currentPreset,
  onPresetChange,
}) => {
  const getPresetIcon = (preset: GamePreset) => {
    if (preset.format === 'knockout') return Trophy;
    if (preset.format === 'penalty-shootout') return Target;
    return Clock;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" />
        Game Format
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAME_PRESETS.map((preset, index) => {
          const Icon = getPresetIcon(preset);
          const isSelected = currentPreset.name === preset.name;
          
          return (
            <button
              key={index}
              onClick={() => onPresetChange(index)}
              className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{preset.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{preset.description}</p>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{preset.halfDuration * 2} min</span>
                    </div>
                    {preset.hasExtraTime && (
                      <div className="flex justify-between">
                        <span>Extra Time:</span>
                        <span className="font-medium">{preset.extraTimeDuration * 2} min</span>
                      </div>
                    )}
                    {preset.hasPenalties && (
                      <div className="flex justify-between">
                        <span>Penalties:</span>
                        <span className="font-medium text-green-600">Yes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Current Format: {currentPreset.name}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <span className="text-blue-600">Half Duration:</span> {currentPreset.halfDuration} minutes
          </div>
          <div>
            <span className="text-blue-600">Format:</span> {currentPreset.format}
          </div>
          {currentPreset.hasExtraTime && (
            <div>
              <span className="text-blue-600">Extra Time:</span> {currentPreset.extraTimeDuration} min halves
            </div>
          )}
          {currentPreset.hasPenalties && (
            <div>
              <span className="text-blue-600">Penalties:</span> Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};