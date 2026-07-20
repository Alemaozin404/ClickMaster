import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useSound } from '../hooks/useSound';

describe('useSound', () => {
  beforeEach(() => {
    // Reset localStorage mock store manually
    const store = {};
    localStorage.getItem.mockImplementation((key) => store[key] ?? null);
    localStorage.setItem.mockImplementation((key, value) => { store[key] = value; });
    localStorage.removeItem.mockImplementation((key) => { delete store[key]; });
  });

  afterEach(() => {
    cleanup();
  });

  it('starts with sound and music enabled by default', () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.soundEnabled).toBe(true);
    expect(result.current.musicEnabled).toBe(true);
  });

  it('reads sound preference from localStorage', () => {
    // Set localStorage to disabled before render
    const store = { clickmaster_sound: 'false', clickmaster_music: 'false' };
    localStorage.getItem.mockImplementation((key) => store[key] ?? null);

    const { result } = renderHook(() => useSound());
    expect(result.current.soundEnabled).toBe(false);
    expect(result.current.musicEnabled).toBe(false);
  });

  it('toggles sound on and off', () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.soundEnabled).toBe(true);

    act(() => { result.current.toggleSound(); });
    expect(result.current.soundEnabled).toBe(false);

    act(() => { result.current.toggleSound(); });
    expect(result.current.soundEnabled).toBe(true);
  });

  it('toggles music on and off', () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.musicEnabled).toBe(true);

    act(() => { result.current.toggleMusic(); });
    expect(result.current.musicEnabled).toBe(false);

    act(() => { result.current.toggleMusic(); });
    expect(result.current.musicEnabled).toBe(true);
  });

  it('persists sound setting to localStorage', () => {
    const { result } = renderHook(() => useSound());

    act(() => { result.current.toggleSound(); });
    const callArgs = localStorage.setItem.mock.calls;
    const soundCall = callArgs.find(args => args[0] === 'clickmaster_sound');
    expect(soundCall).toBeDefined();
    expect(soundCall[1]).toBe('false');
  });

  it('persists music setting to localStorage', () => {
    const { result } = renderHook(() => useSound());

    act(() => { result.current.toggleMusic(); });
    const callArgs = localStorage.setItem.mock.calls;
    const musicCall = callArgs.find(args => args[0] === 'clickmaster_music');
    expect(musicCall).toBeDefined();
    expect(musicCall[1]).toBe('false');
  });

  it('provides all sound functions', () => {
    const { result } = renderHook(() => useSound());
    expect(typeof result.current.playClick).toBe('function');
    expect(typeof result.current.playCrit).toBe('function');
    expect(typeof result.current.playUpgrade).toBe('function');
    expect(typeof result.current.playAchievement).toBe('function');
    expect(typeof result.current.playMilestone).toBe('function');
    expect(typeof result.current.playPrestige).toBe('function');
  });

  it('play functions do not throw when sound is disabled', () => {
    const { result } = renderHook(() => useSound());

    act(() => { result.current.toggleSound(); });

    expect(() => {
      result.current.playClick();
      result.current.playCrit();
      result.current.playUpgrade();
      result.current.playAchievement();
      result.current.playMilestone();
      result.current.playPrestige();
    }).not.toThrow();
  });

  it('play functions do not throw when sound is enabled', () => {
    const { result } = renderHook(() => useSound());

    expect(() => {
      result.current.playClick();
      result.current.playCrit();
      result.current.playUpgrade();
      result.current.playAchievement();
      result.current.playMilestone();
      result.current.playPrestige();
    }).not.toThrow();
  });
});
