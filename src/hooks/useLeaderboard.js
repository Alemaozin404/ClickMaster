import { useState, useCallback, useEffect } from 'react';

const LEADERBOARD_KEY = 'clickmaster_leaderboard';
const MAX_ENTRIES = 10;
const PLAYER_NAME_KEY = 'clickmaster_playername';

export function useLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [playerName, setPlayerName] = useState(() => {
    try { return localStorage.getItem(PLAYER_NAME_KEY) || ''; }
    catch (e) { return ''; }
  });

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch (e) { /* ignore */ }
  }, []);

  const saveEntries = useCallback((newEntries) => {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newEntries));
    } catch (e) { /* ignore */ }
  }, []);

  const savePlayerName = useCallback((name) => {
    setPlayerName(name);
    try { localStorage.setItem(PLAYER_NAME_KEY, name); }
    catch (e) { /* ignore */ }
  }, []);

  // Add a new entry
  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: entry.name || 'Anônimo',
      score: entry.score || 0,
      totalEarned: entry.totalEarned || 0,
      clickPower: entry.clickPower || 1,
      totalClicks: entry.totalClicks || 0,
      upgradesCount: entry.upgradesCount || 0,
      achievementsCount: entry.achievementsCount || 0,
      cps: entry.cps || 0,
      prestigePower: entry.prestigePower || 0,
      date: Date.now(),
    };

    setEntries(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.totalEarned - a.totalEarned)
        .slice(0, MAX_ENTRIES);
      saveEntries(updated);
      return updated;
    });

    // Return rank
    return newEntry;
  }, [saveEntries]);

  // Remove an entry
  const removeEntry = useCallback((id) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveEntries(updated);
      return updated;
    });
  }, [saveEntries]);

  // Clear all entries
  const clearAll = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem(LEADERBOARD_KEY); }
    catch (e) { /* ignore */ }
  }, []);

  // Check if score would make it to top 10
  const wouldRank = useCallback((totalEarned) => {
    if (entries.length < MAX_ENTRIES) return true;
    return totalEarned > entries[entries.length - 1]?.totalEarned;
  }, [entries]);

  // Get rank position for a score
  const getRank = useCallback((totalEarned) => {
    const allScores = [...entries.map(e => e.totalEarned), totalEarned]
      .sort((a, b) => b - a);
    return allScores.indexOf(totalEarned) + 1;
  }, [entries]);

  return {
    entries,
    playerName,
    savePlayerName,
    addEntry,
    removeEntry,
    clearAll,
    wouldRank,
    getRank,
  };
}
