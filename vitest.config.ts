import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

/**
 * Minimal Vitest setup — pure financial-logic unit tests only.
 * No jsdom, no component/integration harness (see plan: out of scope).
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
