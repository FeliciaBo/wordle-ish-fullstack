import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5080",
    headless: true,
  },
  webServer: {
    command: "cd server && set TEST_MODE=true && npm start",
    port: 5080,
    reuseExistingServer: true,
  },
});