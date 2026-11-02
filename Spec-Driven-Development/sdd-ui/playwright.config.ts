import { defineConfig, devices } from '@playwright/test';

// The only addresses these tests may talk to: the local Angular app and the local API (plan.md, hosting is the local machine).
// Both can be changed with environment variables if a port is already taken.
process.env['SDD_API_URL'] ??= 'https://localhost:7246';
process.env['SDD_UI_URL'] ??= 'http://localhost:4200';
const uiUrl = process.env['SDD_UI_URL'] ?? 'http://localhost:4200';

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
  // Starts the Angular app when it is not already running. The API must be started separately against the approved test
  // schema, because it needs the Oracle connection string (see quickstart.md).
  webServer: {
    command: 'npm start',
    url: uiUrl,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
