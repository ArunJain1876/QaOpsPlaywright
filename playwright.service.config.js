/**
 * Node → Azure Playwright service uses HTTPS. "unable to get local issuer certificate"
 * comes from Node's TLS stack (not the browser). ignoreHTTPSErrors does not fix that.
 *
 * Prefer production-style trust: set NODE_EXTRA_CA_CERTS to your org/root CA PEM, then
 *   PLAYWRIGHT_STRICT_NODE_TLS=1
 * so Node verifies TLS. If unset, this config disables Node TLS verification for the
 * test process only (typical fix behind SSL inspection / incomplete chains).
 */
if (process.env.PLAYWRIGHT_STRICT_NODE_TLS !== '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const { defineConfig } = require('@playwright/test');
const { createAzurePlaywrightConfig, ServiceOS } = require('@azure/playwright');
const { DefaultAzureCredential } = require('@azure/identity');

// Azure Storage Account: pwstrgrrdc4432
// Azure Resource Group: RRD
const config = require('./playwright.config');

/* Learn more about service configuration at https://aka.ms/pww/docs/config */
module.exports = defineConfig({
  ...config,
  ...createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>',
    connectTimeout: 3 * 60 * 1000, // 3 minutes
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
    use: {
      // Page loads only. Does not apply to Node → Playwright service HTTPS (see file header).
      ignoreHTTPSErrors: true,
    },
  }),
  // HTML reporter must come first; Azure reporter uploads the report to workspace storage (portal).
  reporter: [
    ['html', { open: 'never' }],
    ['@azure/playwright/reporter'],
  ],
});
