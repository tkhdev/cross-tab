import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'demo/',
        '**/*.test.ts',
        '**/*.test.tsx',
        'vitest.config.ts',
        'src/index.ts', // Just re-exports
      ],
      thresholds: {
        lines: 90,
        functions: 85,
        branches: 85,
        statements: 90,
      },
    },
  },
});

