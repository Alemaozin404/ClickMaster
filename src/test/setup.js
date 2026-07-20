import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Web Audio API
class MockAudioContext {
  constructor() { this.state = 'running'; }
  resume() {}
  close() {}
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      connect: vi.fn(() => this),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      connect: vi.fn(() => this),
    };
  }
  createBiquadFilter() {
    return {
      type: 'highpass',
      frequency: { value: 2000 },
      connect: vi.fn(() => this),
    };
  }
  createBuffer(channels, length, sampleRate) {
    return {
      sampleRate,
      length,
      numberOfChannels: channels,
      getChannelData: vi.fn(() => new Float32Array(length)),
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(() => this),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  get currentTime() { return 0; }
  get sampleRate() { return 44100; }
}

window.AudioContext = MockAudioContext;
window.webkitAudioContext = MockAudioContext;

// Mock requestAnimationFrame
let rafId = 0;
window.requestAnimationFrame = vi.fn((cb) => {
  rafId++;
  setTimeout(() => cb(performance.now()), 16);
  return rafId;
});
window.cancelAnimationFrame = vi.fn((id) => {});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
