import { memo } from 'react';
import { UPGRADE_DEFS } from '../utils/gameLogic';
import UpgradeItem from './UpgradeItem';

const UpgradesList = memo(function UpgradesList({ upgrades, score, onBuy }) {
  return (
    <div className="upgrades-section">
      <div className="section-title">
        ⬆️ Melhorias
      </div>
      <div className="upgrades">
        {UPGRADE_DEFS.map(def => (
          <UpgradeItem
            key={def.id}
            def={def}
            upg={upgrades[def.id]}
            score={score}
            onBuy={onBuy}
          />
        ))}
      </div>
    </div>
  );
});

export default UpgradesList;
