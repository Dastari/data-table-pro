import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(rootDir, "dist");
const kib = 1024;
const budgets = {
  base: 35 * kib,
  adapterDelta: 6 * kib,
  urlState: 5 * kib,
  demoInitial: 100 * kib,
};

const packageGraphs = new Map();
for (const entry of [
  "index.js",
  "virtual.js",
  "heroui.js",
  "heroui-virtual.js",
  "thegridcn.js",
  "thegridcn-virtual.js",
  "url-state.js",
  "adapter.js",
  "adapter-virtual.js",
]) {
  packageGraphs.set(entry, await readPackageGraph(entry));
}

const baseGraph = packageGraphs.get("index.js");
const baseSize = gzipGraph(baseGraph);
const heroSize = gzipGraph(packageGraphs.get("heroui.js"));
const gridSize = gzipGraph(packageGraphs.get("thegridcn.js"));
const urlStateSize = gzipGraph(packageGraphs.get("url-state.js"));
const demoSize = await readDemoInitialSize();

assertBudget("base shadcn static runtime", baseSize, budgets.base);
assertBudget(
  "HeroUI adapter delta",
  Math.max(0, heroSize - baseSize),
  budgets.adapterDelta,
);
assertBudget(
  "The Gridcn adapter delta",
  Math.max(0, gridSize - baseSize),
  budgets.adapterDelta,
);
assertBudget("URL-state entry", urlStateSize, budgets.urlState);
assertBudget("demo initial JavaScript", demoSize, budgets.demoInitial);

assertDoesNotContainVirtual(
  "base shadcn",
  packageGraphs.get("index.js"),
);
assertDoesNotContainVirtual(
  "base HeroUI",
  packageGraphs.get("heroui.js"),
);
assertDoesNotContainVirtual(
  "base The Gridcn",
  packageGraphs.get("thegridcn.js"),
);
assertDoesNotContainVirtual(
  "stable adapter-authoring",
  packageGraphs.get("adapter.js"),
);
assertContainsVirtual(
  "virtual shadcn",
  packageGraphs.get("virtual.js"),
);
assertContainsVirtual(
  "virtual HeroUI",
  packageGraphs.get("heroui-virtual.js"),
);
assertContainsVirtual(
  "virtual The Gridcn",
  packageGraphs.get("thegridcn-virtual.js"),
);
assertContainsVirtual(
  "virtual adapter-authoring",
  packageGraphs.get("adapter-virtual.js"),
);

process.stdout.write(
  [
    "Bundle budgets passed",
    `  base shadcn: ${formatSize(baseSize)} / ${formatSize(budgets.base)}`,
    `  HeroUI delta: ${formatSize(Math.max(0, heroSize - baseSize))} / ${formatSize(budgets.adapterDelta)}`,
    `  The Gridcn delta: ${formatSize(Math.max(0, gridSize - baseSize))} / ${formatSize(budgets.adapterDelta)}`,
    `  URL state: ${formatSize(urlStateSize)} / ${formatSize(budgets.urlState)}`,
    `  demo initial: ${formatSize(demoSize)} / ${formatSize(budgets.demoInitial)}`,
  ].join("\n") + "\n",
);

async function readPackageGraph(entry) {
  const graph = new Map();

  async function visit(filename) {
    if (graph.has(filename)) {
      return;
    }
    const contents = await readFile(path.join(distDir, filename), "utf8");
    graph.set(filename, contents);
    for (const specifier of readStaticImports(contents)) {
      if (specifier.startsWith("./") && specifier.endsWith(".js")) {
        await visit(path.basename(specifier));
      }
    }
  }

  await visit(entry);
  return graph;
}

function readStaticImports(contents) {
  return Array.from(
    contents.matchAll(
      /\bimport(?!\s*\()(?:[^"'`;]*?\bfrom\s*)?["']([^"']+)["']/g,
    ),
    (match) => match[1],
  );
}

function gzipGraph(graph) {
  return gzipSync(Array.from(graph.values()).join("\n")).length;
}

async function readDemoInitialSize() {
  const demoDist = path.join(rootDir, "demo", "dist");
  const manifest = JSON.parse(
    await readFile(
      path.join(demoDist, ".vite", "manifest.json"),
      "utf8",
    ),
  );
  const entry = manifest["index.html"];
  if (!entry?.file) {
    throw new Error("The demo manifest does not contain its index entry");
  }
  const files = new Set();

  function visit(chunk) {
    if (!chunk || files.has(chunk.file)) {
      return;
    }
    files.add(chunk.file);
    for (const importedKey of chunk.imports ?? []) {
      visit(manifest[importedKey]);
    }
  }

  visit(entry);
  const contents = await Promise.all(
    Array.from(files, (filename) =>
      readFile(path.join(demoDist, filename), "utf8"),
    ),
  );
  return gzipSync(contents.join("\n")).length;
}

function assertBudget(label, actual, budget) {
  if (actual > budget) {
    throw new Error(
      `${label} is ${formatSize(actual)}, above its ${formatSize(budget)} gzip budget`,
    );
  }
}

function assertDoesNotContainVirtual(label, graph) {
  if (
    Array.from(graph.values()).some((contents) =>
      contents.includes("@tanstack/react-virtual"),
    )
  ) {
    throw new Error(`${label} statically imports TanStack Virtual`);
  }
}

function assertContainsVirtual(label, graph) {
  if (
    !Array.from(graph.values()).some((contents) =>
      contents.includes("@tanstack/react-virtual"),
    )
  ) {
    throw new Error(`${label} does not statically import TanStack Virtual`);
  }
}

function formatSize(bytes) {
  return `${(bytes / kib).toFixed(1)} KiB`;
}
