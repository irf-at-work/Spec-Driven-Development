import { defineConfig, devices } from '@playwright/test';

// The only addresses these tests may talk to: the local Angular app and the local API (plan.md, hosting is the local machine).
// Both can be changed with environment variables if a port is already taken.
// The API address must match API_BASE_URL_VALUE in src/app/core/app-config.ts, because the browser calls the API there.
process.env['SDD_API_URL'] ??= 'http://localhost:5114';
process.env['SDD_UI_URL'] ??= 'http://localhost:4201';
const uiUrl = process.env['SDD_UI_URL'] ?? 'http://localhost:4201';
const uiPort = new URL(uiUrl).port || '4201';

export default defineConfig({
  testDir: '../tests',
  // The tests share one Oracle test schema, so they run one at a time.
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: uiUrl,
    // The API uses the local development certificate, which the browser does not trust by default.
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Use a dedicated port and a fresh Angular server so browser checks cannot silently reuse an older local UI bundle.
  // The API must be started separately against the approved test schema (see quickstart.md).
  webServer: {
    command: `npm start -- --port ${uiPort}`,
    url: uiUrl,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
