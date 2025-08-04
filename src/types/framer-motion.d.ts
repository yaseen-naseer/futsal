declare module 'framer-motion' {
  import * as React from 'react';

  export const motion: {
    div: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  };

  export const AnimatePresence: React.FC<{ children?: React.ReactNode }>;

  export function useReducedMotion(): boolean;
}

