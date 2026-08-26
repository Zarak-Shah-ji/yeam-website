import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  // Mirror the "@/*" -> repo root alias from tsconfig.json so tests import
  // modules by the same path the app does.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
