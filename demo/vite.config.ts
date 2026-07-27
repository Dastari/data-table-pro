import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export default defineConfig({
  root: path.join(rootDir, "demo"),
  plugins: [react(), tailwindcss()],
  build: {
    manifest: true,
  },
  resolve: {
    alias: {
      "data-table-pro/heroui": path.join(rootDir, "src/entries/heroui.ts"),
      "data-table-pro/thegridcn": path.join(
        rootDir,
        "src/entries/thegridcn.ts",
      ),
      "data-table-pro": path.join(rootDir, "src/index.ts"),
    },
  },
  server: {
    port: 5173,
  },
});
