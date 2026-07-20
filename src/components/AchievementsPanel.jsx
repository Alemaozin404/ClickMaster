import { AnimatePresence, motion } from 'framer-motion';
import { ACHIEVEMENT_DEFS } from '../utils/gameLogic';
import AchievementItem from './AchievementItem';

export default function AchievementsPanel({ isOpen, onClose, unlockedAchievements, total, unlockedCount }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="achievements-overlay open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="achievements-panel"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300, mass: 0.8 }}
          >
            <div className="achievements-header">
              <h2>🏆 Conquistas</h2>
              <button className="close-btn" onClick={onClose} aria-label="Fechar">✕</button>
            </div>
            <div className="achievements-progress">
              <div className="progress-text">
                <span>Progresso</span>
                <span>{unlockedCount} / {total}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${total > 0 ? (unlockedCount / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="achievements-list">
              {ACHIEVEMENT_DEFS.map((def, i) => (
                <motion.div
                  key={def.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25, ease: 'easeOut' }}
                >
                  <AchievementItem
                    def={def}
                    unlocked={unlockedAchievements.includes(def.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
