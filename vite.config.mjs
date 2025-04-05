import { coverageConfigDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    reporters: [['vitest-sonar-reporter', { outputFile: 'sonar-report.xml' }]],
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
        '**/factories/**',
        '**/utils/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
})
