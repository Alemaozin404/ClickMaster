import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatNumber } from '../utils/gameLogic';

export default function MilestoneNotification({ value, onClear }) {
  useEffect(() => {
    if (value === null) return;
    const timer = setTimeout(() => {
      onClear();
    }, 2500);
    return () => clearTimeout(timer);
  }, [value, onClear]);

  return (
    <AnimatePresence>
      {value !== null && (
        <motion.div
          key={value}
          className="milestone"
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.85 }}
          transition={{ type: 'spring', damping: 18, stiffness: 280 }}
        >
          <span className="milestone-emoji">🎉</span>
          <span className="milestone-text">🎯 {formatNumber(value)} moedas conquistadas!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
