import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext", // Enables top-level await support
  },
  optimizeDeps: {
    exclude: ["binaryen"], // Prevents Vite from pre-bundling `binaryen`
  },
  worker: {
    format: "es", // Ensures proper ES module support for Workers
  },
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
