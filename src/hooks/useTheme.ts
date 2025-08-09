import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Simple hook to manage application theme.
 * Persists selection in localStorage and toggles the `dark` class
 * on the document's root element so Tailwind's dark mode classes work.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Allow theme to be specified via ?theme=dark|light in the URL
        const params = new URLSearchParams(window.location.search);
        const paramTheme = params.get('theme') as Theme | null;
        if (paramTheme === 'dark' || paramTheme === 'light') {
          return paramTheme;
        }

        const stored = window.localStorage.getItem('theme') as Theme | null;
        if (stored === 'dark' || stored === 'light') {
          return stored;
        }
      } catch {
        /* ignore */
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('theme', theme);
      } catch {
        /* ignore */
      }
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}

