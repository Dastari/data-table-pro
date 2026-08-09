import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export default defineConfig({
  root: path.join(rootDir, "benchmarks"),
  plugins: [react()],
  server: { port: 4177, strictPort: true },
});
