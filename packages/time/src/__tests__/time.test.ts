import { describe, it, expect } from 'vitest';
import { SeededRNG, DeterministicClock, TimeAuthority, createDefaultTimeConfig } from '../index.js';

describe('SeededRNG', () => {
  it('produces deterministic output', () => {
    const a = new SeededRNG(42);
    const b = new SeededRNG(42);
    for (let i = 0; i < 100; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it('produces values in [0, 1)', () => {
    const rng = new SeededRNG(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('generates integers in range', () => {
    const rng = new SeededRNG(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng.nextInt(5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it('generates random bytes', () => {
    const rng = new SeededRNG(42);
    const bytes = rng.nextBytes(32);
    expect(bytes).toHaveLength(32);
  });

  it('shuffles arrays deterministically', () => {
    const a = new SeededRNG(42);
    const b = new SeededRNG(42);
    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [1, 2, 3, 4, 5];
    expect(a.shuffle(arr1)).toEqual(b.shuffle(arr2));
  });

  it('different seeds produce different output', () => {
    const a = new SeededRNG(1);
    const b = new SeededRNG(2);
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(a.next() !== b.next());
    }
    expect(results.some(Boolean)).toBe(true);
  });
});

describe('DeterministicClock', () => {
  it('initializes with correct state', () => {
    const config = createDefaultTimeConfig();
    const clock = new DeterministicClock(config);
    const snap = clock.snapshot();
    expect(snap.currentTick).toBe(0);
    expect(snap.simulationTime).toBe(0);
    expect(snap.speed).toBe(1);
    expect(snap.paused).toBe(false);
  });

  it('increments tick on step', () => {
    const clock = new DeterministicClock(createDefaultTimeConfig());
    clock.step();
    expect(clock.tick).toBe(1);
    clock.step();
    expect(clock.tick).toBe(2);
  });

  it('respects pause', () => {
    const clock = new DeterministicClock(createDefaultTimeConfig());
    clock.pause();
    expect(clock.paused).toBe(true);
    const before = clock.snapshot();
    clock.step();
    const after = clock.snapshot();
    expect(before.currentTick).toBe(after.currentTick);
  });

  it('respects resume', () => {
    const clock = new DeterministicClock(createDefaultTimeConfig());
    clock.pause();
    clock.resume();
    expect(clock.paused).toBe(false);
  });

  it('notifies observers on step', () => {
    const clock = new DeterministicClock(createDefaultTimeConfig());
    let notified = false;
    clock.onTick(() => { notified = true; });
    clock.step();
    expect(notified).toBe(true);
  });

  it('supports speed changes', () => {
    const clock = new DeterministicClock(createDefaultTimeConfig());
    clock.setSpeed(2);
    expect(clock.speed).toBe(2);
  });

  it('resets correctly', () => {
    const clock = new DeterministicClock(createDefaultTimeConfig());
    clock.step();
    clock.step();
    clock.step();
    clock.reset();
    expect(clock.tick).toBe(0);
    expect(clock.speed).toBe(1);
    expect(clock.paused).toBe(false);
  });

  it('stops at max steps', () => {
    const config = createDefaultTimeConfig();
    config.maxSteps = 2;
    const clock = new DeterministicClock(config);
    clock.step();
    clock.step();
    clock.step(); // should be no-op
    expect(clock.tick).toBe(2);
  });
});

describe('TimeAuthority', () => {
  it('integrates clock and RNG', () => {
    const authority = new TimeAuthority(createDefaultTimeConfig(), 42);
    expect(authority.getClock()).toBeInstanceOf(DeterministicClock);
    expect(authority.getRNG()).toBeInstanceOf(SeededRNG);
  });

  it('creates checkpoints', () => {
    const authority = new TimeAuthority(createDefaultTimeConfig(), 42);
    const id = authority.checkpoint('test');
    expect(typeof id).toBe('number');
  });

  it('tick integrates with clock', () => {
    const authority = new TimeAuthority(createDefaultTimeConfig(), 42);
    const snap = authority.tick();
    expect(snap.currentTick).toBe(1);
  });

  it('resets cleanly', () => {
    const authority = new TimeAuthority(createDefaultTimeConfig(), 42);
    authority.tick();
    authority.tick();
    authority.reset();
    expect(authority.getClock().tick).toBe(0);
  });
});
