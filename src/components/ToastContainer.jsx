import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

const ToastContainer = memo(function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notificações">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, i) => (
          <Toast
            key={toast.id}
            toast={toast}
            index={i}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default ToastContainer;
