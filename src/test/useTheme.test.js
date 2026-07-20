import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useTheme } from '../hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    // Mock matchMedia to default to dark mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: light)' ? false : true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('starts with auto theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('auto');
    expect(result.current.isAuto).toBe(true);
  });

  it('effectiveTheme follows system preference', () => {
    const { result } = renderHook(() => useTheme());
    // Mocked matchMedia returns dark (prefers-color-scheme: light = false)
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('loads saved theme from localStorage', () => {
    localStorage.getItem = vi.fn().mockReturnValue('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.isAuto).toBe(false);
  });

  it('falls back to auto when localStorage has invalid theme', () => {
    localStorage.getItem = vi.fn().mockReturnValue('invalid_theme');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('auto');
  });

  it('toggles through themes in order: auto -> dark -> light -> aurora -> auto', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('auto');

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe('dark');

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe('light');

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe('aurora');

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe('auto');
  });

  it('saves theme to localStorage on toggle', () => {
    const { result } = renderHook(() => useTheme());

    act(() => { result.current.toggleTheme(); });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      expect.stringContaining('theme'),
      'dark'
    );
  });

  it('sets nextTheme correctly', () => {
    const { result } = renderHook(() => useTheme());
    // From auto, next should be dark
    expect(result.current.nextTheme.id).toBe('dark');

    act(() => { result.current.toggleTheme(); });
    // From dark, next should be light
    expect(result.current.nextTheme.id).toBe('light');

    act(() => { result.current.toggleTheme(); });
    // From light, next should be aurora
    expect(result.current.nextTheme.id).toBe('aurora');

    act(() => { result.current.toggleTheme(); });
    // From aurora, next should be auto
    expect(result.current.nextTheme.id).toBe('auto');
  });

  it('applies effective theme class to body', () => {
    const { result } = renderHook(() => useTheme());

    // Initial auto -> system is dark
    expect(document.body.className).toContain('theme-dark');

    act(() => { result.current.toggleTheme(); });
    expect(document.body.className).toContain('theme-dark');
    expect(document.body.className).not.toContain('theme-light');

    act(() => { result.current.toggleTheme(); });
    expect(document.body.className).toContain('theme-light');
    expect(document.body.className).not.toContain('theme-dark');

    act(() => { result.current.toggleTheme(); });
    expect(document.body.className).toContain('theme-aurora');
    expect(document.body.className).not.toContain('theme-light');
  });

  it('exports THEMES array with 4 themes', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.THEMES).toHaveLength(4);
    expect(result.current.THEMES[0].id).toBe('dark');
    expect(result.current.THEMES[1].id).toBe('light');
    expect(result.current.THEMES[2].id).toBe('aurora');
    expect(result.current.THEMES[3].id).toBe('auto');
  });

  it('isAuto reflects the current theme mode', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isAuto).toBe(true);

    act(() => { result.current.toggleTheme(); });
    expect(result.current.isAuto).toBe(false);
  });
});
