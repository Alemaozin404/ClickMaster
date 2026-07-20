import { useState } from 'react';
import { useTheme } from './hooks/useTheme';

// ---- Cada componente chama UM hook incondicionalmente ----
function TestUseTheme() {
  try {
    const theme = useTheme();
    return <div style={{ color:'#4fc3f7' }}>✅ useTheme OK (tema: {theme.effectiveTheme})</div>;
  } catch(e) {
    return <div style={{ color:'#ff6b6b' }}>❌ useTheme: {e.message}</div>;
  }
}

// ---- App ----
export default function App() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ minHeight:'100dvh', padding:'40px', background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', color:'#fff', fontFamily:'system-ui' }}>
      
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'30px' }}>
        <div style={{ fontSize:'4rem', marginBottom:'16px', animation:'pulse 1.5s ease-in-out infinite' }}>🪙</div>
        <h1 style={{ fontSize:'2.2rem', marginBottom:'8px', background:'linear-gradient(135deg,#f093fb,#f5576c,#ffd86f)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>ClickMaster</h1>
        <p style={{ color:'rgba(255,255,255,0.4)' }}>Diagnóstico - Fase {step}</p>
      </div>

      <div style={{ maxWidth:'500px', margin:'0 auto', background:'rgba(255,255,255,0.04)', borderRadius:'16px', padding:'24px' }}>
        
        {/* Fase 0: React puro */}
        {step === 0 && (
          <>
            <div style={{ fontSize:'1.2rem', marginBottom:'20px', textAlign:'center' }}>✅ React puro funcionando!</div>
            <Button onClick={() => setStep(1)} label="▶ Testar useTheme" />
          </>
        )}

        {/* Fase 1: useTheme */}
        {step === 1 && (
          <>
            <TestUseTheme />
            <Button onClick={() => setStep(2)} label="▶ Proxima fase" />
          </>
        )}

        {/* Fase 2: Proximos hooks */}
        {step >= 2 && (
          <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)' }}>
            Diagnostico em progresso... useTheme funcionou!
          </div>
        )}

      </div>

      {/* Error Debug */}
      <div style={{ marginTop:'40px', padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', maxWidth:'500px', margin:'40px auto 0', fontFamily:'monospace', fontSize:'0.8rem' }}>
        <div style={{ color:'rgba(255,255,255,0.3)', marginBottom:'8px' }}>📋 DEBUG INFO:</div>
        <div style={{ color:'rgba(255,255,255,0.2)' }}>
          User-Agent: {navigator.userAgent}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }`}</style>
    </div>
  );
}

function Button({ onClick, label }) {
  return (
    <div style={{ textAlign:'center', marginTop:'20px' }}>
      <button onClick={onClick} style={{
        padding:'14px 28px', background:'radial-gradient(circle at 35% 35%, #ff6b6b, #ee5a24, #c0392b)',
        border:'none', color:'#fff', borderRadius:'14px', fontSize:'1rem', cursor:'pointer', fontWeight:'bold',
      }}>{label}</button>
    </div>
  );
}
