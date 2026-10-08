import { resolve } from 'node:path'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const glitch = process.env.GLITCH === '1'

export default defineConfig({
  test: {
    // Missing baselines are failures too when generating intentional glitches.
    ...(glitch ? { update: 'none' as const } : {}),
    provide: {
      snapshotMode: { glitch, seed: process.env.SEED ?? 'snapshot-errors' },
    },
    projects: [
      ...['values', 'inline', 'raw', 'errors', 'serializers', 'domains'].map(name => ({
        test: {
          name,
          environment: 'node' as const,
          include: [`tests/${name}/**/*.test.ts`],
          ...(name === 'serializers'
            ? { snapshotSerializers: ['./src/packet-serializer.ts'] }
            : {}),
          ...(name === 'domains' ? { setupFiles: ['./src/domain-matchers.ts'] } : {}),
        },
      })),
      {
        test: {
          name: 'browser',
          include: ['tests/browser/**/*.test.ts'],
          setupFiles: ['./src/browser-setup.ts'],
          testTimeout: 15_000,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ contextOptions: { deviceScaleFactor: 1 } }),
            instances: [{ browser: 'chromium' }],
            viewport: { width: 800, height: 600 },
            screenshotFailures: false,
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch',
                comparatorOptions: { threshold: 0, allowedMismatchedPixels: 0 },
                // These fixtures use integer-aligned, font-free color blocks.
                // Share the same references across OSes for this synthetic case.
                resolveScreenshotPath: ({ root, testFileDirectory, testFileName, arg, browserName, ext }) =>
                  resolve(root, testFileDirectory, '__screenshots__', testFileName, `${arg}-${browserName}${ext}`),
              },
            },
          },
        },
      },
    ],
  },
})
