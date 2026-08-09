import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "performance.spec.ts",
  reporter: "list",
  use: { browserName: "chromium", headless: true },
  webServer: {
    command:
      "corepack pnpm exec vite --config vite.config.ts --host 127.0.0.1",
    port: 4177,
    reuseExistingServer: !process.env.CI,
  },
});
