import { useState, useCallback, useRef, useEffect } from 'react';
import {
  createInitialState,
  getEffectiveCPS,
  getClickPower,
  getLuckyChance,
  calculatePrestigeBonus,
  checkMilestoneThreshold,
  ACHIEVEMENT_DEFS,
  UPGRADE_DEFS,
  saveGame,
  loadGame,
  getLastSaveTime,
  formatNumber,
} from '../utils/gameLogic';

export function useGameState(shopCritBonus = 0, shopClickBonus = 0) {
  const [state, setState] = useState(() => {
    const saved = loadGame();
    if (saved) {
      const initial = createInitialState();
      return {
        ...initial,
        score: saved.score ?? 0,
        totalClicks: saved.totalClicks ?? 0,
        totalEarned: saved.totalEarned ?? 0,
        clickPower: saved.clickPower ?? 1,
        critCount: saved.critCount ?? 0,
        totalUpgradesBought: saved.totalUpgradesBought ?? 0,
        unlockedAchievements: saved.unlockedAchievements ?? [],
        newAchievements: saved.newAchievements ?? [],
        upgrades: { ...initial.upgrades, ...(saved.upgrades || {}) },
      };
    }
    return createInitialState();
  });

  // Derived values
  const cps = getEffectiveCPS(state.upgrades);
  const clickPower = getClickPower(state.upgrades, state.clickPower) + shopClickBonus;
  const luckyChance = getLuckyChance(state.upgrades) + shopCritBonus;

  // Notifications
  const [notification, setNotification] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [achieveNotif, setAchieveNotif] = useState(null);

  // Auto-save ref
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(stateRef.current);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Offline earnings on mount
  const offlineAppliedRef = useRef(false);
  useEffect(() => {
    if (offlineAppliedRef.current) return;
    offlineAppliedRef.current = true;
    
    const lastTime = getLastSaveTime();
    if (lastTime) {
      const elapsed = (Date.now() - lastTime) / 1000;
      const currentCps = getEffectiveCPS(stateRef.current.upgrades);
      if (elapsed > 5 && currentCps > 0) {
        const offlineRatio = stateRef.current.upgrades.cosmicTap?.level * 0.1 || 0;
        if (offlineRatio > 0) {
          const earned = currentCps * elapsed * offlineRatio;
          if (earned > 0) {
            setState(prev => ({
              ...prev,
              score: prev.score + earned,
              totalEarned: prev.totalEarned + earned,
            }));
            setNotification({ emoji: '💤', text: `Bem-vindo de volta! Ganhou ${formatNumber(earned)} moedas offline!` });
            // Unlock offline achievement
            setTimeout(() => {
              unlockAchievementById('offline');
            }, 500);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Achievement helpers ----
  const isUnlocked = useCallback((id) => {
    return state.unlockedAchievements?.includes(id) ?? false;
  }, [state.unlockedAchievements]);

  const unlockAchievementById = useCallback((id) => {
    const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
    if (!def) return false;
    setState(prev => {
      if (prev.unlockedAchievements.includes(id)) return prev;
      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id],
        newAchievements: [...prev.newAchievements, id],
      };
    });
    setAchieveNotif(def);
    return true;
  }, []);

  const checkAchievements = useCallback((currentState) => {
    const s = currentState || state;
    for (const def of ACHIEVEMENT_DEFS) {
      if (s.unlockedAchievements.includes(def.id)) continue;
      // CPS achievements need special handling
      if (['cps10', 'cps100', 'cps1k', 'cps10k', 'cps100k'].includes(def.id)) {
        const currentCps = getEffectiveCPS(s.upgrades);
        if ((def.id === 'cps10' && currentCps >= 10) ||
            (def.id === 'cps100' && currentCps >= 100) ||
            (def.id === 'cps1k' && currentCps >= 1000) ||
            (def.id === 'cps10k' && currentCps >= 10000) ||
            (def.id === 'cps100k' && currentCps >= 100000)) {
          const d = ACHIEVEMENT_DEFS.find(a => a.id === def.id);
          if (d) {
            setState(prev => {
              if (prev.unlockedAchievements.includes(def.id)) return prev;
              return {
                ...prev,
                unlockedAchievements: [...prev.unlockedAchievements, def.id],
                newAchievements: [...prev.newAchievements, def.id],
              };
            });
            setAchieveNotif(d);
          }
        }
        continue;
      }
      if (def.condition(s)) {
        setState(prev => {
          if (prev.unlockedAchievements.includes(def.id)) return prev;
          return {
            ...prev,
            unlockedAchievements: [...prev.unlockedAchievements, def.id],
            newAchievements: [...prev.newAchievements, def.id],
          };
        });
        setAchieveNotif(def);
      }
    }
  }, [state]);

  // ---- Click handler ----
  const handleClick = useCallback(() => {
    let value = clickPower;
    let isCrit = false;
    if (luckyChance > 0 && Math.random() * 100 < luckyChance) {
      value *= 2;
      isCrit = true;
    }

    setState(prev => {
      const newState = {
        ...prev,
        score: prev.score + value,
        totalClicks: prev.totalClicks + 1,
        totalEarned: prev.totalEarned + value,
        critCount: isCrit ? prev.critCount + 1 : prev.critCount,
      };
      // Check milestones
      const milestoneHit = checkMilestoneThreshold(newState.totalEarned, prev.lastMilestone);
      if (milestoneHit) {
        newState.lastMilestone = milestoneHit;
        setTimeout(() => setMilestone(milestoneHit), 0);
      }
      return newState;
    });

    // Check achievements after state update
    setTimeout(() => {
      setState(prev => {
        checkAchievements(prev);
        return prev;
      });
    }, 0);

    return { value, isCrit };
  }, [clickPower, luckyChance, checkAchievements]);

  // ---- Buy upgrade ----
  const buyUpgrade = useCallback((id) => {
    setState(prev => {
      const def = UPGRADE_DEFS.find(d => d.id === id);
      if (!def) return prev;
      const upg = prev.upgrades[id];
      const cost = def.getCost(upg.level);
      if (prev.score < cost) return prev;

      const newState = {
        ...prev,
        score: prev.score - cost,
        totalUpgradesBought: prev.totalUpgradesBought + 1,
        upgrades: {
          ...prev.upgrades,
          [id]: { ...upg, level: upg.level + 1 },
        },
      };
      return newState;
    });

    setTimeout(() => {
      setState(prev => {
        checkAchievements(prev);
        return prev;
      });
    }, 0);
  }, [checkAchievements]);

  // ---- Prestige ----
  const doPrestige = useCallback(() => {
    setState(prev => {
      if (prev.totalEarned < 50000) {
        setNotification({ emoji: '⚠️', text: 'Precisa de 50K moedas totais para prestígio!' });
        return prev;
      }
      const bonus = calculatePrestigeBonus(prev.totalEarned);
      if (bonus < 1) {
        setNotification({ emoji: '⚠️', text: 'Acumule mais moedas para prestígio!' });
        return prev;
      }

      const had1b = prev.totalEarned >= 1e9;

      const newState = {
        ...prev,
        clickPower: prev.clickPower + bonus,
        score: 0,
        totalClicks: 0,
        totalEarned: 0,
        lastMilestone: 0,
        upgrades: {
          autoClicker: { level: 0, baseCost: 15 },
          clickMultiplier: { level: 0, baseCost: 50 },
          luckyClover: { level: 0, baseCost: 200 },
          goldenCoin: { level: 0, baseCost: 800 },
          timeWarp: { level: 0, baseCost: 4000 },
          cosmicTap: { level: 0, baseCost: 20000 },
        },
      };

      setNotification({ emoji: '🌟', text: `Prestígio! Bônus permanente: ${bonus}x poder de clique!` });

      // Check prestige achievements
      setTimeout(() => {
        setState(s => {
          checkAchievements(s);
          return s;
        });
      }, 0);

      if (had1b) {
        setTimeout(() => unlockAchievementById('prestigeMax'), 300);
      }

      return newState;
    });
  }, [checkAchievements, unlockAchievementById]);

  // ---- Reset ----
  const doReset = useCallback(() => {
    setState(prev => ({
      ...createInitialState(),
      unlockedAchievements: [],
      newAchievements: [],
    }));
    setNotification({ emoji: '↺', text: 'Progresso reiniciado!' });
    // Reset offline flag so it recalculates after reset
    offlineAppliedRef.current = false;
  }, []);

  // ---- Clear notifications ----
  const clearNotification = useCallback(() => setNotification(null), []);
  const clearMilestone = useCallback(() => setMilestone(null), []);
  const clearAchieveNotif = useCallback(() => setAchieveNotif(null), []);

  // ---- Clear new achievements badge ----
  const clearNewAchievements = useCallback(() => {
    setState(prev => ({ ...prev, newAchievements: [] }));
  }, []);

  // ---- Spend score (for shop) ----
  const spendScore = useCallback((amount) => {
    setState(prev => ({
      ...prev,
      score: Math.max(0, prev.score - amount),
    }));
  }, []);

  // ---- CPS update from auto loop ----
  const addAutoEarnings = useCallback((gain) => {
    setState(prev => {
      const newState = {
        ...prev,
        score: prev.score + gain,
        totalEarned: prev.totalEarned + gain,
      };
      const milestoneHit = checkMilestoneThreshold(newState.totalEarned, prev.lastMilestone);
      if (milestoneHit) {
        newState.lastMilestone = milestoneHit;
        setTimeout(() => setMilestone(milestoneHit), 0);
      }
      return newState;
    });
  }, []);

  return {
    state,
    cps,
    clickPower,
    luckyChance,
    notification,
    milestone,
    achieveNotif,
    handleClick,
    buyUpgrade,
    doPrestige,
    doReset,
    clearNotification,
    clearMilestone,
    clearAchieveNotif,
    clearNewAchievements,
    addAutoEarnings,
    isUnlocked,
    checkAchievements,
    unlockAchievementById,
    spendScore,
  };
}


