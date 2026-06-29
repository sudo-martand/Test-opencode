import type { UID } from '@cybersim/shared';
import { uid } from '@cybersim/shared';

// ── Types ────────────────────────────────────────────────────────────────

export type GainValue = number & { readonly __brand: 'gain' };
export type Frequency = number & { readonly __brand: 'freq' };
export type Duration = number & { readonly __brand: 'duration' };

export function gain(value: number): GainValue {
  return Math.max(0, Math.min(1, value)) as GainValue;
}

export function frequency(value: number): Frequency {
  return Math.max(20, Math.min(20000, value)) as Frequency;
}

export function duration(ms: number): Duration {
  return Math.max(0, ms) as Duration;
}

export type SpatialPosition = {
  x: number;
  y: number;
  z: number;
};

export interface SoundConfig {
  masterVolume: GainValue;
  spatialEnabled: boolean;
  sampleRate: number;
  bufferSize: number;
}

export type SoundLayer = 'ambient' | 'keystroke' | 'alert' | 'notification' | 'sonification';

export interface SoundInstance {
  readonly id: UID;
  readonly layer: SoundLayer;
  readonly gain: GainValue;
  start(): void;
  stop(): void;
  setVolume(g: GainValue): void;
  setPosition(pos: SpatialPosition): void;
  dispose(): void;
}

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export interface EnvelopeConfig {
  attack: number;
  decay: number;
  sustain: GainValue;
  release: number;
}

export interface KeystrokeSoundConfig {
  clickFreq: Frequency;
  clickDuration: Duration;
  bottomOutFreq: Frequency;
  bottomOutDuration: Duration;
  releaseFreq: Frequency;
  releaseDuration: Duration;
  volume: GainValue;
}

export interface AlertSoundConfig {
  oscillator: OscillatorType;
  frequencies: Frequency[];
  duration: Duration;
  interval: Duration;
  repetitions: number;
  volume: GainValue;
  envelope?: EnvelopeConfig;
}

// ── Defaults ─────────────────────────────────────────────────────────────

export const defaultSoundConfig: SoundConfig = {
  masterVolume: gain(0.7),
  spatialEnabled: false,
  sampleRate: 48000,
  bufferSize: 128,
};

export const defaultKeystrokeConfig: KeystrokeSoundConfig = {
  clickFreq: frequency(2000),
  clickDuration: duration(4),
  bottomOutFreq: frequency(800),
  bottomOutDuration: duration(6),
  releaseFreq: frequency(3000),
  releaseDuration: duration(3),
  volume: gain(0.15),
};

export const mechanicalSwitchPresets = {
  cherryMXBlue: {
    clickFreq: frequency(2500),
    clickDuration: duration(5),
    bottomOutFreq: frequency(1000),
    bottomOutDuration: duration(8),
    releaseFreq: frequency(3500),
    releaseDuration: duration(4),
    volume: gain(0.2),
  },
  cherryMXBrown: {
    clickFreq: frequency(1800),
    clickDuration: duration(3),
    bottomOutFreq: frequency(600),
    bottomOutDuration: duration(5),
    releaseFreq: frequency(2200),
    releaseDuration: duration(3),
    volume: gain(0.12),
  },
  bucklingSpring: {
    clickFreq: frequency(3000),
    clickDuration: duration(6),
    bottomOutFreq: frequency(1200),
    bottomOutDuration: duration(10),
    releaseFreq: frequency(4000),
    releaseDuration: duration(5),
    volume: gain(0.25),
  },
};

export const defaultAlertConfig: AlertSoundConfig = {
  oscillator: 'sine',
  frequencies: [frequency(880), frequency(880), frequency(880)],
  duration: duration(150),
  interval: duration(100),
  repetitions: 3,
  volume: gain(0.4),
  envelope: { attack: 0.01, decay: 0.1, sustain: gain(0.3), release: 0.05 },
};

export const alertPresets = {
  critical: {
    oscillator: 'square' as OscillatorType,
    frequencies: [frequency(440), frequency(880), frequency(440), frequency(880)],
    duration: duration(200),
    interval: duration(50),
    repetitions: 5,
    volume: gain(0.6),
    envelope: { attack: 0.005, decay: 0.05, sustain: gain(0.5), release: 0.1 },
  },
  warning: {
    oscillator: 'sawtooth' as OscillatorType,
    frequencies: [frequency(660), frequency(550)],
    duration: duration(100),
    interval: duration(200),
    repetitions: 2,
    volume: gain(0.3),
    envelope: { attack: 0.01, decay: 0.08, sustain: gain(0.3), release: 0.05 },
  },
  notification: {
    oscillator: 'sine' as OscillatorType,
    frequencies: [frequency(880), frequency(1320)],
    duration: duration(80),
    interval: duration(0),
    repetitions: 1,
    volume: gain(0.2),
    envelope: { attack: 0.005, decay: 0.1, sustain: gain(0.2), release: 0.05 },
  },
};

// ── SoundEngine ──────────────────────────────────────────────────────────

export class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private panner: StereoPannerNode | null = null;
  private activeInstances: Map<UID, SoundInstanceImpl> = new Map();
  private ambientNodes: Map<string, AmbientSource> = new Map();
  private _initialized: boolean = false;

  public readonly config: SoundConfig;

  constructor(config?: Partial<SoundConfig>) {
    this.config = { ...defaultSoundConfig, ...config };
  }

  get initialized(): boolean {
    return this._initialized;
  }

  async init(): Promise<void> {
    if (this._initialized) return;
    this.audioCtx = new AudioContext({
      sampleRate: this.config.sampleRate,
      latencyHint: 'interactive',
    });

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this.config.masterVolume;
    this.masterGain.connect(this.audioCtx.destination);

    if (this.config.spatialEnabled) {
      this.panner = this.audioCtx.createStereoPanner();
      this.panner.connect(this.masterGain);
    }

    this._initialized = true;
  }

  private ensureCtx(): AudioContext {
    if (!this.audioCtx) throw new Error('SoundEngine not initialized. Call init() first.');
    return this.audioCtx;
  }

  setMasterVolume(v: GainValue): void {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(v, this.ensureCtx().currentTime, 0.02);
    }
  }

  // ── Keystroke sounds ──────────────────────────────────────────────

  playKeystroke(config?: Partial<KeystrokeSoundConfig>): void {
    const cfg = { ...defaultKeystrokeConfig, ...config };
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.value = cfg.clickFreq;
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(cfg.volume, now + 0.001);
    clickGain.gain.linearRampToValueAtTime(0, now + cfg.clickDuration / 1000);
    clickOsc.connect(clickGain);
    clickGain.connect(this.getOutput());
    clickOsc.start(now);
    clickOsc.stop(now + cfg.clickDuration / 1000 + 0.01);

    const bottomOsc = ctx.createOscillator();
    const bottomGain = ctx.createGain();
    bottomOsc.type = 'sine';
    bottomOsc.frequency.value = cfg.bottomOutFreq;
    bottomGain.gain.setValueAtTime(0, now + 0.002);
    bottomGain.gain.linearRampToValueAtTime(cfg.volume * 0.6, now + 0.003);
    bottomGain.gain.linearRampToValueAtTime(0, now + 0.003 + cfg.bottomOutDuration / 1000);
    bottomOsc.connect(bottomGain);
    bottomGain.connect(this.getOutput());
    bottomOsc.start(now);
    bottomOsc.stop(now + cfg.bottomOutDuration / 1000 + 0.01);
  }

  playRelease(config?: Partial<KeystrokeSoundConfig>): void {
    const cfg = { ...defaultKeystrokeConfig, ...config };
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = cfg.releaseFreq;
    gainNode.gain.setValueAtTime(cfg.volume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + cfg.releaseDuration / 1000);
    osc.connect(gainNode);
    gainNode.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + cfg.releaseDuration / 1000 + 0.01);
  }

  // ── Alert / alarm ─────────────────────────────────────────────────

  playAlert(config?: Partial<AlertSoundConfig>): SoundInstance {
    const cfg = { ...defaultAlertConfig, ...config };
    const ctx = this.ensureCtx();
    const id = uid();

    const impl = new SoundInstanceImpl(id, 'alert', cfg.volume, {
      start: () => {
        this.playAlertSequence(cfg);
      },
      stop: () => {
        this.dispose();
      },
      setVolume: (g: GainValue) => { cfg.volume = g; },
      setPosition: () => {},
    });

    this.activeInstances.set(id, impl);
    impl.start();
    return impl;
  }

  private playAlertSequence(cfg: AlertSoundConfig): void {
    const ctx = this.ensureCtx();
    let offset = 0;

    for (let r = 0; r < cfg.repetitions; r++) {
      for (const freq of cfg.frequencies) {
        const now = ctx.currentTime + offset / 1000;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = cfg.oscillator;
        osc.frequency.value = freq;

        if (cfg.envelope) {
          const env = cfg.envelope;
          const dur = cfg.duration / 1000;
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(cfg.volume, now + env.attack);
          gainNode.gain.linearRampToValueAtTime(cfg.volume * env.sustain, now + env.decay);
          gainNode.gain.linearRampToValueAtTime(0, now + dur - env.release);
          gainNode.gain.setValueAtTime(0, now + dur);
        }

        osc.connect(gainNode);
        gainNode.connect(this.getOutput());
        osc.start(now);
        osc.stop(now + cfg.duration / 1000);
        offset += cfg.duration + cfg.interval;
      }
    }
  }

  // ── Ambient sounds ────────────────────────────────────────────────

  startAmbient(id: string): void {
    if (this.ambientNodes.has(id)) return;

    const source = this.createAmbientSource(id);
    if (source) {
      this.ambientNodes.set(id, source);
      source.start();
    }
  }

  stopAmbient(id: string): void {
    const source = this.ambientNodes.get(id);
    if (source) {
      source.stop();
      this.ambientNodes.delete(id);
    }
  }

  private createAmbientSource(id: string): AmbientSource | undefined {
    const ctx = this.ensureCtx();

    if (id === 'datacenter') {
      return createDcAmbient(ctx, this.getOutput());
    }
    if (id === 'whiteNoise') {
      return createWhiteNoise(ctx, this.getOutput());
    }
    if (id === 'hum') {
      return createHum(ctx, this.getOutput());
    }
    return undefined;
  }

  // ── Sonification ─────────────────────────────────────────────────

  playTone(freq: Frequency, durationMs: number, type: OscillatorType = 'sine'): SoundInstance {
    const ctx = this.ensureCtx();
    const id = uid();
    const now = ctx.currentTime;
    const dur = durationMs / 1000;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.setValueAtTime(0.3, now + dur - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + dur);

    osc.connect(gainNode);
    gainNode.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + dur + 0.01);

    const impl = new SoundInstanceImpl(id, 'sonification', gain(0.3), {
      start: () => {},
      stop: () => { osc.stop(); osc.disconnect(); },
      setVolume: (g: GainValue) => { gainNode.gain.value = g; },
      setPosition: () => {},
    });
    return impl;
  }

  playShepardGlissando(durationMs: number = 3000): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const dur = durationMs / 1000;
    const layers = 4;

    for (let i = 0; i < layers; i++) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 55 * Math.pow(2, i);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 2, now + dur);

      const fadeIn = (i / layers) * 0.3;
      const fadeOut = 1 - (i / layers) * 0.3;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + fadeIn);
      gainNode.gain.setValueAtTime(0.15, now + dur * fadeOut);
      gainNode.gain.linearRampToValueAtTime(0, now + dur);

      osc.connect(gainNode);
      gainNode.connect(this.getOutput());
      osc.start(now);
      osc.stop(now + dur + 0.01);
    }
  }

  // ── Spatial audio ────────────────────────────────────────────────

  setListenerPosition(pos: SpatialPosition): void {
    if (!this.panner) return;
    const ctx = this.ensureCtx();
    if (ctx.listener.positionX) {
      ctx.listener.positionX.setValueAtTime(pos.x, ctx.currentTime);
      ctx.listener.positionY.setValueAtTime(pos.y, ctx.currentTime);
      ctx.listener.positionZ.setValueAtTime(pos.z, ctx.currentTime);
    }
  }

  // ── Utilities ─────────────────────────────────────────────────────

  private getOutput(): AudioNode {
    return this.panner ?? this.masterGain ?? this.ensureCtx().destination;
  }

  async dispose(): Promise<void> {
    for (const [, inst] of this.activeInstances) {
      inst.stop();
    }
    this.activeInstances.clear();
    for (const [, source] of this.ambientNodes) {
      source.stop();
    }
    this.ambientNodes.clear();

    if (this.audioCtx) {
      await this.audioCtx.close();
    }
    this.audioCtx = null;
    this._initialized = false;
  }

  get activeCount(): number {
    return this.activeInstances.size;
  }
}

// ── Internal implementations ─────────────────────────────────────────────

interface InstanceControls {
  start: () => void;
  stop: () => void;
  setVolume: (g: GainValue) => void;
  setPosition: (pos: SpatialPosition) => void;
}

class SoundInstanceImpl implements SoundInstance {
  readonly id: UID;
  readonly layer: SoundLayer;
  readonly gain: GainValue;
  private controls: InstanceControls;
  private _disposed: boolean = false;

  constructor(id: UID, layer: SoundLayer, gain: GainValue, controls: InstanceControls) {
    this.id = id;
    this.layer = layer;
    this.gain = gain;
    this.controls = controls;
  }

  start(): void { this.controls.start(); }
  stop(): void { this.controls.stop(); }
  setVolume(g: GainValue): void { this.controls.setVolume(g); }
  setPosition(pos: SpatialPosition): void { this.controls.setPosition(pos); }
  dispose(): void { if (!this._disposed) { this._disposed = true; this.stop(); } }
}

interface AmbientSource {
  start(): void;
  stop(): void;
}

function createDcAmbient(ctx: AudioContext, output: AudioNode): AmbientSource {
  let running = false;
  const nodes: AudioNode[] = [];

  return {
    start() {
      if (running) return;
      running = true;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = Math.sin(2 * Math.PI * 120 * t) * 0.08 +
          Math.sin(2 * Math.PI * 240 * t) * 0.03 +
          Math.sin(2 * Math.PI * 180 * t) * 0.02 +
          (Math.random() - 0.5) * 0.01;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.12;
      source.connect(gainNode);
      gainNode.connect(output);

      source.start();
      nodes.push(source, gainNode);
    },
    stop() {
      running = false;
      for (const n of nodes) {
        try {
          if (n instanceof AudioScheduledSourceNode) n.stop();
          n.disconnect();
        } catch { /* already stopped */ }
      }
      nodes.length = 0;
    },
  };
}

function createWhiteNoise(ctx: AudioContext, output: AudioNode): AmbientSource {
  let running = false;
  const nodes: AudioNode[] = [];

  return {
    start() {
      if (running) return;
      running = true;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() - 0.5) * 0.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.03;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      source.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(output);
      source.start();
      nodes.push(source, gainNode, filter);
    },
    stop() {
      running = false;
      for (const n of nodes) {
        try {
          if (n instanceof AudioScheduledSourceNode) n.stop();
          n.disconnect();
        } catch { /* already stopped */ }
      }
      nodes.length = 0;
    },
  };
}

function createHum(ctx: AudioContext, output: AudioNode): AmbientSource {
  let running = false;
  const nodes: AudioNode[] = [];

  return {
    start() {
      if (running) return;
      running = true;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 60;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.05;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      filter.Q.value = 0.5;

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(output);
      osc.start();
      nodes.push(osc, gainNode, filter);
    },
    stop() {
      running = false;
      for (const n of nodes) {
        try {
          if (n instanceof AudioScheduledSourceNode) n.stop();
          n.disconnect();
        } catch { /* already stopped */ }
      }
      nodes.length = 0;
    },
  };
}

// ── AudioWorklet setup ───────────────────────────────────────────────────

export const audioWorkletCode = `
class CyberSimProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
    this.port.onmessage = (event) => {
      this.port.postMessage({ type: 'ready' });
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if (!output || !output[0]) return true;

    const channel = output[0];
    for (let i = 0; i < channel.length; i++) {
      channel[i] = 0;
    }
    return true;
  }
}

registerProcessor('cybersim-processor', CyberSimProcessor);
`;

export async function registerAudioWorklet(audioCtx: AudioContext): Promise<void> {
  const blob = new Blob([audioWorkletCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  await audioCtx.audioWorklet.addModule(url);
  URL.revokeObjectURL(url);
}

// ── Singleton ────────────────────────────────────────────────────────────

let defaultEngine: SoundEngine | null = null;

export function getSoundEngine(config?: Partial<SoundConfig>): SoundEngine {
  if (!defaultEngine) {
    defaultEngine = new SoundEngine(config);
  }
  return defaultEngine;
}

export async function initSound(): Promise<SoundEngine> {
  const engine = getSoundEngine();
  await engine.init();
  return engine;
}
