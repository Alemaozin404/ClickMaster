import { useEffect, useRef } from 'react';
import { getEffectiveCPS } from '../utils/gameLogic';

export function useAutoLoop(upgrades, addAutoEarnings) {
  const lastTimeRef = useRef(performance.now());
  const upgradesRef = useRef(upgrades);
  upgradesRef.current = upgrades;
  const addRef = useRef(addAutoEarnings);
  addRef.current = addAutoEarnings;

  useEffect(() => {
    let rafId;

    const loop = (timestamp) => {
      const dt = (timestamp - lastTimeRef.current) / 1000;
      if (dt >= 0.05) {
        const cps = getEffectiveCPS(upgradesRef.current);
        if (cps > 0) {
          addRef.current(cps * dt);
        }
        lastTimeRef.current = timestamp;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [addAutoEarnings]);
}
