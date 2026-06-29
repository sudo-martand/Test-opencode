import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/__tests__/**/*.test.ts', 'packages/*/__tests__/**/*.spec.ts', 'packages/*/src/**/*.test.ts', 'packages/*/src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**', 'packages/*/__tests__/**'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/*.bench.ts'],
    },
    benchmark: {
      include: ['packages/*/__tests__/**/*.bench.ts', 'packages/*/src/**/*.bench.ts'],
    },
  },
});
