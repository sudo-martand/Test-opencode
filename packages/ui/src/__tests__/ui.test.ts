import { describe, it, expect } from 'vitest';
import { cx } from '../index';

describe('cx', () => {
  it('joins class names', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cx('a', undefined, 'b', null, 'c', false, '', 0 as unknown as string)).toBe('a b c');
  });

  it('handles empty input', () => {
    expect(cx()).toBe('');
  });

  it('flattens arrays', () => {
    expect(cx(['a', 'b'], ['c'])).toBe('a b c');
  });

  it('handles nested arrays', () => {
    expect(cx(['a', ['b', 'c']])).toBe('a b c');
  });

  it('filters falsy values in nested arrays', () => {
    expect(cx(['a', undefined, null, false, ''])).toBe('a');
  });

  it('handles single string', () => {
    expect(cx('only')).toBe('only');
  });
});
