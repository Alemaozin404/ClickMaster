import { memo } from 'react';
import { formatNumber } from '../utils/gameLogic';

const UpgradeItem = memo(function UpgradeItem({ def, upg, score, onBuy }) {
  const cost = def.getCost(upg.level);
  const canBuy = score >= cost;

  const effectText = upg.level > 0
    ? def.formatEffect(upg.level)
    : def.formatEffect(1);

  return (
    <div
      className={`upgrade-item ${!canBuy ? 'disabled' : ''}`}
      onClick={() => canBuy && onBuy(def.id)}
      role="button"
      tabIndex={canBuy ? 0 : -1}
      onKeyDown={(e) => {
        if (canBuy && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onBuy(def.id);
        }
      }}
      aria-disabled={!canBuy}
    >
      <div className="upgrade-icon">{def.icon}</div>
      <div className="upgrade-info">
        <div className="upgrade-name">{def.name}</div>
        <div className="upgrade-desc">{effectText}</div>
      </div>
      <div className="upgrade-stats">
        <div className="upgrade-cost">
          <span className="coin-small">🪙</span> {formatNumber(cost)}
        </div>
        <div className="upgrade-level">Nível {upg.level}</div>
      </div>
    </div>
  );
});

export default UpgradeItem;
