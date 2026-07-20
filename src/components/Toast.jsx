import { memo } from 'react';
import { motion } from 'framer-motion';

const TYPE_STYLES = {
  success: { bg: 'rgba(0, 184, 148, 0.12)', border: 'rgba(0, 184, 148, 0.3)', shadow: 'rgba(0, 184, 148, 0.2)' },
  info: { bg: 'rgba(79, 195, 247, 0.12)', border: 'rgba(79, 195, 247, 0.3)', shadow: 'rgba(79, 195, 247, 0.2)' },
  warning: { bg: 'rgba(254, 202, 87, 0.12)', border: 'rgba(254, 202, 87, 0.3)', shadow: 'rgba(254, 202, 87, 0.2)' },
  error: { bg: 'rgba(255, 107, 107, 0.12)', border: 'rgba(255, 107, 107, 0.3)', shadow: 'rgba(255, 107, 107, 0.2)' },
  achievement: { bg: 'rgba(255, 216, 111, 0.15)', border: 'rgba(255, 216, 111, 0.35)', shadow: 'rgba(255, 216, 111, 0.25)' },
  milestone: { bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.35)', shadow: 'rgba(167, 139, 250, 0.25)' },
  prestige: { bg: 'rgba(255, 159, 243, 0.15)', border: 'rgba(255, 159, 243, 0.35)', shadow: 'rgba(255, 159, 243, 0.25)' },
  shop: { bg: 'rgba(0, 184, 148, 0.12)', border: 'rgba(0, 184, 148, 0.3)', shadow: 'rgba(0, 184, 148, 0.2)' },
};

const Toast = memo(function Toast({ toast, onRemove, index }) {
  const typeStyle = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
  const offset = index * 8;

  return (
    <motion.div
      className="toast-item"
      style={{
        '--toast-bg': typeStyle.bg,
        '--toast-border': typeStyle.border,
        '--toast-shadow': typeStyle.shadow,
        '--toast-color': toast.color,
      }}
      initial={{ opacity: 0, x: 120, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.85 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300, mass: 0.8 }}
      layout
    >
      <span className="toast-emoji">{toast.emoji}</span>
      <span className="toast-text">{toast.text}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </motion.div>
  );
});

export default Toast;
