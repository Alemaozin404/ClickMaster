import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', error);
    console.error('[ErrorBoundary] Stack:', errorInfo?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            color: '#fff',
            fontFamily: "'Nunito', sans-serif",
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '32px',
              padding: '40px 32px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚠️</div>
            <h1
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: '1.8rem',
                background: 'linear-gradient(135deg, #f093fb, #f5576c, #ffd86f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px',
              }}
            >
              Algo deu errado!
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                marginBottom: '24px',
              }}
            >
              Ocorreu um erro inesperado ao carregar o jogo.
              Tente recarregar a página ou clique no botão abaixo.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #ee5a24, #c0392b)',
                  border: 'none',
                  color: '#fff',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(238, 90, 36, 0.3)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
              >
                🔄 Tentar novamente
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                🔄 Recarregar página
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginTop: '20px',
                  textAlign: 'left',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.75rem',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Detalhes do erro</summary>
                <pre
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
