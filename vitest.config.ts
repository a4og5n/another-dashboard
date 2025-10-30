import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Switch to happy-dom for better performance (2-3x faster than jsdom)
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    env: {
      NODE_ENV: "test",
    },

    // Thread pool configuration optimized for M4 MacBook Air
    pool: "threads",
    poolOptions: {
      threads: {
        maxThreads: 4, // Conservative limit for thermal management (prevents CPU spikes)
        minThreads: 2, // Keep minimum active
        useAtomics: true, // Better performance on modern CPUs (M4)
      },
    },

    // Limit concurrent test file execution to prevent CPU spikes
    maxConcurrency: 4,

    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/test/**",
        "**/*.d.ts",
        "**/coverage/**",
        "**/.next/**",
        "**/public/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
