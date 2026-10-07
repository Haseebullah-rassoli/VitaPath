import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: process.env.TEST_URL || "http://127.0.0.1:4173/VitaPath",
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
    headless: true,
  },
  webServer: {
    command: "npm start",
    url: "http://127.0.0.1:4173/VitaPath/",
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
