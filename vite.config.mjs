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
        ...coverageConfigDefaults.exclude,
      ],
    },
    include: ['**/*.{test,spec}.ts'],
    alias: {
      '@': '/src', // Make sure this matches your tsconfig paths
    },
    // Instead of using workspace, let's try a simpler approach first
    environment: 'node',
    environmentOptions: {
      // Add any global environment options here
    },
    // You can specify different environments for specific tests if needed
    includeFiles: {
      'src/http/controllers/**': {
        environment: 'prisma',
      },
    },
  },
})
