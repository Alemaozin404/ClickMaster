import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { useAutoLoop } from './hooks/useAutoLoop';
import { useSound } from './hooks/useSound';
import { useTheme } from './hooks/useTheme';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useShop } from './hooks/useShop';
import { useToast } from './hooks/useToast';
import { formatNumber, ACHIEVEMENT_DEFS, UPGRADE_DEFS, exportSaveData, downloadSaveFile, parseSaveFile, applyImportedData } from './utils/gameLogic';

import ScoreDisplay from './components/ScoreDisplay';
import ProgressBar from './components/ProgressBar';
import UpgradesList from './components/UpgradesList';
import AchievementsPanel from './components/AchievementsPanel';
import AchievementNotification from './components/AchievementNotification';
import MilestoneNotification from './components/MilestoneNotification';
import LeaderboardPanel from './components/LeaderboardPanel';
import ShopPanel from './components/ShopPanel';
import ParticleCanvas from './components/ParticleCanvas';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// ---- Fullscreen API utility ----
function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// ---- Prevent default touch behaviors ----
function preventTouchDefault(e) {
  if (e.cancelable) e.preventDefault();
}

const PARTICLE_COLORS = {
  gold: 'rgba(255,215,0,1)',
  fire: 'rgba(255,100,0,1)',
  ice: 'rgba(100,200,255,1)',
  neon: 'rgba(200,0,255,1)',
  rainbow: null,
};

export default function App() {
  // Theme
  const { theme, currentTheme, toggleTheme, isAuto } = useTheme();

  // Leaderboard
  const {
    entries: lbEntries,
    playerName,
    savePlayerName,
    addEntry,
    removeEntry,
    clearAll,
  } = useLeaderboard();

  // Leaderboard panel
  const [lbPanelOpen, setLbPanelOpen] = useState(false);

  // Shop (must be before useGameState because of shop bonuses)
  const {
    shopItems,
    purchasedItems,
    equippedItems,
    activeEffects,
    isPurchased,
    isEquipped,
    buyItem,
    toggleEquip,
    getItemTierColor,
    equippedBadge,
  } = useShop();

  const [shopPanelOpen, setShopPanelOpen] = useState(false);

  // Apply shop bonuses to game state (declared BEFORE useGameState uses them)
  const shopCritBonus = activeEffects.critBonus || 0;
  const shopClickBonus = activeEffects.clickBonus || 0;

  // Game state — now shopCritBonus and shopClickBonus are defined
  const {
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
    spendScore,
  } = useGameState(shopCritBonus, shopClickBonus);

  // Toast system
  const {
    toasts,
    removeToast,
    addToast,
    showSuccess,
    showWarning,
    showError,
    showShop,
  } = useToast();

  // Sound
  const {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    playClick,
    playCrit,
    playUpgrade,
    playAchievement,
    playMilestone,
    playPrestige,
  } = useSound();

  // ---- Orientation State ----
  const [isLandscape, setIsLandscape] = useState(() => {
    try {
      return window.matchMedia('(orientation: landscape)').matches;
    } catch { return false; }
  });

  useEffect(() => {
    try {
      const mq = window.matchMedia('(orientation: landscape)');
      const handler = (e) => setIsLandscape(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch { return undefined; }
  }, []);

  // ---- Fullscreen State ----
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  // Play milestone sound
  useEffect(() => {
    if (milestone !== null) {
      playMilestone();
    }
  }, [milestone, playMilestone]);

  // Play achievement sound
  useEffect(() => {
    if (achieveNotif !== null) {
      playAchievement();
    }
  }, [achieveNotif, playAchievement]);

  // Auto loop
  useAutoLoop(state.upgrades, addAutoEarnings);

  // Floating numbers
  const [floaters, setFloaters] = useState([]);
  const clickAreaRef = useRef(null);
  const floatIdRef = useRef(0);

  const spawnFloatingNumber = useCallback((value, isCrit) => {
    const id = floatIdRef.current++;
    const btn = clickAreaRef.current?.querySelector('.click-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const areaRect = clickAreaRef.current.getBoundingClientRect();
    const x = rect.left - areaRect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
    const y = rect.top - areaRect.top + 20 + (Math.random() - 0.5) * 40;
    const color = isCrit ? '#ffd86f' : '#4fc3f7';
    setFloaters(prev => [...prev, { id, x, y, value, isCrit, color }]);
    setTimeout(() => {
      setFloaters(prev => prev.filter(f => f.id !== id));
    }, 1200);
  }, []);

  // Particle system
  const particleRef = useRef(null);

  const onParticleReady = useCallback((api) => {
    particleRef.current = api;
  }, []);

  const getParticlePos = useCallback(() => {
    const btn = clickAreaRef.current?.querySelector('.click-btn');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  // ---- Click handler with touch support ----
  const [isPressed, setIsPressed] = useState(false);

  const onMainClick = useCallback((event) => {
    let clickValue = clickPower;
    let isCrit = false;
    if (luckyChance > 0 && Math.random() * 100 < luckyChance) {
      clickValue *= 2;
      isCrit = true;
    }

    handleClick();

    // Sounds
    if (isCrit) {
      playCrit();
    } else {
      playClick();
    }

    // Floating number text
    spawnFloatingNumber(clickValue, isCrit);

    // Particle effects
    const pos = getParticlePos();
    if (pos && particleRef.current) {
      if (isCrit) {
        particleRef.current.spawnCrit(pos.x, pos.y);
      } else {
        let clickColor = '#4fc3f7';
        if (activeEffects.color) {
          const shopColor = PARTICLE_COLORS[activeEffects.color];
          if (shopColor) clickColor = shopColor;
          else if (activeEffects.color === 'rainbow') {
            const hue = (Date.now() / 50) % 360;
            clickColor = `hsla(${hue}, 100%, 60%, 1)`;
          }
        }
        particleRef.current.spawnClick(pos.x, pos.y, clickColor, activeEffects.trail);
      }
    }
  }, [clickPower, luckyChance, handleClick, spawnFloatingNumber, getParticlePos, playClick, playCrit, activeEffects]);

  // Prevent context menu on long press
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Particle effects for game events
  useEffect(() => {
    if (milestone !== null && particleRef.current) {
      particleRef.current.spawnMilestone();
    }
  }, [milestone]);

  useEffect(() => {
    if (achieveNotif !== null && particleRef.current) {
      particleRef.current.spawnAchievement();
    }
  }, [achieveNotif]);

  // Achievements panel
  const [achPanelOpen, setAchPanelOpen] = useState(false);

  const handleOpenAchievements = useCallback(() => {
    clearNewAchievements();
    setAchPanelOpen(true);
  }, [clearNewAchievements]);

  // Route game notifications to toast
  useEffect(() => {
    if (!notification) return;
    addToast(notification.emoji, notification.text, 'info', 3500);
    setTimeout(clearNotification, 100);
  }, [notification, addToast, clearNotification]);

  const handleExportSave = useCallback(() => {
    const settings = {
      soundEnabled,
      musicEnabled,
      theme,
      playerName,
    };
    const data = exportSaveData(state, settings);
    const date = new Date().toISOString().slice(0, 10);
    downloadSaveFile(data, `clickmaster-save-${date}.json`);
    showSuccess('Save exportado com sucesso!');
  }, [state, soundEnabled, musicEnabled, theme, playerName, showSuccess]);

  const handleImportSave = useCallback(async (file) => {
    try {
      const data = await parseSaveFile(file);
      if (window.confirm('Importar este save? O progresso atual será substituído!')) {
        applyImportedData(data);
      }
    } catch (err) {
      showError(err.message || 'Erro ao importar save');
    }
  }, [showError]);

  const handlePrestige = useCallback(() => {
    const result = doPrestige();
    playPrestige();
    if (particleRef.current) particleRef.current.spawnPrestige();
    // Submit to leaderboard on prestige
    if (state.totalEarned >= 50000) {
      const entry = {
        name: playerName || 'Jogador',
        score: state.score,
        totalEarned: state.totalEarned,
        clickPower: state.clickPower,
        totalClicks: state.totalClicks,
        upgradesCount: state.totalUpgradesBought,
        achievementsCount: state.unlockedAchievements.length,
        cps: cps,
        prestigePower: state.clickPower,
      };
      addEntry(entry);
      setLbPanelOpen(true);
    }
  }, [doPrestige, playPrestige, state.totalEarned, state.score, state.clickPower, state.totalClicks, state.totalUpgradesBought, state.unlockedAchievements.length, playerName, cps, addEntry]);

  const handleReset = useCallback(() => {
    if (!window.confirm('Tem certeza? Todo o progresso será perdido!')) return;
    doReset();
  }, [doReset]);

  // Unlocked count
  const unlockedCount = useMemo(() =>
    ACHIEVEMENT_DEFS.filter(a => isUnlocked(a.id)).length,
  [isUnlocked]);

  // Rainbow mode optimization
  const rainbowClass = useMemo(() =>
    activeEffects.rainbowMode ? ' rainbow-mode' : '',
  [activeEffects.rainbowMode]);

  return (
    <div className={`game-container${rainbowClass}${isLandscape ? ' landscape' : ''}`}>
      {/* Fullscreen button (mobile) */}
      {!isFullscreen && (
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          onPointerDown={(e) => e.preventDefault()}
          aria-label="Tela cheia"
          title="Tela cheia"
        >
          ⛶
        </button>
      )}

      {/* Particle canvas */}
      <ParticleCanvas onReady={onParticleReady} />

      <div className="game-card">
        <div className="header">
          <h1>✨ ClickMaster</h1>
          <p>Clique para ganhar</p>
        </div>

        <ScoreDisplay score={state.score} cps={cps} />

        <ProgressBar totalEarned={state.totalEarned} />

        <div
          className="click-area"
          ref={clickAreaRef}
          onContextMenu={handleContextMenu}
        >
          <button
            className={`click-btn${isPressed ? ' click-btn--pressed' : ''}`}
            onClick={onMainClick}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMainClick(e);
              }
            }}
            aria-label="Clique para ganhar moedas"
          >
            <span className="shine"></span>
            <span className="ring-glow"></span>
            👆
          </button>

          {/* Floating numbers */}
          <AnimatePresence>
            {floaters.map(f => (
              <motion.div
                key={f.id}
                className="floating-number"
                initial={{ opacity: 1, y: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 0, y: -120, scale: 0.8, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                style={{
                  left: f.x + 'px',
                  top: f.y + 'px',
                  color: f.color,
                  fontSize: f.isCrit ? '2.4rem' : '1.8rem',
                }}
              >
                {f.isCrit ? '✨ ' : '+'}{formatNumber(f.value)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <UpgradesList
          upgrades={state.upgrades}
          score={state.score}
          onBuy={(id) => {
            const prevScore = state.score;
            buyUpgrade(id);
            const def = UPGRADE_DEFS.find(d => d.id === id);
            if (def) {
              const cost = def.getCost(state.upgrades[id].level);
              if (prevScore >= cost) {
                playUpgrade();
                const pos = getParticlePos();
                if (pos && particleRef.current) {
                  particleRef.current.spawnUpgrade(pos.x, pos.y);
                }
              }
            }
          }}
        />

        <Footer
          theme={theme}
          themeIcon={currentTheme.icon}
          themeLabel={currentTheme.name}
          newAchievementsCount={state.newAchievements.length}
          onOpenAchievements={handleOpenAchievements}
          onOpenLeaderboard={() => setLbPanelOpen(true)}
          onPrestige={handlePrestige}
          onReset={handleReset}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={toggleSound}
          onToggleMusic={toggleMusic}
          onToggleTheme={toggleTheme}
          onExportSave={handleExportSave}
          onImportSave={handleImportSave}
          onOpenShop={() => setShopPanelOpen(true)}
          equippedBadge={equippedBadge}
          isAuto={isAuto}
        />
      </div>

      {/* Milestone notification */}
      <MilestoneNotification value={milestone} onClear={clearMilestone} />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Achievement unlock notification */}
      <AchievementNotification achievement={achieveNotif} onClear={clearAchieveNotif} />

      {/* Achievements panel */}
      <AchievementsPanel
        isOpen={achPanelOpen}
        onClose={() => setAchPanelOpen(false)}
        unlockedAchievements={state.unlockedAchievements}
        total={ACHIEVEMENT_DEFS.length}
        unlockedCount={unlockedCount}
      />

      {/* Shop panel */}
      <ShopPanel
        isOpen={shopPanelOpen}
        onClose={() => setShopPanelOpen(false)}
        score={state.score}
        shopItems={shopItems}
        purchasedItems={purchasedItems}
        equippedItems={equippedItems}
        isPurchased={isPurchased}
        isEquipped={isEquipped}
        onBuy={(id) => {
          const def = shopItems.find(i => i.id === id);
          if (def) {
            const success = buyItem(id, state.score);
            if (success) {
              spendScore(def.price);
            }
            return success;
          }
          return false;
        }}
        onToggleEquip={toggleEquip}
        getItemTierColor={getItemTierColor}
        onShowNotification={(emoji, text) => showShop(text)}
      />

      {/* Leaderboard panel */}
      <LeaderboardPanel
        isOpen={lbPanelOpen}
        onClose={() => setLbPanelOpen(false)}
        entries={lbEntries}
        onRemoveEntry={removeEntry}
        onClearAll={clearAll}
        playerName={playerName}
        onSavePlayerName={savePlayerName}
      />
    </div>
  );
}
