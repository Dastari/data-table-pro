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
    virtual: "src/entries/virtual.ts",
    heroui: "src/entries/heroui.ts",
    "heroui-virtual": "src/entries/heroui-virtual.ts",
    thegridcn: "src/entries/thegridcn.ts",
    "thegridcn-virtual": "src/entries/thegridcn-virtual.ts",
    "url-state": "src/entries/url-state.ts",
    "data-source": "src/entries/data-source.ts",
    types: "src/entries/types.ts",
    advanced: "src/entries/advanced.ts",
    adapter: "src/entries/adapter.ts",
    "adapter-virtual": "src/entries/adapter-virtual.ts",
  },
  external,
  format: ["esm"],
  minify: true,
  outDir: "dist",
  sourcemap: true,
  target: "es2022",
  treeshake: true,
});
