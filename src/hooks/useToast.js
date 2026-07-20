import { useState, useCallback, useRef, useEffect } from 'react';

let toastIdCounter = 0;

const TOAST_TYPES = {
  success: { icon: '✅', color: '#00b894' },
  info: { icon: 'ℹ️', color: '#4fc3f7' },
  warning: { icon: '⚠️', color: '#feca57' },
  error: { icon: '❌', color: '#ff6b6b' },
  achievement: { icon: '🏆', color: '#ffd86f' },
  milestone: { icon: '🎉', color: '#a78bfa' },
  prestige: { icon: '🌟', color: '#ff9ff3' },
  shop: { icon: '🛒', color: '#00b894' },
};

const DEFAULT_DURATION = 3000;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const removeToast = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((emoji, text, type = 'info', duration = DEFAULT_DURATION) => {
    const id = ++toastIdCounter;
    const typeConfig = TOAST_TYPES[type] || TOAST_TYPES.info;

    const toast = {
      id,
      emoji: emoji || typeConfig.icon,
      text,
      type,
      color: typeConfig.color,
      icon: typeConfig.icon,
      createdAt: Date.now(),
    };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const showSuccess = useCallback((text, duration) =>
    addToast(null, text, 'success', duration), [addToast]);

  const showInfo = useCallback((text, duration) =>
    addToast(null, text, 'info', duration), [addToast]);

  const showWarning = useCallback((text, duration) =>
    addToast(null, text, 'warning', duration), [addToast]);

  const showError = useCallback((text, duration) =>
    addToast(null, text, 'error', duration), [addToast]);

  const showAchievement = useCallback((text, duration) =>
    addToast(null, text, 'achievement', duration || 4000), [addToast]);

  const showMilestone = useCallback((text, duration) =>
    addToast(null, text, 'milestone', duration || 3000), [addToast]);

  const showPrestige = useCallback((text, duration) =>
    addToast(null, text, 'prestige', duration || 4000), [addToast]);

  const showShop = useCallback((text, duration) =>
    addToast(null, text, 'shop', duration), [addToast]);

  const clearAll = useCallback(() => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showAchievement,
    showMilestone,
    showPrestige,
    showShop,
  };
}
