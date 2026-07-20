import { useState } from 'react';
import { formatNumber } from '../utils/gameLogic';
import AnimatedOverlay from './AnimatedOverlay';

const PODIUM_EMOJIS = ['🥇', '🥈', '🥉'];

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function LeaderboardPanel({
  isOpen,
  onClose,
  entries,
  onRemoveEntry,
  onClearAll,
  playerName,
  onSavePlayerName,
}) {
  const [nameInput, setNameInput] = useState(playerName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleSaveName = () => {
    const trimmed = nameInput.trim().slice(0, 20);
    onSavePlayerName(trimmed || 'Jogador');
    setNameInput(trimmed || 'Jogador');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveName();
  };

  return (
    <AnimatedOverlay isOpen={isOpen} onClose={onClose} className="leaderboard-overlay">
      <div className="leaderboard-panel">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Player name input */}
        <div className="lb-name-section">
          <label className="lb-name-label">Seu nome</label>
          <div className="lb-name-row">
            <input
              className="lb-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite seu nome..."
              maxLength={20}
              aria-label="Nome do jogador"
            />
            <button className="lb-name-btn" onClick={handleSaveName}>Salvar</button>
          </div>
        </div>

        {/* Podium (top 3) */}
        {entries.length > 0 && (
          <div className="lb-podium">
            {entries.slice(0, 3).map((entry, i) => (
              <div
                key={entry.id}
                className={`lb-podium-item lb-podium-${i + 1}`}
                style={{
                  order: i === 0 ? 2 : i === 1 ? 1 : 3,
                }}
              >
                <div className="lb-podium-emoji">{PODIUM_EMOJIS[i]}</div>
                <div className="lb-podium-name">{entry.name}</div>
                <div className="lb-podium-score">{formatNumber(entry.totalEarned)}</div>
                <div className="lb-podium-stats">
                  ⚡{formatNumber(entry.cps)} 🖱️{formatNumber(entry.totalClicks)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Entries list */}
        <div className="lb-list-header">
          <span>#</span>
          <span>Jogador</span>
          <span>Total</span>
          <span>Data</span>
          {entries.length > 0 && <span></span>}
        </div>

        <div className="lb-list">
          {entries.length === 0 ? (
            <div className="lb-empty">
              <span className="lb-empty-icon">🏆</span>
              <p>Nenhuma pontuação registrada ainda!</p>
              <p className="lb-empty-hint">Complete um Prestígio para aparecer aqui.</p>
            </div>
          ) : (
            entries.map((entry, i) => (
              <div key={entry.id} className={`lb-item ${i < 3 ? `lb-item-top-${i + 1}` : ''}`}>
                <span className="lb-rank">
                  {i < 3 ? PODIUM_EMOJIS[i] : `#${i + 1}`}
                </span>
                <span className="lb-name">{entry.name}</span>
                <span className="lb-score">{formatNumber(entry.totalEarned)}</span>
                <span className="lb-date">{formatDate(entry.date)}</span>
                <button
                  className="lb-delete-btn"
                  onClick={() => setShowDeleteConfirm(entry.id)}
                  title="Remover"
                  aria-label={`Remover ${entry.name}`}
                >
                  ✕
                </button>

                {/* Delete confirmation */}
                {showDeleteConfirm === entry.id && (
                  <div className="lb-delete-confirm">
                    <span>Remover?</span>
                    <button onClick={() => { onRemoveEntry(entry.id); setShowDeleteConfirm(null); }}>Sim</button>
                    <button onClick={() => setShowDeleteConfirm(null)}>Não</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="lb-footer-actions">
            <button className="lb-clear-btn" onClick={onClearAll}>
              🗑️ Limpar tudo
            </button>
          </div>
        )}
      </div>
    </AnimatedOverlay>
  );
}
