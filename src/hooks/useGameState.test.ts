import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGameState } from './useGameState';

describe('useGameState message handling', () => {
  it('ignores invalid messages without throwing', () => {
    const { result, unmount } = renderHook(() => useGameState());

    const invalidMessages = [
      'string',
      { foo: 'bar' },
      { type: 'UNKNOWN', action: 'START' },
      { type: 'TIMER_CONTROL', action: 'UNKNOWN' },
    ];

    invalidMessages.forEach(data => {
      expect(() => {
        window.dispatchEvent(
          new MessageEvent('message', { data, origin: window.location.origin })
        );
      }).not.toThrow();
      expect(result.current.gameState.isRunning).toBe(false);
    });

    unmount();
  });
});

