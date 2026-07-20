import { useRef } from 'react';

export default function Footer({
  theme,
  themeIcon,
  themeLabel,
  isAuto,
  newAchievementsCount,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenShop,
  onPrestige,
  onReset,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onToggleTheme,
  onExportSave,
  onImportSave,
  equippedBadge,
}) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportSave(file);
      e.target.value = '';
    }
  };

  return (
    <>
      {/* Sound & Theme controls */}
      <div className="sound-controls">
        <button
          className={`control-btn ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
          aria-label={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          className={`control-btn ${musicEnabled ? 'active' : ''}`}
          onClick={onToggleMusic}
          title={musicEnabled ? 'Desativar música' : 'Ativar música'}
          aria-label={musicEnabled ? 'Desativar música' : 'Ativar música'}
        >
          {musicEnabled ? '🎶' : '🎵'}
        </button>
        <button
          className={`control-btn active ${isAuto ? 'theme-auto-btn' : ''}`}
          onClick={onToggleTheme}
          title={`Tema: ${themeLabel}${isAuto ? ' (sistema)' : ''}`}
          aria-label={`Tema atual: ${themeLabel}`}
        >
          {themeIcon}{isAuto && <span className="theme-auto-dot"></span>}
        </button>
        <button
          className="control-btn active"
          onClick={onExportSave}
          title="Exportar save"
          aria-label="Exportar save"
        >
          💾
        </button>
        <button
          className="control-btn active"
          onClick={handleImportClick}
          title="Importar save"
          aria-label="Importar save"
        >
          📂
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div className="footer-actions">
        <button className="footer-btn" onClick={onOpenAchievements}>
          🏆 Conquistas
          {newAchievementsCount > 0 && (
            <span className="achievement-badge">{newAchievementsCount}</span>
          )}
        </button>
        <button className="footer-btn" onClick={onOpenLeaderboard}>
          📊 Ranking
        </button>
        <button className="footer-btn" onClick={onOpenShop}>
          🛒 Loja{equippedBadge && <span className="equipped-badge-indicator">{equippedBadge.icon}</span>}
        </button>
        <button className="footer-btn" onClick={onPrestige}>🌟 Prestígio</button>
        <button className="footer-btn danger" onClick={onReset}>↺ Reiniciar</button>
      </div>
    </>
  );
}
