// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // 개발 서버
  server: {
    port: 3000,
    open: true,
  },

  // 절대경로 alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // 환경변수 prefix
  envPrefix: "VITE_",

  // 빌드 설정
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
