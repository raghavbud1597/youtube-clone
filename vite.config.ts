import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ["VITE_", "REACT_APP_YOUTUBE_DATA_API_KEY"],
  server: {
    port: 3000,
    watch: {
      ignored: ["**/react-youtube-clone-master/**"],
    },
  },
  build: {
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
    unstubEnvs: true,
  },
});
