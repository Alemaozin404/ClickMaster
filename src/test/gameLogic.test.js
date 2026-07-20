import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  createInitialState,
  getEffectiveCPS,
  getClickPower,
  getClickMultiplier,
  getLuckyChance,
  getGoldenMultiplier,
  getTimeWarpMultiplier,
  calculatePrestigeBonus,
  checkMilestoneThreshold,
  UPGRADE_DEFS,
  ACHIEVEMENT_DEFS,
  MILESTONE_THRESHOLDS,
} from '../utils/gameLogic';

describe('formatNumber', () => {
  it('formats numbers below 1000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(5)).toBe('5');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(9999)).toBe('10.0K');
  });

  it('formats millions with M suffix', () => {
    expect(formatNumber(1_000_000)).toBe('1.00M');
    expect(formatNumber(1_500_000)).toBe('1.50M');
    expect(formatNumber(999_999_999)).toBe('1000.00M');
  });

  it('formats billions with B suffix', () => {
    expect(formatNumber(1_000_000_000)).toBe('1.00B');
    expect(formatNumber(1_500_000_000)).toBe('1.50B');
  });

  it('formats trillions with T suffix', () => {
    expect(formatNumber(1_000_000_000_000)).toBe('1.00T');
  });

  it('formats quadrillions with Qd suffix', () => {
    expect(formatNumber(1_000_000_000_000_000)).toBe('1.00Qd');
  });

  it('handles decimal values correctly', () => {
    expect(formatNumber(1234)).toBe('1.2K');
    expect(formatNumber(12_345)).toBe('12.3K');
    expect(formatNumber(123_456)).toBe('123.5K');
  });
});

describe('createInitialState', () => {
  it('creates a valid initial state', () => {
    const state = createInitialState();
    expect(state.score).toBe(0);
    expect(state.totalClicks).toBe(0);
    expect(state.totalEarned).toBe(0);
    expect(state.clickPower).toBe(1);
    expect(state.critCount).toBe(0);
    expect(state.totalUpgradesBought).toBe(0);
    expect(state.unlockedAchievements).toEqual([]);
    expect(state.newAchievements).toEqual([]);
    expect(state.lastMilestone).toBe(0);
  });

  it('has all 6 upgrades with level 0', () => {
    const state = createInitialState();
    const upgradeKeys = Object.keys(state.upgrades);
    expect(upgradeKeys).toHaveLength(6);
    upgradeKeys.forEach(key => {
      expect(state.upgrades[key].level).toBe(0);
      expect(state.upgrades[key].baseCost).toBeGreaterThan(0);
    });
  });
});

describe('getEffectiveCPS', () => {
  it('returns 0 when no auto clicker', () => {
    const upgrades = { autoClicker: { level: 0 }, timeWarp: { level: 0 }, goldenCoin: { level: 0 } };
    expect(getEffectiveCPS(upgrades)).toBe(0);
  });

  it('calculates base CPS from auto clicker level', () => {
    const upgrades = { autoClicker: { level: 1 }, timeWarp: { level: 0 }, goldenCoin: { level: 0 } };
    // 1 * 2 * 1 = 2
    expect(getEffectiveCPS(upgrades)).toBe(2);
  });

  it('applies time warp multiplier', () => {
    const upgrades = { autoClicker: { level: 1 }, timeWarp: { level: 1 }, goldenCoin: { level: 0 } };
    // 1 * (2 * 2) * 1 = 4
    expect(getEffectiveCPS(upgrades)).toBe(4);
  });

  it('applies golden coin multiplier', () => {
    const upgrades = { autoClicker: { level: 2 }, timeWarp: { level: 0 }, goldenCoin: { level: 1 } };
    // 2 * 2 * 1.25 = 5
    expect(getEffectiveCPS(upgrades)).toBe(5);
  });
});

describe('getClickPower', () => {
  it('returns base click power with no upgrades', () => {
    const upgrades = { clickMultiplier: { level: 0 }, goldenCoin: { level: 0 } };
    expect(getClickPower(upgrades, 1)).toBe(1);
  });

  it('applies click multiplier', () => {
    const upgrades = { clickMultiplier: { level: 2 }, goldenCoin: { level: 0 } };
    // 3 * 1 = 3
    expect(getClickPower(upgrades, 1)).toBe(3);
  });

  it('applies golden coin bonus', () => {
    const upgrades = { clickMultiplier: { level: 1 }, goldenCoin: { level: 2 } };
    // 2 * 1.5 = 3
    expect(getClickPower(upgrades, 1)).toBe(3);
  });

  it('respects prestige power', () => {
    const upgrades = { clickMultiplier: { level: 1 }, goldenCoin: { level: 0 } };
    expect(getClickPower(upgrades, 5)).toBe(10);
  });
});

describe('getLuckyChance', () => {
  it('returns 5% with no lucky clover', () => {
    expect(getLuckyChance({ luckyClover: { level: 0 } })).toBe(5);
  });

  it('scales with lucky clover level', () => {
    expect(getLuckyChance({ luckyClover: { level: 1 } })).toBe(8);
    expect(getLuckyChance({ luckyClover: { level: 5 } })).toBe(20);
  });

  it('caps at 50%', () => {
    expect(getLuckyChance({ luckyClover: { level: 20 } })).toBe(50);
  });
});

describe('getClickMultiplier', () => {
  it('returns level + 1', () => {
    expect(getClickMultiplier({ clickMultiplier: { level: 0 } })).toBe(1);
    expect(getClickMultiplier({ clickMultiplier: { level: 5 } })).toBe(6);
  });
});

describe('getGoldenMultiplier', () => {
  it('returns 1 + 0.25 per level', () => {
    expect(getGoldenMultiplier({ goldenCoin: { level: 0 } })).toBe(1);
    expect(getGoldenMultiplier({ goldenCoin: { level: 2 } })).toBe(1.5);
    expect(getGoldenMultiplier({ goldenCoin: { level: 4 } })).toBe(2);
  });
});

describe('getTimeWarpMultiplier', () => {
  it('returns (level + 1) * 2', () => {
    expect(getTimeWarpMultiplier({ timeWarp: { level: 0 } })).toBe(2);
    expect(getTimeWarpMultiplier({ timeWarp: { level: 1 } })).toBe(4);
    expect(getTimeWarpMultiplier({ timeWarp: { level: 3 } })).toBe(8);
  });
});

describe('calculatePrestigeBonus', () => {
  it('returns 0 for less than 50K', () => {
    expect(calculatePrestigeBonus(10000)).toBe(0);
  });

  it('returns 1 for 50K', () => {
    expect(calculatePrestigeBonus(50000)).toBe(1);
  });

  it('returns floor(sqrt(earned/50000))', () => {
    expect(calculatePrestigeBonus(200000)).toBe(2);
    expect(calculatePrestigeBonus(450000)).toBe(3);
    expect(calculatePrestigeBonus(5000000)).toBe(10);
  });
});

describe('checkMilestoneThreshold', () => {
  it('returns null when no milestone reached', () => {
    expect(checkMilestoneThreshold(5, 0)).toBeNull();
  });

  it('returns the first milestone when threshold crossed', () => {
    expect(checkMilestoneThreshold(100, 0)).toBe(10);
    expect(checkMilestoneThreshold(1000, 0)).toBe(10);
    expect(checkMilestoneThreshold(100, 50)).toBe(100);
    expect(checkMilestoneThreshold(1000, 500)).toBe(1000);
  });

  it('returns null if milestone already passed', () => {
    expect(checkMilestoneThreshold(10, 10)).toBeNull();
    expect(checkMilestoneThreshold(50, 50)).toBeNull();
    expect(checkMilestoneThreshold(100, 100)).toBeNull();
  });

  it('returns the first new milestone only', () => {
    expect(checkMilestoneThreshold(150, 0)).toBe(10);
    expect(checkMilestoneThreshold(150, 10)).toBe(50);
  });

  it('returns higher milestones when big numbers', () => {
    expect(checkMilestoneThreshold(100000, 50000)).toBe(100000);
    expect(checkMilestoneThreshold(1000000, 500000)).toBe(1000000);
  });
});

describe('UPGRADE_DEFS', () => {
  it('has 6 upgrades with all required fields', () => {
    expect(UPGRADE_DEFS).toHaveLength(6);
    UPGRADE_DEFS.forEach(def => {
      expect(def.id).toBeDefined();
      expect(def.icon).toBeDefined();
      expect(def.name).toBeDefined();
      expect(typeof def.getCost).toBe('function');
      expect(typeof def.getEffect).toBe('function');
      expect(typeof def.formatEffect).toBe('function');
    });
  });

  it('has increasing costs', () => {
    UPGRADE_DEFS.forEach(def => {
      const cost1 = def.getCost(0);
      const cost2 = def.getCost(1);
      const cost3 = def.getCost(2);
      expect(cost2).toBeGreaterThan(cost1);
      expect(cost3).toBeGreaterThan(cost2);
    });
  });

  it('autoClicker cost starts at 15', () => {
    const auto = UPGRADE_DEFS.find(d => d.id === 'autoClicker');
    expect(auto.getCost(0)).toBe(15);
  });

  it('cosmicTap cost starts at 20000', () => {
    const cosmic = UPGRADE_DEFS.find(d => d.id === 'cosmicTap');
    expect(cosmic.getCost(0)).toBe(20000);
  });
});

describe('ACHIEVEMENT_DEFS', () => {
  it('has 31 achievements with all required fields', () => {
    expect(ACHIEVEMENT_DEFS).toHaveLength(31);
    ACHIEVEMENT_DEFS.forEach(def => {
      expect(def.id).toBeDefined();
      expect(def.icon).toBeDefined();
      expect(def.name).toBeDefined();
      expect(def.desc).toBeDefined();
      expect(typeof def.condition).toBe('function');
    });
  });

  it('has unique IDs', () => {
    const ids = ACHIEVEMENT_DEFS.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('firstClick achievement triggers at 1 click', () => {
    const ach = ACHIEVEMENT_DEFS.find(d => d.id === 'firstClick');
    expect(ach.condition({ totalClicks: 1 })).toBe(true);
    expect(ach.condition({ totalClicks: 0 })).toBe(false);
  });

  it('click500k achievement triggers at 500k clicks', () => {
    const ach = ACHIEVEMENT_DEFS.find(d => d.id === 'click500k');
    expect(ach.condition({ totalClicks: 500000 })).toBe(true);
    expect(ach.condition({ totalClicks: 499999 })).toBe(false);
  });

  it('milestone-like achievements trigger correctly', () => {
    const earn1m = ACHIEVEMENT_DEFS.find(d => d.id === 'earn1m');
    expect(earn1m.condition({ totalEarned: 1_000_000 })).toBe(true);
    expect(earn1m.condition({ totalEarned: 999_999 })).toBe(false);

    const upgrade10 = ACHIEVEMENT_DEFS.find(d => d.id === 'upgrade10');
    expect(upgrade10.condition({ totalUpgradesBought: 10 })).toBe(true);
    expect(upgrade10.condition({ totalUpgradesBought: 9 })).toBe(false);
  });

  it('special achievements have false conditions', () => {
    const offline = ACHIEVEMENT_DEFS.find(d => d.id === 'offline');
    const prestigeMax = ACHIEVEMENT_DEFS.find(d => d.id === 'prestigeMax');
    const cpsAchievements = ACHIEVEMENT_DEFS.filter(d => d.id.startsWith('cps'));
    expect(offline.condition()).toBe(false);
    expect(prestigeMax.condition()).toBe(false);
    cpsAchievements.forEach(a => expect(a.condition()).toBe(false));
  });
});

describe('MILESTONE_THRESHOLDS', () => {
  it('has 16 milestones', () => {
    expect(MILESTONE_THRESHOLDS).toHaveLength(16);
  });

  it('starts at 10 and ends at 1e9', () => {
    expect(MILESTONE_THRESHOLDS[0]).toBe(10);
    expect(MILESTONE_THRESHOLDS[MILESTONE_THRESHOLDS.length - 1]).toBe(1_000_000_000);
  });

  it('is sorted ascending', () => {
    for (let i = 1; i < MILESTONE_THRESHOLDS.length; i++) {
      expect(MILESTONE_THRESHOLDS[i]).toBeGreaterThan(MILESTONE_THRESHOLDS[i - 1]);
    }
  });
});
