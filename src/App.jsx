import { useState, useEffect } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('[CLICKMASTER] App montou - fase 0 OK');
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🪙</div>
      <h1 style={{
        fontSize: '2.2rem',
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #f093fb, #f5576c, #ffd86f)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        ClickMaster
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
        Fase 0 - Teste básico
      </p>
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#ffd86f',
        marginBottom: '20px',
      }}>
        {count}
      </div>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #ee5a24, #c0392b)',
          border: 'none',
          color: '#fff',
          fontSize: '3rem',
          cursor: 'pointer',
          boxShadow: '0 12px 40px rgba(238, 90, 36, 0.4)',
        }}
      >
        👆
      </button>
      <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
        Contador: {count} clique(s)
      </p>
    </div>
  );
}
