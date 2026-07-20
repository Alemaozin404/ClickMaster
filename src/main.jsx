import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

// ---- PWA Service Worker Registration (apenas em produção) ----
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${baseUrl}sw.js`, {
      scope: baseUrl,
    }).then((reg) => {
      console.log('[PWA] Service Worker registrado com escopo:', reg.scope);

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('[PWA] Nova versão disponível!');
          }
        });
      });
    }).catch((err) => {
      console.warn('[PWA] Erro ao registrar Service Worker:', err);
    });

    // Handle controller change (new SW activated)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

// ---- Fullscreen on mount (mobile) ----
// Note: Fullscreen requires user gesture, so we handle it in App.jsx

// ---- Prevent touch zoom ----
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
