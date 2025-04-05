import { coverageConfigDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    coverage: {
      provider: 'v8', // ou 'istanbul'
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/build/**',
        '**/env/**',
        '**/lib/**',
        '**/http/**',
        '**/controllers/**',
        '**/prisma/**',
        '**/app.ts',
        '**/server.ts',
        '**/factories/**',
        '**/utils/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
})
