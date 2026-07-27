import { execFileSync } from "node:child_process";
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const temporaryRoot = await mkdtemp(
  path.join(tmpdir(), "data-table-pro-consumer-"),
);
const consumerDir = path.join(temporaryRoot, "consumer");

try {
  execFileSync(
    "npm",
    ["pack", "--pack-destination", temporaryRoot, "--silent"],
    {
      cwd: rootDir,
      stdio: "inherit",
    },
  );
  const tarballName = (await readdir(temporaryRoot)).find((file) =>
    file.endsWith(".tgz"),
  );
  if (!tarballName) {
    throw new Error("npm pack did not produce a tarball");
  }

  await cp(
    path.join(rootDir, "fixtures", "packed-consumer"),
    consumerDir,
    { recursive: true },
  );
  const packagePath = path.join(consumerDir, "package.json");
  const packageJson = JSON.parse(
    await readFile(packagePath, "utf8"),
  );
  packageJson.dependencies["data-table-pro"] =
    `file:${path.join(temporaryRoot, tarballName)}`;
  await writeFile(
    packagePath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );

  runPnpm(
    ["install", "--prefer-offline", "--no-frozen-lockfile"],
    consumerDir,
  );
  runPnpm(["typecheck"], consumerDir);
  runPnpm(["build"], consumerDir);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

function runPnpm(args, cwd) {
  execFileSync("corepack", ["pnpm", ...args], {
    cwd,
    stdio: "inherit",
  });
}
