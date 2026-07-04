import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    alias: {
      '@': '/src',
      '@/lib': '/src/lib',
      '@/types': '/src/types',
      '@/components': '/src/components',
      '@/features': '/src/features',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'src/test'],
    },
  },
})