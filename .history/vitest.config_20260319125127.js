import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["dotenv/config"],
    // Moved inside the 'test' object!
    env: {
      LOG_TO_CONSOLE_ONLY: "true",
      PINO_LOG_LEVEL: "error",
    },
  },
});
