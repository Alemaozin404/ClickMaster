import { AnimatePresence, motion } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 22, stiffness: 300, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

/**
 * AnimatedOverlay — Wraps any overlay panel with Framer Motion
 * fadeIn/scaleUp entrance and fadeOut exit animations.
 *
 * @param {boolean} isOpen - Whether the overlay is visible
 * @param {function} onClose - Called when overlay background is clicked
 * @param {ReactNode} children - Content to render inside the panel
 * @param {object} panelProps - Extra props for the panel motion.div
 */
export default function AnimatedOverlay({ isOpen, onClose, children, className = '' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`animated-overlay ${className}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
          <motion.div
            className="animated-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
