import { defineConfig, devices } from '@playwright/test'

// Tests dérivés de la spec — ADR-0002 commun
// BASE_URL=https://ounokoya.github.io/rock-paper-scissors/ npx playwright test : vérifie le site en ligne
const LOCAL = 'http://localhost:4280/rock-paper-scissors/'

export default defineConfig({
  testDir: './tests',
  // tests/unit : règles sans navigateur, lancées par node --test (npm run test:unit)
  testIgnore: '**/unit/**',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || LOCAL,
    ...devices['Desktop Chrome'],
    launchOptions: { args: ['--disable-lcd-text'] },
  },
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --port 4280 --strictPort',
    url: LOCAL,
    reuseExistingServer: !process.env.CI,
  },
})
