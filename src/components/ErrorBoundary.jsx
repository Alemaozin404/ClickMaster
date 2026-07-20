import { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ERROR_CATEGORIES = {
  STORAGE: {
    title: 'Problema de Armazenamento',
    icon: '💾',
    message: 'O jogo não conseguiu acessar o armazenamento local do navegador.',
    solutions: [
      'Verifique se as cookies/storage estão habilitados no navegador',
      'Limpe o cache do navegador e tente novamente',
      'Tente usar o modo anônimo/privado',
    ],
  },
  BROWSER: {
    title: 'Navegador não compatível',
    icon: '🌐',
    message: 'Seu navegador pode não suportar todos os recursos necessários.',
    solutions: [
      'Atualize seu navegador para a versão mais recente',
      'Tente usar Chrome, Firefox ou Edge atualizados',
      'Desative extensões que possam estar bloqueando scripts',
    ],
  },
  NETWORK: {
    title: 'Erro de Rede',
    icon: '📡',
    message: 'Não foi possível carregar todos os recursos do jogo.',
    solutions: [
      'Verifique sua conexão com a internet',
      'Tente recarregar a página',
      'Se estiver usando um proxy/VPN, tente desativá-lo',
    ],
  },
  REACT: {
    title: 'Erro na Interface',
    icon: '🔧',
    message: 'Ocorreu um erro inesperado ao renderizar o jogo.',
    solutions: [
      'Tente recarregar a página',
      'Limpe o cache do navegador',
      'Se o problema persistir, entre em contato',
    ],
  },
  UNKNOWN: {
    title: 'Erro Inesperado',
    icon: '⚠️',
    message: 'Algo deu errado ao carregar o jogo.',
    solutions: [
      'Tente recarregar a página',
      'Limpe o cache do navegador',
      'Se o problema persistir, entre em contato',
    ],
  },
};

function categorizeError(error) {
  if (!error) return ERROR_CATEGORIES.UNKNOWN;
  const msg = error.toString().toLowerCase();

  if (
    msg.includes('localstorage') ||
    msg.includes('quota') ||
    msg.includes('storage') ||
    msg.includes('indexeddb')
  ) {
    return ERROR_CATEGORIES.STORAGE;
  }

  if (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('load') ||
    msg.includes('timeout') ||
    msg.includes('abort')
  ) {
    return ERROR_CATEGORIES.NETWORK;
  }

  if (
    msg.includes('webaudio') ||
    msg.includes('webgl') ||
    msg.includes('canvas') ||
    msg.includes('requestanimationframe')
  ) {
    return ERROR_CATEGORIES.BROWSER;
  }

  if (msg.includes('react') || msg.includes('render') || msg.includes('hook')) {
    return ERROR_CATEGORIES.REACT;
  }

  return ERROR_CATEGORIES.UNKNOWN;
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      cleared: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', error);
    console.error('[ErrorBoundary] Stack:', errorInfo?.componentStack);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false, cleared: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleClearStorage = () => {
    try {
      // Clear only ClickMaster data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('clickmaster_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      this.setState({ cleared: true });
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const category = categorizeError(this.state.error);
      const isDev = import.meta.env.DEV;

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',              minHeight: '100dvh',
            padding: '24px',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            color: '#fff',
            fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif",
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '32px',
              padding: '40px 32px',
              maxWidth: '460px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 50% 50%, rgba(245, 87, 108, 0.06), transparent 50%)',
                pointerEvents: 'none',
              }}
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.1 }}
              style={{
                fontSize: '4rem',
                marginBottom: '16px',
                lineHeight: 1,
              }}
            >
              {category.icon}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: '1.8rem',
                background: 'linear-gradient(135deg, #f093fb, #f5576c, #ffd86f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px',
                lineHeight: 1.2,
              }}
            >
              {category.title}
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              {category.message}
            </motion.p>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.25 }}
              style={{
                textAlign: 'left',
                marginBottom: '28px',
                padding: '16px 20px',
                background: 'rgba(79, 195, 247, 0.06)',
                border: '1px solid rgba(79, 195, 247, 0.12)',
                borderRadius: '14px',
              }}
            >
              <div style={{
                color: '#4fc3f7',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
              }}>
                💡 Sugestões para resolver:
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {category.solutions.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.82rem',
                      lineHeight: '1.4',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#4fc3f7',
                    }}>▸</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Error Details (collapsible) */}
            {this.state.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginBottom: '24px' }}
              >
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '0.75rem',
                    fontFamily: "'Nunito', sans-serif",
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {this.state.showDetails ? '▾ Ocultar detalhes técnicos' : '▸ Mostrar detalhes técnicos'}
                </button>

                <AnimatePresence>
                  {this.state.showDetails && (
                    <motion.pre
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        marginTop: '8px',
                        padding: '14px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '10px',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.7rem',
                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                        textAlign: 'left',
                        maxHeight: '200px',
                        lineHeight: '1.5',
                      }}
                    >
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.error.stack}
                    </motion.pre>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {/* Retry */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={this.handleRetry}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #ee5a24, #c0392b)',
                  border: 'none',
                  color: '#fff',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(238, 90, 36, 0.3)',
                  transition: 'box-shadow 0.2s',
                  flex: '1 1 auto',
                  minWidth: '140px',
                }}
              >
                🔄 Tentar novamente
              </motion.button>

              {/* Reload */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={this.handleReload}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flex: '1 1 auto',
                  minWidth: '140px',
                }}
              >
                🔄 Recarregar
              </motion.button>

              {/* Clear Storage (only if storage error) */}
              {category === ERROR_CATEGORIES.STORAGE && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={this.handleClearStorage}
                  disabled={this.state.cleared}
                  style={{
                    background: this.state.cleared
                      ? 'rgba(0, 200, 83, 0.15)'
                      : 'rgba(255, 152, 0, 0.12)',
                    border: `1px solid ${
                      this.state.cleared
                        ? 'rgba(0, 200, 83, 0.2)'
                        : 'rgba(255, 152, 0, 0.2)'
                    }`,
                    color: this.state.cleared ? '#00c853' : '#ff9800',
                    padding: '14px 24px',
                    borderRadius: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: this.state.cleared ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    flex: '1 1 auto',
                    minWidth: '200px',
                  }}
                >
                  {this.state.cleared ? '✅ Dados limpos! Recarregando...' : '🗑️ Limpar dados do jogo'}
                </motion.button>
              )}
            </motion.div>

            {/* Support footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: '24px',
                color: 'rgba(255,255,255,0.15)',
                fontSize: '0.7rem',
                lineHeight: '1.5',
              }}
            >
              Se o problema persistir, abra uma issue no{' '}
              <a
                href="https://github.com/Alemaozin404/ClickMaster/issues"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#4fc3f7', textDecoration: 'none' }}
              >
                GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
