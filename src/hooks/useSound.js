import { useCallback, useRef, useEffect, useState } from 'react';

// ---- Web Audio API Sound Engine ----
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicNodes = [];
    this.musicPlaying = false;
    this._initAttempted = false;
  }

  _ensureContext() {
    if (this.ctx) return this.ctx;
    if (this._initAttempted) return null;
    this._initAttempted = true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
      // SFX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.masterGain);
      // Music gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.15;
      this.musicGain.connect(this.masterGain);
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
      return null;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ---- SFX ----

  playClick() {
    const ctx = this._ensureContext();
    if (!ctx || !this.sfxGain) return;
    this.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);

    // Add a subtle noise layer
    this._playNoise(ctx, 0.05, 0.08);
  }

  playCrit() {
    const ctx = this._ensureContext();
    if (!ctx || !this.sfxGain) return;
    this.resume();

    // Ascending sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);

    // Sparkle (higher octave)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(ctx.currentTime + 0.02);
    osc2.stop(ctx.currentTime + 0.18);

    // Noise burst
    this._playNoise(ctx, 0.15, 0.12);
  }

  playUpgrade() {
    const ctx = this._ensureContext();
    if (!ctx || !this.sfxGain) return;
    this.resume();

    const notes = [523, 659]; // C5, E5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const startTime = ctx.currentTime + i * 0.1;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playAchievement() {
    const ctx = this._ensureContext();
    if (!ctx || !this.sfxGain) return;
    this.resume();

    // Ascending arpeggio
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const startTime = ctx.currentTime + i * 0.12;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });

    // Fanfare noise
    this._playNoise(ctx, 0.2, 0.4);
  }

  playMilestone() {
    const ctx = this._ensureContext();
    if (!ctx || !this.sfxGain) return;
    this.resume();

    // Chord
    const chord = [392, 494, 587, 740]; // G4, B4, D5, F#5
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    });

    // Roll
    this._playNoise(ctx, 0.15, 0.5);
  }

  playPrestige() {
    const ctx = this._ensureContext();
    if (!ctx || !this.sfxGain) return;
    this.resume();

    // Deep impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.0);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);

    // Ascending riser
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(400, ctx.currentTime + 0.3);
    osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 1.0);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 1.2);

    // Final hit
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain3.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc3.connect(gain3);
      gain3.connect(this.sfxGain);
      osc3.start(this.ctx.currentTime);
      osc3.stop(this.ctx.currentTime + 0.4);
    }, 1000);
  }

  // ---- Background Music ----

  startMusic() {
    const ctx = this._ensureContext();
    if (!ctx || !this.musicGain || this.musicPlaying) return;
    this.resume();
    this.musicPlaying = true;

    // Ambient pad using multiple slow oscillators
    const baseFreqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    const stop = false;

    baseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Slow volume modulation for movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.05 + i * 0.02, ctx.currentTime);
      lfoGain.gain.value = 0.3;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      // Slow frequency drift for warmth
      const lfo2 = ctx.createOscillator();
      const lfoGain2 = ctx.createGain();
      lfo2.frequency.setValueAtTime(0.03 + i * 0.015, ctx.currentTime);
      lfoGain2.gain.value = freq * 0.01;
      lfo2.connect(lfoGain2);
      lfoGain2.connect(osc.frequency);
      lfo2.start();

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start();

      this.musicNodes.push({ osc, gain, lfo, lfoGain, lfo2, lfoGain2 });
    });
  }

  stopMusic() {
    this.musicPlaying = false;
    this.musicNodes.forEach(({ osc, gain, lfo, lfoGain, lfo2, lfoGain2 }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.001, (this.ctx?.currentTime || 0) + 0.3);
        setTimeout(() => {
          try {
            osc.stop();
            lfo.stop();
            lfo2.stop();
          } catch (e) { /* ignore */ }
        }, 400);
      } catch (e) { /* ignore */ }
    });
    this.musicNodes = [];
  }

  setMusicVolume(vol) {
    if (this.musicGain) {
      this.musicGain.gain.value = vol;
    }
  }

  setSfxVolume(vol) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = vol;
    }
  }

  // ---- Helpers ----

  _playNoise(ctx, volume, duration) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    source.start(ctx.currentTime);
  }

  destroy() {
    this.stopMusic();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// ---- React Hook ----
export function useSound() {
  const engineRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('clickmaster_sound') !== 'false';
    } catch (e) {
      return true;
    }
  });
  const [musicEnabled, setMusicEnabled] = useState(() => {
    try {
      return localStorage.getItem('clickmaster_music') !== 'false';
    } catch (e) {
      return true;
    }
  });

  // Lazy init engine
  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SoundEngine();
    }
    return engineRef.current;
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem('clickmaster_sound', next ? 'true' : 'false'); } catch (e) { /* ignore */ }
      if (next) {
        getEngine().resume();
        getEngine().setSfxVolume(0.6);
      } else {
        getEngine().setSfxVolume(0);
      }
      return next;
    });
  }, [getEngine]);

  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem('clickmaster_music', next ? 'true' : 'false'); } catch (e) { /* ignore */ }
      const engine = getEngine();
      if (next) {
        engine.setMusicVolume(0.15);
        engine.startMusic();
      } else {
        engine.setMusicVolume(0);
        engine.stopMusic();
      }
      return next;
    });
  }, [getEngine]);

  // First interaction ref - starts music on first user click
  const firstInteractionRef = useRef(true);

  const _tryStartMusic = useCallback(() => {
    if (!musicEnabled) return;
    const engine = getEngine();
    engine.startMusic();
  }, [musicEnabled, getEngine]);

  // Play SFX (only if sound enabled)
  const playClick = useCallback(() => {
    // Start music on first user interaction
    if (firstInteractionRef.current) {
      firstInteractionRef.current = false;
      _tryStartMusic();
    }
    if (soundEnabled) {
      getEngine().playClick();
    }
  }, [soundEnabled, getEngine, _tryStartMusic]);

  const playCrit = useCallback(() => {
    if (firstInteractionRef.current) {
      firstInteractionRef.current = false;
      _tryStartMusic();
    }
    if (soundEnabled) {
      getEngine().playCrit();
    }
  }, [soundEnabled, getEngine, _tryStartMusic]);

  const playUpgrade = useCallback(() => {
    if (!soundEnabled) return;
    getEngine().playUpgrade();
  }, [soundEnabled, getEngine]);

  const playAchievement = useCallback(() => {
    if (!soundEnabled) return;
    getEngine().playAchievement();
  }, [soundEnabled, getEngine]);

  const playMilestone = useCallback(() => {
    if (!soundEnabled) return;
    getEngine().playMilestone();
  }, [soundEnabled, getEngine]);

  const playPrestige = useCallback(() => {
    if (!soundEnabled) return;
    getEngine().playPrestige();
  }, [soundEnabled, getEngine]);

  // Stop music when musicEnabled becomes false
  const prevMusicEnabled = useRef(musicEnabled);
  useEffect(() => {
    if (prevMusicEnabled.current === true && musicEnabled === false) {
      getEngine().stopMusic();
    }
    if (prevMusicEnabled.current === false && musicEnabled === true) {
      if (!firstInteractionRef.current) {
        getEngine().startMusic();
      }
    }
    prevMusicEnabled.current = musicEnabled;
  }, [musicEnabled, getEngine]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Init sound volumes
  useEffect(() => {
    const engine = getEngine();
    engine.setSfxVolume(soundEnabled ? 0.6 : 0);
    engine.setMusicVolume(musicEnabled ? 0.15 : 0);
  }, [getEngine]);

  return {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    playClick,
    playCrit,
    playUpgrade,
    playAchievement,
    playMilestone,
    playPrestige,
  };
}
