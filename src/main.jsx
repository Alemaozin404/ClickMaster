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
      console.log('[PWA] Service Worker registrado:', reg.scope);

      // Se ja existe um SW em espera (nova versao), ativa imediatamente
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Detecta quando uma nova versao do SW e encontrada
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nova versao baixada — ativa imediatamente
              console.log('[PWA] Nova versao disponivel! Ativando...');
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            } else {
              // Primeira instalacao do SW
              console.log('[PWA] SW instalado pela primeira vez');
            }
          }
        });
      });
    }).catch((err) => {
      console.warn('[PWA] Erro ao registrar SW:', err);
    });

    // Recarrega a pagina quando o SW assume o controle
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('[PWA] Nova versao ativada! Recarregando...');
      window.location.reload();
    });
  });
}

// ---- Helpers ----
function hideSplash() {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }
}

// ---- Prevent touch zoom ----
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

// ---- Initialize App with error handling ----
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Elemento raiz #root nao encontrado no DOM');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );

  // Nota: a splash screen já é gerenciada pelo script inline no index.html
  // via MutationObserver + fallbacks. Esta chamada é apenas redundância.
  requestAnimationFrame(hideSplash);

} catch (err) {
  console.error('[Init] Erro fatal ao inicializar:', err);
  hideSplash();

  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;padding:24px;text-align:center;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;font-family:Segoe UI,system-ui,sans-serif;"><div style="font-size:4rem;margin-bottom:16px;">💥</div><h1 style="font-family:Fredoka One,cursive;font-size:1.8rem;background:linear-gradient(135deg,#f093fb,#f5576c,#ffd86f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px;">Erro ao iniciar o jogo</h1><p style="color:rgba(255,255,255,0.5);margin-bottom:20px;max-width:400px;">Nao foi possivel iniciar o ClickMaster. Tente recarregar ou limpar o cache.</p><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;"><button onclick="location.reload()" style="background:radial-gradient(circle at 35% 35%,#ff6b6b,#ee5a24,#c0392b);border:none;color:#fff;padding:14px 28px;border-radius:14px;font-family:Nunito,sans-serif;font-weight:700;font-size:1rem;cursor:pointer;box-shadow:0 8px 24px rgba(238,90,36,0.3);">🔄 Recarregar</button></div></div>';
  }
}
