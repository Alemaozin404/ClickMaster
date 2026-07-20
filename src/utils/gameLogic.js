// ---- Upgrade Definitions ----
export const UPGRADE_DEFS = [
  {
    id: 'autoClicker',
    icon: '🤖',
    name: 'Auto Clicker',
    desc: 'Cliques automáticos por segundo',
    getCost: (level) => Math.floor(15 * Math.pow(1.35, level)),
    getEffect: (level) => level,
    formatEffect: (level) => `+${level} moedas/s`,
  },
  {
    id: 'clickMultiplier',
    icon: '🔨',
    name: 'Martelo de Ouro',
    desc: 'Multiplica o poder de clique',
    getCost: (level) => Math.floor(50 * Math.pow(1.5, level)),
    getEffect: (level) => level + 1,
    formatEffect: (level) => `${level + 1}x por clique`,
  },
  {
    id: 'luckyClover',
    icon: '🍀',
    name: 'Trevo da Sorte',
    desc: 'Chance de dobrar moedas nos cliques',
    getCost: (level) => Math.floor(200 * Math.pow(1.6, level)),
    getEffect: (level) => Math.min(5 + level * 3, 50),
    formatEffect: (level) => `${Math.min(5 + level * 3, 50)}% chance de crítico`,
  },
  {
    id: 'goldenCoin',
    icon: '💎',
    name: 'Moeda Dourada',
    desc: 'Bônus de 25% sobre todas as moedas',
    getCost: (level) => Math.floor(800 * Math.pow(1.7, level)),
    getEffect: (level) => 1 + level * 0.25,
    formatEffect: (level) => `+${Math.round(level * 25)}% rendimento`,
  },
  {
    id: 'timeWarp',
    icon: '⏳',
    name: 'Distorção Temporal',
    desc: 'Auto Clicker 2x mais rápido',
    getCost: (level) => Math.floor(4000 * Math.pow(1.8, level)),
    getEffect: (level) => level + 1,
    formatEffect: (level) => `${(level + 1) * 2}x velocidade auto`,
  },
  {
    id: 'cosmicTap',
    icon: '🌌',
    name: 'Toque Cósmico',
    desc: 'Ganha moedas mesmo offline (10% do CPS)',
    getCost: (level) => Math.floor(20000 * Math.pow(1.9, level)),
    getEffect: (level) => level * 0.1,
    formatEffect: (level) => `${Math.round(level * 10)}% CPS offline`,
  },
];

// ---- Achievement Definitions ----
export const ACHIEVEMENT_DEFS = [
  // Cliques
  { id: 'firstClick', icon: '👆', name: 'Primeiro Clique', desc: 'Clique uma vez', condition: (s) => s.totalClicks >= 1 },
  { id: 'click50', icon: '🖱️', name: 'Dedicado', desc: 'Clique 50 vezes', condition: (s) => s.totalClicks >= 50 },
  { id: 'click500', icon: '🤙', name: 'Viciado em Cliques', desc: 'Clique 500 vezes', condition: (s) => s.totalClicks >= 500 },
  { id: 'click5k', icon: '🔥', name: 'Máquina de Cliques', desc: 'Clique 5.000 vezes', condition: (s) => s.totalClicks >= 5000 },
  { id: 'click50k', icon: '⚡', name: 'Lenda dos Cliques', desc: 'Clique 50.000 vezes', condition: (s) => s.totalClicks >= 50000 },
  { id: 'click500k', icon: '💥', name: 'Deus do Clique', desc: 'Clique 500.000 vezes', condition: (s) => s.totalClicks >= 500000 },
  // Ganhos
  { id: 'earn100', icon: '🪙', name: 'Coletor', desc: 'Ganhe 100 moedas no total', condition: (s) => s.totalEarned >= 100 },
  { id: 'earn10k', icon: '💰', name: 'Rico', desc: 'Ganhe 10K moedas no total', condition: (s) => s.totalEarned >= 10000 },
  { id: 'earn1m', icon: '💎', name: 'Milionário', desc: 'Ganhe 1M moedas no total', condition: (s) => s.totalEarned >= 1e6 },
  { id: 'earn1b', icon: '👑', name: 'Bilionário', desc: 'Ganhe 1B moedas no total', condition: (s) => s.totalEarned >= 1e9 },
  { id: 'earn1t', icon: '🌌', name: 'Trilionário', desc: 'Ganhe 1T moedas no total', condition: (s) => s.totalEarned >= 1e12 },
  { id: 'earn1q', icon: '✨', name: 'Quatrilionário', desc: 'Ganhe 1Qd moedas no total', condition: (s) => s.totalEarned >= 1e15 },
  // Melhorias
  { id: 'firstUpgrade', icon: '🔧', name: 'Aprendiz', desc: 'Compre sua primeira melhoria', condition: (s) => s.totalUpgradesBought >= 1 },
  { id: 'upgrade10', icon: '📦', name: 'Colecionador', desc: 'Compre 10 melhorias no total', condition: (s) => s.totalUpgradesBought >= 10 },
  { id: 'upgrade50', icon: '🏗️', name: 'Construtor', desc: 'Compre 50 melhorias no total', condition: (s) => s.totalUpgradesBought >= 50 },
  { id: 'upgrade200', icon: '🏰', name: 'Império', desc: 'Compre 200 melhorias no total', condition: (s) => s.totalUpgradesBought >= 200 },
  {
    id: 'allUpgrades', icon: '🌈', name: 'Completista', desc: 'Compre todas as 6 melhorias pelo menos uma vez',
    condition: (s) => { let count = 0; for (const k of Object.keys(s.upgrades)) { if (s.upgrades[k].level > 0) count++; } return count >= 6; }
  },
  {
    id: 'maxUpgrade', icon: '⭐', name: 'Mestre', desc: 'Chegue ao nível 10 em qualquer melhoria',
    condition: (s) => { for (const k of Object.keys(s.upgrades)) { if (s.upgrades[k].level >= 10) return true; } return false; }
  },
  // CPS
  { id: 'cps10', icon: '🚀', name: 'Automático', desc: 'Atinga 10 CPS', condition: (s) => false }, // computed externally
  { id: 'cps100', icon: '🏎️', name: 'Turbo', desc: 'Atinga 100 CPS', condition: (s) => false },
  { id: 'cps1k', icon: '🛸', name: 'Máquina', desc: 'Atinga 1.000 CPS', condition: (s) => false },
  { id: 'cps10k', icon: '💫', name: 'Deus da Velocidade', desc: 'Atinga 10.000 CPS', condition: (s) => false },
  { id: 'cps100k', icon: '🌀', name: 'Singularidade', desc: 'Atinga 100.000 CPS', condition: (s) => false },
  // Prestígio
  { id: 'firstPrestige', icon: '🌟', name: 'Renascido', desc: 'Faça seu primeiro prestígio', condition: (s) => s.clickPower >= 2 },
  { id: 'prestige3', icon: '🔆', name: 'Lendário', desc: 'Acumule +5 de poder de prestígio', condition: (s) => s.clickPower >= 6 },
  { id: 'prestige10', icon: '🌠', name: 'Imortal', desc: 'Acumule +20 de poder de prestígio', condition: (s) => s.clickPower >= 21 },
  // Crítico
  { id: 'crit10', icon: '🍀', name: 'Sortudo', desc: 'Consiga 10 acertos críticos', condition: (s) => s.critCount >= 10 },
  { id: 'crit100', icon: '☘️', name: 'MUITO Sortudo', desc: 'Consiga 100 acertos críticos', condition: (s) => s.critCount >= 100 },
  { id: 'crit1k', icon: '🎲', name: 'Deus da Sorte', desc: 'Consiga 1.000 acertos críticos', condition: (s) => s.critCount >= 1000 },
  // Especiais (manually triggered)
  { id: 'offline', icon: '💤', name: 'Dorminhoco', desc: 'Ganhe moedas offline', condition: () => false },
  { id: 'prestigeMax', icon: '♾️', name: 'Além do Infinito', desc: 'Faça prestígio com 1B+ moedas acumuladas', condition: () => false },
];

export const MILESTONE_THRESHOLDS = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1e6, 5e6, 1e7, 5e7, 1e8, 1e9];

export const SAVE_KEY = 'clickmaster_save';

// ---- Utility Functions ----
export function formatNumber(n) {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Qd';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export function createInitialState() {
  return {
    score: 0,
    totalClicks: 0,
    totalEarned: 0,
    clickPower: 1,
    critCount: 0,
    totalUpgradesBought: 0,
    unlockedAchievements: [],
    newAchievements: [],
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
}

export function getAutoCPS(upgrades) {
  return upgrades.autoClicker.level;
}

export function getClickMultiplier(upgrades) {
  return upgrades.clickMultiplier.level + 1;
}

export function getLuckyChance(upgrades) {
  return Math.min(5 + upgrades.luckyClover.level * 3, 50);
}

export function getGoldenMultiplier(upgrades) {
  return 1 + upgrades.goldenCoin.level * 0.25;
}

export function getTimeWarpMultiplier(upgrades) {
  return (upgrades.timeWarp.level + 1) * 2;
}

export function getEffectiveCPS(upgrades) {
  const base = getAutoCPS(upgrades);
  const warp = getTimeWarpMultiplier(upgrades);
  const gold = getGoldenMultiplier(upgrades);
  return (base * warp) * gold;
}

export function getClickPower(upgrades, clickPower) {
  const multi = getClickMultiplier(upgrades);
  const gold = getGoldenMultiplier(upgrades);
  return clickPower * multi * gold;
}

export function calculatePrestigeBonus(totalEarned) {
  return Math.floor(Math.sqrt(totalEarned / 50000));
}

export function checkMilestoneThreshold(totalEarned, lastMilestone) {
  for (const t of MILESTONE_THRESHOLDS) {
    if (totalEarned >= t && lastMilestone < t) {
      return t;
    }
  }
  return null;
}

// ---- Save/Load ----
export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    localStorage.setItem(SAVE_KEY + '_time', Date.now().toString());
  } catch (e) { /* ignore */ }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return saved;
  } catch (e) {
    return null;
  }
}

export function getLastSaveTime() {
  const t = localStorage.getItem(SAVE_KEY + '_time');
  return t ? parseInt(t) : null;
}

// ---- Export / Import ----
export function exportSaveData(state, settings) {
  const data = {
    version: 1,
    exportedAt: Date.now(),
    gameName: 'ClickMaster',
    state: state,
    settings: {
      sound: settings?.soundEnabled ?? true,
      music: settings?.musicEnabled ?? true,
      theme: settings?.theme ?? 'dark',
      playerName: settings?.playerName ?? '',
    },
    leaderboard: null,
  };

  // Try to include leaderboard data
  try {
    const lb = localStorage.getItem('clickmaster_leaderboard');
    if (lb) data.leaderboard = JSON.parse(lb);
  } catch (e) { /* ignore */ }

  return data;
}

export function downloadSaveFile(data, filename = 'clickmaster-save.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseSaveFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || !data.gameName || data.gameName !== 'ClickMaster') {
          reject(new Error('Arquivo de save inválido'));
          return;
        }
        if (!data.state) {
          reject(new Error('Arquivo de save corrompido'));
          return;
        }
        resolve(data);
      } catch (err) {
        reject(new Error('Erro ao ler arquivo: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}

export function applyImportedData(data) {
  // Restore game state
  if (data.state) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data.state));
  }

  // Restore leaderboard
  if (data.leaderboard) {
    localStorage.setItem('clickmaster_leaderboard', JSON.stringify(data.leaderboard));
  }

  // Restore settings
  if (data.settings) {
    localStorage.setItem('clickmaster_sound', data.settings.sound ? 'true' : 'false');
    localStorage.setItem('clickmaster_music', data.settings.music ? 'true' : 'false');
    localStorage.setItem('clickmaster_theme', data.settings.theme || 'dark');
    if (data.settings.playerName) {
      localStorage.setItem('clickmaster_playername', data.settings.playerName);
    }
  }

  // Trigger page reload to apply all changes
  window.location.reload();
}
