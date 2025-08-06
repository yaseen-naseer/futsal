import React from 'react';
import { Settings, type LucideIcon } from 'lucide-react';

interface ControlPanelButtonProps {
  onClick: () => void;
  /**
   * Optional icon to display inside the button. Defaults to a settings icon.
   */
  icon?: LucideIcon;
  /**
   * Accessible label for the button. Defaults to "Open control panel".
   */
  ariaLabel?: string;
  /**
   * Additional tailwind classes for positioning. Defaults to `right-20`.
   */
  className?: string;
}

// Floating action button with a customizable icon for navigation
export const ControlPanelButton: React.FC<ControlPanelButtonProps> = ({
  onClick,
  icon: Icon = Settings,
  ariaLabel = 'Open control panel',
  className,
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`fixed top-5 w-12 h-12 rounded-full bg-indigo-600/80 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 backdrop-blur-md transition-colors z-50 ${className ?? 'right-20'}`}
  >
    <Icon className="w-5 h-5" />
  </button>
);

