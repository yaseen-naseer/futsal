import React from 'react';

interface ControlPanelButtonProps {
  onClick: () => void;
}

export const ControlPanelButton: React.FC<ControlPanelButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm z-50"
  >
    Control Panel
  </button>
);

