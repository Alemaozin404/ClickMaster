import { useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const AchievementNotification = memo(function AchievementNotification({ achievement, onClear }) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      onClear();
    }, 3500);
    return () => clearTimeout(timer);
  }, [achievement, onClear]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          className="achievement-unlock"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div className="unlock-label">🏆 Conquista desbloqueada!</div>
          <div className="unlock-title">
            <span className="unlock-icon">{achievement.icon}</span>
            <span className="unlock-name">{achievement.name}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default AchievementNotification;
