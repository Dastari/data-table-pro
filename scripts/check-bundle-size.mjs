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
  base: 42 * kib,
  adapterDelta: 6 * kib,
  urlState: 5 * kib,
  dataSource: 3 * kib,
  demoInitial: 100 * kib,
  demoLoadedAdapter: 190 * kib,
  demoCss: 20 * kib,
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
  "data-source.js",
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
const dataSourceSize = gzipGraph(packageGraphs.get("data-source.js"));
const demoSizes = await readDemoBuildSizes();

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
assertBudget("data-source entry", dataSourceSize, budgets.dataSource);
assertBudget(
  "demo initial JavaScript",
  demoSizes.initialJavaScript,
  budgets.demoInitial,
);
assertBudget(
  "demo loaded adapter JavaScript",
  demoSizes.loadedAdapterJavaScript,
  budgets.demoLoadedAdapter,
);
assertBudget("demo CSS", demoSizes.css, budgets.demoCss);

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
assertDoesNotContainVirtual(
  "data source",
  packageGraphs.get("data-source.js"),
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
    `  data source: ${formatSize(dataSourceSize)} / ${formatSize(budgets.dataSource)}`,
    `  demo initial: ${formatSize(demoSizes.initialJavaScript)} / ${formatSize(budgets.demoInitial)}`,
    `  demo loaded adapter: ${formatSize(demoSizes.loadedAdapterJavaScript)} / ${formatSize(budgets.demoLoadedAdapter)}`,
    `  demo CSS: ${formatSize(demoSizes.css)} / ${formatSize(budgets.demoCss)}`,
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

async function readDemoBuildSizes() {
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
  const initialFiles = new Set();

  function visit(chunk, files) {
    if (!chunk || files.has(chunk.file)) {
      return;
    }
    files.add(chunk.file);
    for (const importedKey of chunk.imports ?? []) {
      visit(manifest[importedKey], files);
    }
  }

  visit(entry, initialFiles);
  const initialJavaScript = await gzipDemoFiles(demoDist, initialFiles);
  const loadedAdapterSizes = await Promise.all(
    (entry.dynamicImports ?? []).map(async (dynamicImportKey) => {
      const files = new Set(initialFiles);
      visit(manifest[dynamicImportKey], files);
      return gzipDemoFiles(demoDist, files);
    }),
  );
  const css = await gzipDemoFiles(demoDist, new Set(entry.css ?? []));

  return {
    initialJavaScript,
    loadedAdapterJavaScript: Math.max(
      initialJavaScript,
      ...loadedAdapterSizes,
    ),
    css,
  };
}

async function gzipDemoFiles(demoDist, files) {
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
