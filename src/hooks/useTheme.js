import { useState, useCallback, useEffect } from 'react';

const THEMES = [
  { id: 'dark', icon: '🌙', name: 'Noturno' },
  { id: 'light', icon: '☀️', name: 'Claro' },
  { id: 'aurora', icon: '🌈', name: 'Aurora' },
  { id: 'auto', icon: '🖥️', name: 'Automático' },
];

const THEME_KEY = 'clickmaster_theme';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved && THEMES.find(t => t.id === saved)) return saved;
    } catch (e) { /* ignore */ }
    return 'auto';
  });

  // Track system preference for auto mode
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Listen for system theme changes
  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const handler = (e) => setSystemTheme(e.matches ? 'light' : 'dark');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch {
      return undefined;
    }
  }, []);

  // Effective theme (resolved from auto)
  const effectiveTheme = theme === 'auto' ? systemTheme : theme;

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];
  const nextTheme = THEMES[(THEMES.findIndex(t => t.id === theme) + 1) % THEMES.length];

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const currentIdx = THEMES.findIndex(t => t.id === prev);
      const next = THEMES[(currentIdx + 1) % THEMES.length].id;
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
      return next;
    });
  }, []);

  // Apply effective theme class to document body
  useEffect(() => {
    // Remove all theme classes
    THEMES.forEach(t => document.body.classList.remove(`theme-${t.id}`));
    // Add resolved theme class
    document.body.classList.add(`theme-${effectiveTheme}`);
    // Also add transition class for smooth change
    document.body.classList.add('theme-transitioning');
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 600);
    return () => clearTimeout(timer);
  }, [effectiveTheme]);

  return {
    theme,
    effectiveTheme,
    currentTheme,
    nextTheme,
    THEMES,
    toggleTheme,
    isAuto: theme === 'auto',
  };
}

export { THEMES };
