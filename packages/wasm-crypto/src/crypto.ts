export interface CryptoKey {
  algorithm: string;
  key: Uint8Array;
  usages: Array<'encrypt' | 'decrypt' | 'sign' | 'verify'>;
}

export interface AesGcmEncrypted {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  tag: Uint8Array;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256(data: Uint8Array | string): Promise<string> {
  const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await globalThis.crypto.subtle.digest('SHA-256', input);
  return bytesToHex(new Uint8Array(hash));
}

export async function hmac(key: Uint8Array, data: Uint8Array | string): Promise<string> {
  const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', cryptoKey, input);
  return bytesToHex(new Uint8Array(signature));
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i]! ^ b[i]!;
  }
  return result === 0;
}

export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

export function randomHex(length: number): string {
  return bytesToHex(randomBytes(Math.ceil(length / 2))).slice(0, length);
}

export function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytes = randomBytes(4);
  const value = new DataView(bytes.buffer).getUint32(0, true);
  return min + (value % range);
}

export async function generateKey(algorithm: string = 'AES-GCM', extractable: boolean = false): Promise<CryptoKey> {
  if (algorithm === 'AES-GCM') {
    const key = await globalThis.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      extractable,
      ['encrypt', 'decrypt'],
    );
    const raw = await globalThis.crypto.subtle.exportKey('raw', key);
    return {
      algorithm: 'AES-GCM',
      key: new Uint8Array(raw),
      usages: ['encrypt', 'decrypt'],
    };
  }
  throw new Error(`Unsupported algorithm: ${algorithm}`);
}

export async function generateHmacKey(length: number = 32): Promise<CryptoKey> {
  const key = await globalThis.crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-256', length: length * 8 },
    true,
    ['sign', 'verify'],
  );
  const raw = await globalThis.crypto.subtle.exportKey('raw', key);
  return {
    algorithm: 'HMAC-SHA256',
    key: new Uint8Array(raw),
    usages: ['sign', 'verify'],
  };
}

export async function aesGcmEncrypt(key: Uint8Array, plaintext: Uint8Array, additionalData?: Uint8Array): Promise<AesGcmEncrypted> {
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );
  const iv = randomBytes(12);
  const encrypted = await globalThis.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      additionalData,
      tagLength: 128,
    },
    cryptoKey,
    plaintext,
  );
  return {
    ciphertext: new Uint8Array(encrypted.slice(0, encrypted.byteLength - 16)),
    iv,
    tag: new Uint8Array(encrypted.slice(encrypted.byteLength - 16)),
  };
}

export async function aesGcmDecrypt(key: Uint8Array, data: AesGcmEncrypted, additionalData?: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );
  const combined = new Uint8Array(data.ciphertext.length + data.tag.length);
  combined.set(data.ciphertext);
  combined.set(data.tag, data.ciphertext.length);
  const decrypted = await globalThis.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: data.iv,
      additionalData,
      tagLength: 128,
    },
    cryptoKey,
    combined,
  );
  return new Uint8Array(decrypted);
}

export async function pbkdf2DeriveKey(password: string, salt: Uint8Array, iterations: number = 600000, keyLength: number = 32): Promise<Uint8Array> {
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derived = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    keyLength * 8,
  );
  return new Uint8Array(derived);
}
