import { describe, it, expect } from 'vitest';
import {
  uid, timestamp, entityId, correlationId,
  ok, err, unwrap,
  some, none, match,
  assertNonEmpty, range, clamp, lerp,
} from '../types/index.js';

describe('Branded IDs', () => {
  it('generates unique UIDs', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
    expect(typeof a).toBe('string');
  });

  it('generates timestamps', () => {
    const t = timestamp();
    expect(typeof t).toBe('number');
    expect(t).toBeGreaterThan(0);
  });

  it('generates entity IDs with prefix', () => {
    const e = entityId();
    expect(e).toMatch(/^ent-/);
  });

  it('generates correlation IDs with prefix', () => {
    const c = correlationId();
    expect(c).toMatch(/^corr-/);
  });
});

describe('Result type', () => {
  it('creates ok result', () => {
    const r = ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it('creates err result', () => {
    const r = err('oops');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('oops');
  });

  it('unwraps ok result', () => {
    expect(unwrap(ok(42))).toBe(42);
  });

  it('throws on unwrap err result', () => {
    expect(() => unwrap(err('fail'))).toThrow('fail');
  });
});

describe('Option type', () => {
  it('creates some', () => {
    const s = some('value');
    expect(s.tag).toBe('some');
    expect(s.value).toBe('value');
  });

  it('creates none', () => {
    const n = none();
    expect(n.tag).toBe('none');
  });

  it('matches some', () => {
    const result = match(some(42), (v) => v * 2, () => 0);
    expect(result).toBe(84);
  });

  it('matches none', () => {
    const result = match(none<number>(), (v) => v, () => -1);
    expect(result).toBe(-1);
  });
});

describe('Utilities', () => {
  it('asserts non-empty arrays', () => {
    expect(assertNonEmpty([1])).toEqual([1]);
    expect(() => assertNonEmpty([])).toThrow();
  });

  it('creates ranges', () => {
    const r = range(1, 10);
    expect(r.start).toBe(1);
    expect(r.end).toBe(10);
  });

  it('clamps values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('lerps values', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
  });
});
