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
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] Nova versão disponível!');
          }
        });
      });
    }).catch((err) => {
      console.warn('[PWA] Erro ao registrar Service Worker:', err);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

// ---- Hide splash screen ----
function hideSplash() {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }
}

// ---- Fullscreen on mount (mobile) ----
// Note: Fullscreen requires user gesture, so we handle it in App.jsx

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

  // Hide splash screen after React mounts
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hideSplash();
    });
  });

  // Force hide splash after 5s (fallback in case React mounts but splash gets stuck)
  setTimeout(hideSplash, 5000);

  // Timeout guard: if React has not rendered ANY content into #root after 8s,
  // show a manual fallback. This catches cases where React fails silently.
  const mountCheck = setTimeout(() => {
    const hasContent = rootElement?.children.length > 0;
    if (!hasContent) {
      console.warn('[Init] App nao montou em 8s — exibindo fallback manual');
      hideSplash();
      rootElement.innerHTML = [
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;',
        'min-height:100dvh;padding:24px;text-align:center;',
        'background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);',
        'color:#fff;font-family:Segoe UI,system-ui,sans-serif;">',
        '<div style="font-size:4rem;margin-bottom:16px;">⏳</div>',
        '<h1 style="font-size:1.5rem;margin-bottom:12px;">O jogo demorou muito para carregar</h1>',
        '<p style="color:rgba(255,255,255,0.5);margin-bottom:20px;">',
        'Verifique sua conexao ou tente recarregar.</p>',
        '<button onclick="location.reload()" style="',
        'background:radial-gradient(circle at 35% 35%,#ff6b6b,#ee5a24,#c0392b);',
        'border:none;color:#fff;padding:14px 28px;border-radius:14px;',
        'font-family:Nunito,sans-serif;font-weight:700;font-size:1rem;',
        'cursor:pointer;box-shadow:0 8px 24px rgba(238,90,36,0.3);',
        '">🔄 Recarregar</button></div>',
      ].join('');
    }
  }, 8000);

  // MutationObserver: detect when React successfully renders into #root
  // and cancel the 8s timeout. Observes any child being added.
  const observer = new MutationObserver(() => {
    if (rootElement && rootElement.children.length > 0) {
      clearTimeout(mountCheck);
      observer.disconnect();
    }
  });
  if (rootElement) {
    observer.observe(rootElement, { childList: true, subtree: true });
  }

} catch (err) {
  console.error('[Init] Erro fatal ao inicializar:', err);

  hideSplash();

  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = [
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'min-height:100dvh;padding:24px;text-align:center;',
      'background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);',
      'color:#fff;font-family:Segoe UI,system-ui,sans-serif;">',
      '<div style="font-size:4rem;margin-bottom:16px;">💥</div>',
      '<h1 style="font-family:Fredoka One,cursive;font-size:1.8rem;',
      'background:linear-gradient(135deg,#f093fb,#f5576c,#ffd86f);',
      '-webkit-background-clip:text;-webkit-text-fill-color:transparent;',
      'background-clip:text;margin-bottom:12px;">Erro ao iniciar o jogo</h1>',
      '<p style="color:rgba(255,255,255,0.5);margin-bottom:20px;max-width:400px;">',
      'Nao foi possivel iniciar o ClickMaster. Tente recarregar ou limpar o cache.</p>',
      '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">',
      '<button onclick="location.reload()" style="',
      'background:radial-gradient(circle at 35% 35%,#ff6b6b,#ee5a24,#c0392b);',
      'border:none;color:#fff;padding:14px 28px;border-radius:14px;',
      'font-family:Nunito,sans-serif;font-weight:700;font-size:1rem;',
      'cursor:pointer;box-shadow:0 8px 24px rgba(238,90,36,0.3);',
      '">🔄 Recarregar</button></div>',
      '<details style="margin-top:20px;color:rgba(255,255,255,0.3);font-size:0.75rem;">',
      '<summary style="cursor:pointer;">Detalhes do erro</summary>',
      '<pre style="margin-top:8px;padding:12px;background:rgba(0,0,0,0.3);',
      'border-radius:8px;text-align:left;overflow-x:auto;">',
      err.message,
      '</pre></details></div>',
    ].join('');
  }
}
