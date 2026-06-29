export type UID = string & { readonly __brand: unique symbol };
export type Timestamp = number & { readonly __brand: unique symbol };
export type EntityId = string & { readonly __brand: unique symbol };
export type CorrelationId = string & { readonly __brand: unique symbol };

export function uid(): UID {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}` as UID;
}

export function timestamp(): Timestamp {
  return Date.now() as Timestamp;
}

export function entityId(): EntityId {
  return `ent-${uid()}` as EntityId;
}

export function correlationId(): CorrelationId {
  return `corr-${uid()}` as CorrelationId;
}

export interface Result<T, E = Error> {
  ok: true;
  value: T;
} | {
  ok: false;
  error: E;
}

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.ok) throw result.error;
  return result.value;
}

export interface Option<T> {
  readonly tag: 'some' | 'none';
  readonly value?: T;
}

export function some<T>(value: T): Option<T> {
  return { tag: 'some', value };
}

export function none<T>(): Option<T> {
  return { tag: 'none' };
}

export function match<T, R>(opt: Option<T>, onSome: (v: T) => R, onNone: () => R): R {
  return opt.tag === 'some' ? onSome(opt.value!) : onNone();
}

export type NonEmptyArray<T> = [T, ...T[]];

export function assertNonEmpty<T>(arr: T[]): NonEmptyArray<T> {
  if (arr.length === 0) throw new Error('Expected non-empty array');
  return arr as NonEmptyArray<T>;
}

export interface Range {
  start: number;
  end: number;
}

export function range(start: number, end: number): Range {
  return { start, end };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface Bounds2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Bounds3D extends Bounds2D {
  z: number;
  depth: number;
}