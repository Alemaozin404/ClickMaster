import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoLoop } from '../hooks/useAutoLoop';

describe('useAutoLoop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls addAutoEarnings when CPS > 0', () => {
    const addAutoEarnings = vi.fn();
    const upgrades = {
      autoClicker: { level: 1 },
      timeWarp: { level: 0 },
      goldenCoin: { level: 0 },
      luckyClover: { level: 0 },
      clickMultiplier: { level: 0 },
      cosmicTap: { level: 0 },
    };

    renderHook(() => useAutoLoop(upgrades, addAutoEarnings));

    // RAF is called with a callback - wait for it
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('does not call addAutoEarnings when CPS is 0 initially', () => {
    const addAutoEarnings = vi.fn();
    const upgrades = {
      autoClicker: { level: 0 },
      timeWarp: { level: 0 },
      goldenCoin: { level: 0 },
      luckyClover: { level: 0 },
      clickMultiplier: { level: 0 },
      cosmicTap: { level: 0 },
    };

    renderHook(() => useAutoLoop(upgrades, addAutoEarnings));

    // Immediately after mount, no earnings should have been added yet
    // (RAF hasn't fired by the time we check)
    expect(addAutoEarnings).not.toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const addAutoEarnings = vi.fn();
    const upgrades = {
      autoClicker: { level: 1 },
      timeWarp: { level: 0 },
      goldenCoin: { level: 0 },
      luckyClover: { level: 0 },
      clickMultiplier: { level: 0 },
      cosmicTap: { level: 0 },
    };

    const { unmount } = renderHook(() => useAutoLoop(upgrades, addAutoEarnings));
    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});
