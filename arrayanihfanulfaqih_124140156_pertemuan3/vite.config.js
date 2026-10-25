import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Konfigurasi Vite + Vitest (environment jsdom untuk React Testing Library)
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
