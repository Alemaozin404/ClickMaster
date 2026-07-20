import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeaderboard } from '../hooks/useLeaderboard';

describe('useLeaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty entries', () => {
    const { result } = renderHook(() => useLeaderboard());
    expect(result.current.entries).toEqual([]);
    expect(result.current.playerName).toBe('');
  });

  it('adds an entry to the leaderboard', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry({
        name: 'TestPlayer',
        score: 1000,
        totalEarned: 50000,
        clickPower: 2,
        totalClicks: 500,
        upgradesCount: 5,
        achievementsCount: 3,
        cps: 10,
        prestigePower: 1,
      });
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].name).toBe('TestPlayer');
    expect(result.current.entries[0].totalEarned).toBe(50000);
    expect(result.current.entries[0].id).toBeDefined();
    expect(result.current.entries[0].date).toBeDefined();
  });

  it('sorts entries by totalEarned descending', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry({ name: 'Player1', totalEarned: 10000 });
      result.current.addEntry({ name: 'Player2', totalEarned: 50000 });
      result.current.addEntry({ name: 'Player3', totalEarned: 25000 });
    });

    expect(result.current.entries).toHaveLength(3);
    expect(result.current.entries[0].name).toBe('Player2');
    expect(result.current.entries[1].name).toBe('Player3');
    expect(result.current.entries[2].name).toBe('Player1');
  });

  it('caps at 10 entries', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.addEntry({ name: `Player${i}`, totalEarned: i * 1000 });
      }
    });

    expect(result.current.entries).toHaveLength(10);
    // Lowest score (0) should be dropped
    const names = result.current.entries.map(e => e.name);
    expect(names).not.toContain('Player0');
  });

  it('removes an entry by id', () => {
    const { result } = renderHook(() => useLeaderboard());
    let entryId;

    act(() => {
      const entry = result.current.addEntry({ name: 'Removable', totalEarned: 50000 });
      entryId = entry.id;
    });

    expect(result.current.entries).toHaveLength(1);

    act(() => {
      result.current.removeEntry(entryId);
    });

    expect(result.current.entries).toHaveLength(0);
  });

  it('clears all entries', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry({ name: 'Player1', totalEarned: 1000 });
      result.current.addEntry({ name: 'Player2', totalEarned: 2000 });
    });

    expect(result.current.entries).toHaveLength(2);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.entries).toHaveLength(0);
  });

  it('persists player name to localStorage', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.savePlayerName('Gamer123');
    });

    expect(result.current.playerName).toBe('Gamer123');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      expect.stringContaining('playername'),
      'Gamer123'
    );
  });

  it('loads player name from localStorage on mount', () => {
    localStorage.getItem.mockReturnValueOnce('SavedName');

    const { result } = renderHook(() => useLeaderboard());
    expect(result.current.playerName).toBe('SavedName');
  });

  it('wouldRank returns true when fewer than 10 entries', () => {
    const { result } = renderHook(() => useLeaderboard());
    expect(result.current.wouldRank(100)).toBe(true);
  });

  it('wouldRank returns true if score beats lowest', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.addEntry({ name: `P${i}`, totalEarned: (i + 1) * 1000 });
      }
    });

    expect(result.current.wouldRank(5001)).toBe(true);
    expect(result.current.wouldRank(500)).toBe(false);
  });

  it('provides default name when not provided', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry({ score: 100, totalEarned: 50000 });
    });

    expect(result.current.entries[0].name).toBe('Anônimo');
  });
});
