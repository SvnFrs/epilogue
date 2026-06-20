import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Resolve the contracts package to its TS source so Vitest transforms it
// (workspace deps are otherwise externalized from node_modules).
const contractsAlias = {
  '@epilogue/contracts': fileURLToPath(new URL('./packages/contracts/src/index.ts', import.meta.url)),
};

// `@/...` → apps/web (mirrors the Next tsconfig path) for component tests.
const webAlias = {
  ...contractsAlias,
  '@': fileURLToPath(new URL('./apps/web', import.meta.url)),
};

export default defineWorkspace([
  // ── ~65% unit — pure functions, zero I/O (testing.md tier 1) ──
  {
    resolve: { alias: contractsAlias },
    test: {
      name: 'unit',
      environment: 'node',
      include: [
        'apps/api/src/**/*.test.ts',
        'packages/contracts/src/**/*.test.ts',
      ],
    },
  },
  // ── ~25% component (testing.md tier 2a) ──
  {
    plugins: [react()],
    resolve: { alias: webAlias },
    test: {
      name: 'component',
      environment: 'jsdom',
      include: ['apps/web/**/*.test.tsx'],
      setupFiles: ['apps/web/test/setup.ts'],
    },
  },
  // ── ~25% API+DB integration + HTTP (testing.md tier 2b) — real Postgres ──
  {
    resolve: { alias: contractsAlias },
    test: {
      name: 'integration',
      environment: 'node',
      include: [
        'apps/api/tests/integration/**/*.test.ts',
        'apps/api/tests/http/**/*.test.ts',
      ],
      globalSetup: ['apps/api/tests/setup/testcontainer.ts'],
      // One shared container; run files sequentially so per-file truncate+seed don't
      // race. (testing.md's per-file CREATE SCHEMA isolation is the parallel scale-up.)
      fileParallelism: false,
      testTimeout: 60_000,
      hookTimeout: 180_000,
    },
  },
]);
