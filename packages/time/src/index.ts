import type { SimulationEvent, EventBus } from '@cybersim/shared';

export interface TimeConfig {
  tickRate: number;
  maxSteps: number;
  realtime: boolean;
  startTime: number;
}

export interface TimeSnapshot {
  currentTick: number;
  wallTime: number;
  simulationTime: number;
  speed: number;
  paused: boolean;
}

export class SeededRNG {
  private state: bigint;
  private readonly inc: bigint;

  constructor(seed: number = Date.now()) {
    this.state = 0n;
    this.inc = BigInt((seed << 1) | 1);
    this.next(); // warm up
    this.next();
  }

  next(): number {
    const oldState = this.state;
    this.state = oldState * 6364136223846793005n + this.inc;
    const xorShift = ((oldState >> 18n) ^ oldState) >> 27n;
    const rot = oldState >> 59n;
    const result = (xorShift >> rot) | (xorShift << ((-rot) & 31n));
    return Number(result & 0xffffffffn) / 0x100000000;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = this.nextInt(0, 255);
    }
    return bytes;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      const tmp = result[i]!;
      result[i] = result[j]!;
      result[j] = tmp;
    }
    return result;
  }
}

export class DeterministicClock {
  private _tick: number = 0;
  private _simulationTime: number;
  private _wallStart: number;
  private _speed: number = 1;
  private _paused: boolean = false;
  private observers: Set<(snapshot: TimeSnapshot) => void> = new Set();

  constructor(private config: TimeConfig) {
    this._simulationTime = config.startTime;
    this._wallStart = Date.now();
  }

  get tick(): number { return this._tick; }
  get simulationTime(): number { return this._simulationTime; }
  get speed(): number { return this._speed; }
  get paused(): boolean { return this._paused; }

  setSpeed(speed: number): void {
    this._speed = Math.max(0, speed);
    this.notify();
  }

  pause(): void {
    this._paused = true;
    this.notify();
  }

  resume(): void {
    this._paused = false;
    this._wallStart = Date.now();
    this.notify();
  }

  step(): TimeSnapshot {
    if (this._paused) return this.snapshot();
    if (this._tick >= this.config.maxSteps) return this.snapshot();

    const elapsed = Date.now() - this._wallStart;
    const simElapsed = this.config.realtime ? elapsed * this._speed : this.config.tickRate;

    this._tick++;
    this._simulationTime += simElapsed;
    this._wallStart = Date.now();

    const snap = this.snapshot();
    this.notify();
    return snap;
  }

  snapshot(): TimeSnapshot {
    return {
      currentTick: this._tick,
      wallTime: Date.now(),
      simulationTime: this._simulationTime,
      speed: this._speed,
      paused: this._paused,
    };
  }

  onTick(observer: (snapshot: TimeSnapshot) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  private notify(): void {
    const snap = this.snapshot();
    for (const obs of this.observers) {
      try { obs(snap); } catch { /* swallow observer errors */ }
    }
  }

  reset(): void {
    this._tick = 0;
    this._simulationTime = this.config.startTime;
    this._wallStart = Date.now();
    this._paused = false;
    this._speed = 1;
    this.notify();
  }
}

export class TimeAuthority {
  private clock: DeterministicClock;
  private rng: SeededRNG;
  private checkpoints: Map<number, TimeSnapshot> = new Map();
  private eventLog: SimulationEvent[] = [];

  constructor(
    config: TimeConfig,
    seed?: number,
    private eventBus?: EventBus,
  ) {
    this.clock = new DeterministicClock(config);
    this.rng = new SeededRNG(seed ?? Date.now());
  }

  getClock(): DeterministicClock { return this.clock; }
  getRNG(): SeededRNG { return this.rng; }

  tick(): TimeSnapshot {
    const snap = this.clock.step();
    if (this.eventBus) {
      this.eventBus.publish({
        id: `time-tick-${snap.currentTick}`,
        type: 'time.tick',
        timestamp: snap.wallTime,
        payload: snap,
        metadata: { source: 'time-authority' },
      });
    }
    return snap;
  }

  checkpoint(label?: string): number {
    const id = this.clock.tick;
    this.checkpoints.set(id, this.clock.snapshot());
    if (this.eventBus) {
      this.eventBus.publish({
        id: `time-checkpoint-${id}`,
        type: 'time.checkpoint',
        timestamp: Date.now(),
        payload: { id, label, snapshot: this.clock.snapshot() },
        metadata: { source: 'time-authority', ...(label ? { tags: [label] } : {}) },
      });
    }
    return id;
  }

  restoreCheckpoint(id: number): boolean {
    const snap = this.checkpoints.get(id);
    if (!snap) return false;
    if (this.eventBus) {
      this.eventBus.publish({
        id: `time-rewind-${id}`,
        type: 'time.rewind',
        timestamp: Date.now(),
        payload: { from: this.clock.snapshot(), to: snap },
        metadata: { source: 'time-authority' },
      });
    }
    return true;
  }

  recordEvent(event: SimulationEvent): void {
    this.eventLog.push(event);
  }

  getEventLog(): SimulationEvent[] {
    return [...this.eventLog];
  }

  replayEvents(events: SimulationEvent[]): void {
    for (const event of events) {
      if (this.eventBus) {
        this.eventBus.publish(event);
      }
    }
  }

  reset(): void {
    this.clock.reset();
    this.rng = new SeededRNG(Date.now());
    this.checkpoints.clear();
  }
}

export function createDefaultTimeConfig(): TimeConfig {
  return {
    tickRate: 16, // ~60fps
    maxSteps: 1_000_000,
    realtime: true,
    startTime: 0,
  };
}
