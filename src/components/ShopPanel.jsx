import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatNumber } from '../utils/gameLogic';
import AnimatedOverlay from './AnimatedOverlay';

const TIER_LABELS = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

const CATEGORY_LABELS = {
  particle: '🎨 Cores de Partículas',
  badge: '🏅 Badges',
  effect: '✨ Efeitos Especiais',
  power: '⚡ Power-ups',
};

const CATEGORY_ORDER = ['particle', 'badge', 'effect', 'power'];

export default function ShopPanel({
  isOpen,
  onClose,
  score,
  shopItems,
  purchasedItems,
  equippedItems,
  isPurchased,
  isEquipped,
  onBuy,
  onToggleEquip,
  getItemTierColor,
  onShowNotification,
}) {
  const [activeCategory, setActiveCategory] = useState('particle');
  const [confirmBuy, setConfirmBuy] = useState(null);

  const categories = [...new Set(shopItems.map(i => i.category))].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  const filteredItems = shopItems.filter(i => i.category === activeCategory);

  const handleBuy = (item) => {
    if (score < item.price) return;
    setConfirmBuy(item.id);
  };

  const confirmPurchase = () => {
    if (confirmBuy) {
      const success = onBuy(confirmBuy);
      if (success) {
        onShowNotification?.('🛒', 'Item comprado com sucesso!');
      }
      setConfirmBuy(null);
    }
  };

  return (
    <AnimatedOverlay isOpen={isOpen} onClose={onClose} className="shop-overlay">
      <div className="shop-panel">
        <div className="shop-header">
          <h2>🛒 Loja Cosmética</h2>
          <div className="shop-balance">
            🪙 {formatNumber(score)}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Category tabs */}
        <div className="shop-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`shop-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="shop-items">
          {filteredItems.map(item => {
            const owned = isPurchased(item.id);
            const equipped = isEquipped(item.id);
            const canAfford = score >= item.price;
            const tierColor = getItemTierColor(item.tier);

            return (
              <div
                key={item.id}
                className={`shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''} ${!canAfford && !owned ? 'locked' : ''}`}
                style={{ '--tier-color': tierColor }}
              >
                <div className="shop-item-header">
                  <span className="shop-item-icon">{item.icon}</span>
                  <span className="shop-item-tier" style={{ color: tierColor }}>
                    {TIER_LABELS[item.tier]}
                  </span>
                </div>
                <div className="shop-item-name">{item.name}</div>
                <div className="shop-item-desc">{item.desc}</div>

                {!owned ? (
                  <button
                    className="shop-item-btn"
                    style={{ '--btn-color': canAfford ? tierColor : 'var(--text-dim)' }}
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                  >
                    🪙 {formatNumber(item.price)}
                  </button>
                ) : item.category !== 'power' ? (
                  <button
                    className={`shop-item-btn equip-btn ${equipped ? 'active' : ''}`}
                    onClick={() => onToggleEquip(item.id)}
                  >
                    {equipped ? '✓ Equipado' : 'Equipar'}
                  </button>
                ) : (
                  <div className="shop-item-owned">✓ Adquirido</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="shop-footer">
          <span className="shop-footer-hint">
            💡 Itens cosméticos não são perdidos no Prestígio!
          </span>
        </div>
      </div>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {confirmBuy && (() => {
          const item = shopItems.find(i => i.id === confirmBuy);
          if (!item) return null;
          return (
            <motion.div
              key="confirm-overlay"
              className="shop-confirm-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setConfirmBuy(null)}
            >
              <motion.div
                className="shop-confirm"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="shop-confirm-icon">{item.icon}</div>
                <div className="shop-confirm-name">{item.name}</div>
                <div className="shop-confirm-price">🪙 {formatNumber(item.price)}</div>
                <p>Tem certeza que deseja comprar?</p>
                <div className="shop-confirm-btns">
                  <button className="shop-confirm-yes" onClick={confirmPurchase}>Comprar</button>
                  <button className="shop-confirm-no" onClick={() => setConfirmBuy(null)}>Cancelar</button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </AnimatedOverlay>
  );
}
