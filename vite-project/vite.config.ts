import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: "electron/main.js",
        vite: {
          build: {
            outDir: "dist-electron",
          },
        },
      },
      {
        entry: "electron/preload.js",
        vite: {
          build: {
            outDir: "dist-electron",
          },
        },
      },
    ]),
  ],
  base: "./",
  build: {
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
    commonjsOptions: {
      transformMixedEsModules: true, // 允许动态导入 ES 模块和 CommonJS 模块
    },
  },
});
