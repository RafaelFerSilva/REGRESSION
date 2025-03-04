import { coverageConfigDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: [
        '**/build/**',
        '**/env/**',
        '**/lib/**',
        '**/http/**',
        '**/controllers/**',
        '**/prisma/**',
        '**/app.ts',
        '**/server.ts',
        '**/users.repository.ts',
        '**/interfaces/**',
        '**/factories/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
})