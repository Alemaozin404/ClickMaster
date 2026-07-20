import { useEffect } from 'react';
import { useParticleCanvas } from '../hooks/useParticleCanvas';

export default function ParticleCanvas({ onReady }) {
  const {
    canvasRef,
    spawnClick,
    spawnCrit,
    spawnUpgrade,
    spawnAchievement,
    spawnMilestone,
    spawnPrestige,
  } = useParticleCanvas();

  // Expose functions to parent via onReady callback
  useEffect(() => {
    if (onReady) {
      onReady({
        spawnClick,
        spawnCrit,
        spawnUpgrade,
        spawnAchievement,
        spawnMilestone,
        spawnPrestige,
      });
    }
  }, [onReady, spawnClick, spawnCrit, spawnUpgrade, spawnAchievement, spawnMilestone, spawnPrestige]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  );
}
