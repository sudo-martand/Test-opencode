import { describe, it, expect } from 'vitest';
import {
  sha256,
  hmac,
  constantTimeEqual,
  randomBytes,
  randomHex,
  randomInt,
  generateKey,
  generateHmacKey,
  aesGcmEncrypt,
  aesGcmDecrypt,
  pbkdf2DeriveKey,
} from '../crypto';

describe('sha256', () => {
  it('hashes a string', async () => {
    const hash = await sha256('hello');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces known output for empty string', async () => {
    const hash = await sha256('');
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('hashes Uint8Array input', async () => {
    const data = new Uint8Array([104, 101, 108, 108, 111]);
    const hash = await sha256(data);
    expect(hash).toHaveLength(64);
  });

  it('is deterministic', async () => {
    const a = await sha256('test');
    const b = await sha256('test');
    expect(a).toBe(b);
  });

  it('produces different hashes for different inputs', async () => {
    const a = await sha256('abc');
    const b = await sha256('xyz');
    expect(a).not.toBe(b);
  });
});

describe('hmac', () => {
  it('produces a hex string', async () => {
    const key = new Uint8Array(32).fill(0x0b);
    const result = await hmac(key, 'test');
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it('accepts Uint8Array data', async () => {
    const key = new Uint8Array(32).fill(0x0b);
    const data = new Uint8Array([1, 2, 3]);
    const result = await hmac(key, data);
    expect(result).toHaveLength(64);
  });

  it('is deterministic', async () => {
    const key = new Uint8Array(32).fill(0x0b);
    const a = await hmac(key, 'data');
    const b = await hmac(key, 'data');
    expect(a).toBe(b);
  });
});

describe('constantTimeEqual', () => {
  it('returns true for equal arrays', () => {
    expect(constantTimeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
  });

  it('returns false for different arrays', () => {
    expect(constantTimeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
  });

  it('returns false for different length arrays', () => {
    expect(constantTimeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });

  it('returns true for empty arrays', () => {
    expect(constantTimeEqual(new Uint8Array(0), new Uint8Array(0))).toBe(true);
  });
});

describe('randomBytes', () => {
  it('returns buffer of correct length', () => {
    expect(randomBytes(16)).toHaveLength(16);
    expect(randomBytes(0)).toHaveLength(0);
    expect(randomBytes(32)).toHaveLength(32);
  });

  it('produces different values each call', () => {
    const a = randomBytes(16);
    const b = randomBytes(16);
    expect(a).not.toEqual(b);
  });
});

describe('randomHex', () => {
  it('returns hex string of specified length', () => {
    expect(randomHex(8)).toHaveLength(8);
    expect(randomHex(64)).toHaveLength(64);
    expect(randomHex(0)).toBe('');
  });

  it('only contains hex characters', () => {
    const hex = randomHex(32);
    expect(hex).toMatch(/^[0-9a-f]+$/);
  });
});

describe('randomInt', () => {
  it('returns number within range', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomInt(0, 10);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  it('returns min when min === max', () => {
    expect(randomInt(5, 5)).toBe(5);
  });
});

describe('generateKey', () => {
  it('generates AES-GCM key', async () => {
    const k = await generateKey('AES-GCM', true);
    expect(k.algorithm).toBe('AES-GCM');
    expect(k.key).toHaveLength(32);
    expect(k.usages).toContain('encrypt');
    expect(k.usages).toContain('decrypt');
  });
});

describe('generateHmacKey', () => {
  it('generates HMAC key of specified length', async () => {
    const k = await generateHmacKey(32);
    expect(k.algorithm).toBe('HMAC-SHA256');
    expect(k.key).toHaveLength(32);
    expect(k.usages).toContain('sign');
  });
});

describe('aesGcmEncrypt/aesGcmDecrypt', () => {
  it('encrypts and decrypts successfully', async () => {
    const key = randomBytes(32);
    const plaintext = new Uint8Array([1, 2, 3, 4, 5]);
    const encrypted = await aesGcmEncrypt(key, plaintext);
    expect(encrypted.ciphertext).not.toEqual(plaintext);
    expect(encrypted.iv).toHaveLength(12);
    expect(encrypted.tag).toHaveLength(16);

    const decrypted = await aesGcmDecrypt(key, encrypted);
    expect(decrypted).toEqual(plaintext);
  });

  it('encrypts and decrypts with additional data', async () => {
    const key = randomBytes(32);
    const plaintext = new TextEncoder().encode('secret message');
    const aad = new TextEncoder().encode('header-data');
    const encrypted = await aesGcmEncrypt(key, plaintext, aad);
    const decrypted = await aesGcmDecrypt(key, encrypted, aad);
    expect(decrypted).toEqual(plaintext);
  });

  it('fails to decrypt with wrong key', async () => {
    const key = randomBytes(32);
    const wrongKey = randomBytes(32);
    const plaintext = new TextEncoder().encode('test');
    const encrypted = await aesGcmEncrypt(key, plaintext);
    await expect(aesGcmDecrypt(wrongKey, encrypted)).rejects.toThrow();
  });

  it('handles empty plaintext', async () => {
    const key = randomBytes(32);
    const plaintext = new Uint8Array(0);
    const encrypted = await aesGcmEncrypt(key, plaintext);
    const decrypted = await aesGcmDecrypt(key, encrypted);
    expect(decrypted).toEqual(plaintext);
  });
});

describe('pbkdf2DeriveKey', () => {
  it('derives a key of specified length', async () => {
    const salt = new Uint8Array(16).fill(0x01);
    const derived = await pbkdf2DeriveKey('password', salt, 10);
    expect(derived).toHaveLength(32);
  });

  it('is deterministic', async () => {
    const salt = new Uint8Array(16).fill(0x01);
    const a = await pbkdf2DeriveKey('password', salt, 10);
    const b = await pbkdf2DeriveKey('password', salt, 10);
    expect(a).toEqual(b);
  });

  it('produces different output for different passwords', async () => {
    const salt = new Uint8Array(16).fill(0x01);
    const a = await pbkdf2DeriveKey('password1', salt, 10);
    const b = await pbkdf2DeriveKey('password2', salt, 10);
    expect(a).not.toEqual(b);
  });
});
