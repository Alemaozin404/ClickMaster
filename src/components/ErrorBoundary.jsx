import { Component } from 'react';

const STYLE_WRAPPER = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100dvh',
  padding: '24px',
  background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  color: '#fff',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  textAlign: 'center',
};

const STYLE_CARD = {
  background: 'rgba(255,255,255,0.04)',
  borderRadius: '32px',
  padding: '40px 32px',
  maxWidth: '460px',
  width: '100%',
};

const STYLE_ICON = {
  fontSize: '4rem',
  marginBottom: '16px',
  lineHeight: 1,
};

const STYLE_TITLE = {
  fontFamily: "'Fredoka One', cursive",
  fontSize: '1.8rem',
  background: 'linear-gradient(135deg, #f093fb, #f5576c, #ffd86f)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '12px',
  lineHeight: 1.2,
};

const STYLE_MESSAGE = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  marginBottom: '24px',
};

const STYLE_PRIMARY_BTN = {
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
  flex: '1 1 auto',
  minWidth: '140px',
};

const STYLE_SECONDARY_BTN = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.7)',
  padding: '14px 24px',
  borderRadius: '14px',
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  flex: '1 1 auto',
  minWidth: '140px',
};

function categorizeError(error) {
  if (!error) return { icon: '⚠️', title: 'Erro Inesperado', msg: 'Algo deu errado ao carregar o jogo.' };
  const m = error.toString().toLowerCase();
  if (m.includes('storage') || m.includes('quota')) {
    return { icon: '💾', title: 'Problema de Armazenamento', msg: 'O jogo não conseguiu acessar o armazenamento local do navegador. Verifique as permissões do site.' };
  }
  if (m.includes('network') || m.includes('fetch') || m.includes('timeout')) {
    return { icon: '📡', title: 'Erro de Rede', msg: 'Não foi possível carregar todos os recursos. Verifique sua conexão.' };
  }
  if (m.includes('webaudio') || m.includes('canvas')) {
    return { icon: '🌐', title: 'Navegador não compatível', msg: 'Seu navegador pode não suportar todos os recursos. Tente atualizá-lo.' };
  }
  return { icon: '⚠️', title: 'Erro Inesperado', msg: 'Algo deu errado ao carregar o jogo. Tente recarregar a página.' };
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const cat = categorizeError(this.state.error);

      return (
        <div style={STYLE_WRAPPER}>
          <div style={STYLE_CARD}>
            <div style={STYLE_ICON}>{cat.icon}</div>
            <h1 style={STYLE_TITLE}>{cat.title}</h1>
            <p style={STYLE_MESSAGE}>
              {cat.msg}
              {this.state.error && !cat.msg.includes('.') && (
                <span style={{ display: 'block', marginTop: '8px', fontSize: '0.85rem', opacity: 0.5 }}>
                  {this.state.error.toString().slice(0, 120)}
                </span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button style={STYLE_PRIMARY_BTN} onClick={this.handleRetry}>
                🔄 Tentar novamente
              </button>
              <button style={STYLE_SECONDARY_BTN} onClick={this.handleReload}>
                🔄 Recarregar
              </button>
            </div>

            {this.state.error && (
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                    fontSize: '0.75rem', fontFamily: "'Nunito', sans-serif",
                    cursor: 'pointer', fontWeight: 600, padding: '4px 8px',
                  }}
                >
                  {this.state.showDetails ? '▾ Ocultar detalhes técnicos' : '▸ Mostrar detalhes técnicos'}
                </button>
                {this.state.showDetails && (
                  <pre style={{
                    marginTop: '8px', padding: '14px', background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px', overflow: 'auto', whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word', color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.7rem', textAlign: 'left', maxHeight: '160px', lineHeight: '1.5',
                  }}>
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>
              Se o problema persistir, abra uma issue no{' '}
              <a href="https://github.com/Alemaozin404/ClickMaster/issues"
                 target="_blank" rel="noopener noreferrer"
                 style={{ color: '#4fc3f7', textDecoration: 'none' }}>GitHub</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
