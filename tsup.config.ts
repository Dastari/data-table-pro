import { defineConfig } from "tsup";
import packageJson from "./package.json" with { type: "json" };

const external = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
];

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    heroui: "src/entries/heroui.ts",
    thegridcn: "src/entries/thegridcn.ts",
    "url-state": "src/entries/url-state.ts",
    types: "src/entries/types.ts",
    advanced: "src/entries/advanced.ts",
  },
  external,
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
  target: "es2022",
  treeshake: true,
});
