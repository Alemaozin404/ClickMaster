import { useState, useEffect } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('[TEST] App mounted successfully');
  }, []);

  return (
    <div style={{
      background: '#1a1a3e',
      color: '#fff',
      padding: '40px',
      borderRadius: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🪙</div>
      <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>ClickMaster</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
        Clique para ganhar moedas!
      </p>
      <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px', color: '#ffd86f' }}>
        {count}
      </div>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #ee5a24, #c0392b)',
          border: 'none',
          color: '#fff',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          fontSize: '3rem',
          cursor: 'pointer',
          boxShadow: '0 12px 40px rgba(238, 90, 36, 0.4)',
        }}
      >
        👆
      </button>
      <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
        Contador: {count} clique(s)
      </p>
    </div>
  );
}
