import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    heroui: "src/entries/heroui.ts",
    thegridcn: "src/entries/thegridcn.ts",
  },
  external: ["react", "react-dom"],
  format: ["esm", "cjs"],
  outDir: "dist",
  sourcemap: true,
  target: "es2022",
  treeshake: true,
});
