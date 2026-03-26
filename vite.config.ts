// vite.config.ts
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import path from "path";

import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      devOptions: {
        enabled: true, // 개발에서도 PWA 테스트
      },
      manifest: {
        name: "My App",
        short_name: "App",
        description: "My Vite PWA App",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  // 개발 서버
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },

  // 절대경로 alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@data": path.resolve(__dirname, "src/data"),
      "@style": path.resolve(__dirname, "src/style"),
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
