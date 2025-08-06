import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

/**
 * Floating button to toggle between light and dark themes.
 * Appears in the top right corner on every screen.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label="Toggle dark mode"
    className="fixed top-5 right-5 z-50 rounded-full p-2 bg-gray-200 text-gray-800 shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
  >
    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

