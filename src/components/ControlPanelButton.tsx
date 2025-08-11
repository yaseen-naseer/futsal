import React from 'react';
import { Settings } from 'lucide-react';

interface ControlPanelButtonProps {
  onClick: () => void;
}

// Floating action button with an icon for a more modern feel
export const ControlPanelButton: React.FC<ControlPanelButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Open scoreboard"
    className="fixed top-5 right-20 w-12 h-12 rounded-full bg-indigo-600/80 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 backdrop-blur-md transition-colors z-50"
  >
    <Settings className="w-5 h-5" />
  </button>
);

