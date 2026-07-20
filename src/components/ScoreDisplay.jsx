import { useState, useEffect, useRef } from 'react';
import { formatNumber } from '../utils/gameLogic';

export default function ScoreDisplay({ score, cps, scorePop, onPopEnd }) {
  const [pop, setPop] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current && score > prevScore.current) {
      setPop(true);
      const timer = setTimeout(() => {
        setPop(false);
        if (onPopEnd) onPopEnd();
      }, 300);
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
    prevScore.current = score;
  }, [score, onPopEnd]);

  return (
    <div className="score-section">
      <div className="score-display">
        <span className="coin-icon">🪙</span>
        <span className={`score-number ${pop ? 'pop' : ''}`}>
          {formatNumber(score)}
        </span>
      </div>
      <div className="score-label">Moedas</div>
      <div className="cps-display">
        ⚡ <span className="cps-value">{formatNumber(cps)}</span> moedas/segundo
      </div>
    </div>
  );
}
