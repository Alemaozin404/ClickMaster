import { useCallback, useRef, useEffect } from 'react';

// ---- Particle Engine ----
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.rafId = null;
    this.lastTime = 0;

    this._resize();
    this._onResize = () => this._resize();
    window.addEventListener('resize', this._onResize);
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    this.ctx = null;
    this.canvas = null;
    this.particles = [];
  }

  _loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    if (this.particles.length > 0) {
      this._update(dt);
      this._render();
    } else {
      // Skip rendering when idle — just clear canvas briefly
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.rafId = requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.rotationSpeed * dt;
      p.scale += p.scaleSpeed * dt;

      if (p.trail && p.trail.length > 0) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) p.trail.shift();
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  _render() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);

      // Draw trail
      if (p.trail && p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.strokeStyle = p.color.replace('1)', `${alpha * 0.3})`);
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.scale(p.scale, p.scale);

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow
        if (p.glow) {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
          gradient.addColorStop(0, p.color.replace('1)', '0.3)'));
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      } else if (p.shape === 'star') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const spikes = 4;
        const outerR = p.size;
        const innerR = p.size * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          if (i === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
          else ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();

        if (p.glow) {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          gradient.addColorStop(0, p.color.replace('1)', '0.2)'));
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      } else if (p.shape === 'coin') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(-p.size * 0.2, -p.size * 0.3, p.size * 0.3, p.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // ---- Spawn Methods ----

  spawnClickBurst(x, y, color = '#4fc3f7', trail = false) {
    const count = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        gravity: 80,
        friction: 0.98,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 4,
        scale: 1,
        scaleSpeed: 0,
        shape: 'circle',
        glow: true,
        trail: [],
        maxTrail: trail ? 6 : 0,
      });
    }
  }

  spawnCritBurst(x, y) {
    const colors = ['rgba(255,215,0,1)', 'rgba(255,200,50,1)', 'rgba(255,180,0,1)', 'rgba(255,255,200,1)'];
    const count = 20 + Math.floor(Math.random() * 15);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 200;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        color,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1.0,
        gravity: 30,
        friction: 0.97,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 8,
        scale: 1,
        scaleSpeed: -0.3,
        shape: Math.random() > 0.5 ? 'star' : 'circle',
        glow: true,
        trail: [],
        maxTrail: 5,
      });
    }
  }

  spawnUpgradeSparkle(x, y) {
    const colors = ['rgba(79,195,247,1)', 'rgba(100,255,218,1)', 'rgba(255,215,0,1)'];
    const count = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        size: 1.5 + Math.random() * 2.5,
        color,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0,
        gravity: -20,
        friction: 0.99,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 6,
        scale: 1,
        scaleSpeed: -0.2,
        shape: 'star',
        glow: true,
        trail: [],
        maxTrail: 3,
      });
    }
  }

  spawnAchievementCelebration() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#ffd86f'];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvas.width;
      const y = -20 - Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 40,
        vy: 50 + Math.random() * 100,
        size: 4 + Math.random() * 6,
        color,
        life: 1.5 + Math.random() * 1.0,
        maxLife: 2.5,
        gravity: 30,
        friction: 0.99,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
        scale: 1,
        scaleSpeed: -0.1,
        shape: Math.random() > 0.5 ? 'circle' : 'star',
        glow: false,
        trail: [],
        maxTrail: 0,
      });
    }
  }

  spawnMilestoneConfetti() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#ffd86f'];
    const count = 40;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvas.width;
      const y = -20 - Math.random() * 200;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 60,
        vy: 80 + Math.random() * 150,
        size: 3 + Math.random() * 5,
        color,
        life: 2.0 + Math.random() * 1.5,
        maxLife: 3.5,
        gravity: 50,
        friction: 0.98,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 15,
        scale: 1,
        scaleSpeed: -0.05,
        shape: Math.random() > 0.6 ? 'star' : 'circle',
        glow: false,
        trail: [],
        maxTrail: 0,
      });
    }

    // Side bursts
    for (let i = 0; i < 2; i++) {
      const bx = i === 0 ? 0 : this.canvas.width;
      const by = Math.random() * this.canvas.height * 0.5;
      for (let j = 0; j < 8; j++) {
        const angle = (i === 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.2;
        const speed = 100 + Math.random() * 200;
        this.particles.push({
          x: bx, y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 50,
          size: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0 + Math.random() * 0.5,
          maxLife: 1.5,
          gravity: 100,
          friction: 0.99,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 8,
          scale: 1,
          scaleSpeed: -0.2,
          shape: 'circle',
          glow: true,
          trail: [],
          maxTrail: 0,
        });
      }
    }
  }

  spawnPrestigeEpic() {
    // Expanding ring
    for (let ring = 0; ring < 3; ring++) {
      const count = 30;
      const baseRadius = 100 + ring * 60;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: Math.cos(angle) * (200 + ring * 50),
          vy: Math.sin(angle) * (200 + ring * 50),
          size: 3 + ring * 1.5 - Math.random() * 2,
          color: `rgba(${100 + ring * 50}, ${200 - ring * 40}, 255, 1)`,
          life: 1.5 + ring * 0.3,
          maxLife: 2.0,
          gravity: 0,
          friction: 0.96,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 3,
          scale: 1,
          scaleSpeed: -0.5,
          shape: 'circle',
          glow: true,
          trail: [],
          maxTrail: 8,
        });
      }
    }

    // Center burst
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 300;
      const colors = ['rgba(255,215,0,1)', 'rgba(100,200,255,1)', 'rgba(200,100,255,1)', 'rgba(255,100,100,1)'];
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0 + Math.random() * 1.0,
        maxLife: 2.0,
        gravity: 20,
        friction: 0.98,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 6,
        scale: 1,
        scaleSpeed: -0.1,
        shape: Math.random() > 0.5 ? 'star' : 'circle',
        glow: true,
        trail: [],
        maxTrail: 3,
      });
    }
  }

  spawnAmbientCoins() {
    if (this.particles.filter(p => p.shape === 'coin').length > 15) return;
    const x = Math.random() * this.canvas.width;
    this.particles.push({
      x, y: this.canvas.height + 20,
      vx: (Math.random() - 0.5) * 10,
      vy: -(30 + Math.random() * 20),
      size: 5 + Math.random() * 3,
      color: 'rgba(255,215,0,0.3)',
      life: 5 + Math.random() * 3,
      maxLife: 8,
      gravity: -5,
      friction: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: 0.5,
      scale: 1,
      scaleSpeed: 0,
      shape: 'coin',
      glow: false,
      trail: [],
      maxTrail: 0,
    });
  }
}

// ---- React Hook ----
export function useParticleCanvas() {
  const engineRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize engine when canvas is mounted
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new ParticleEngine(canvasRef.current);
    engineRef.current = engine;
    engine.start();

    // Ambient coins
    const coinInterval = setInterval(() => {
      engine.spawnAmbientCoins();
    }, 2000);

    return () => {
      clearInterval(coinInterval);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const spawnClick = useCallback((x, y, color, trail) => {
    engineRef.current?.spawnClickBurst(x, y, color, trail);
  }, []);

  const spawnCrit = useCallback((x, y) => {
    engineRef.current?.spawnCritBurst(x, y);
  }, []);

  const spawnUpgrade = useCallback((x, y) => {
    engineRef.current?.spawnUpgradeSparkle(x, y);
  }, []);

  const spawnAchievement = useCallback(() => {
    engineRef.current?.spawnAchievementCelebration();
  }, []);

  const spawnMilestone = useCallback(() => {
    engineRef.current?.spawnMilestoneConfetti();
  }, []);

  const spawnPrestige = useCallback(() => {
    engineRef.current?.spawnPrestigeEpic();
  }, []);

  return {
    canvasRef,
    spawnClick,
    spawnCrit,
    spawnUpgrade,
    spawnAchievement,
    spawnMilestone,
    spawnPrestige,
  };
}
