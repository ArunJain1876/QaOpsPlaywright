// @ts-check

const config = {
  testDir: './tests',
  testMatch: '**/*.spec.js',
  retries: 0,
  /** External demo sites + tracing are heavy; limit parallelism for stable runs. */
  workers: 2,
  timeout: 90 * 1000,
  expect: {
    timeout: 15 * 1000,
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.04,
    },
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: true,
    /** Helps when Node cannot verify TLS (e.g. corporate proxies). */
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
};

module.exports = config;
