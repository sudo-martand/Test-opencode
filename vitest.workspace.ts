import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'shared',
      root: './packages/shared',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'proto',
      root: './packages/proto',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'kernel',
      root: './packages/kernel',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'time',
      root: './packages/time',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'netstack',
      root: './packages/netstack',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'hostos',
      root: './packages/hostos',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'terminal',
      root: './packages/terminal',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'ui',
      root: './packages/ui',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'fs',
      root: './packages/fs',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'sound',
      root: './packages/sound',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'ai',
      root: './packages/ai',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'threatintel',
      root: './packages/threatintel',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'geo',
      root: './packages/geo',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'wasm-crypto',
      root: './packages/wasm-crypto',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'deception',
      root: './packages/deception',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'simulator',
      root: './apps/simulator',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', '__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    },
  },
]);
