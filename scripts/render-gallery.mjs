import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const output = path.resolve("docs/ui-renders");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const images = [];
try {
  for (const adapter of ["shadcn", "heroui", "thegridcn"]) {
    for (const theme of ["light", "dark"]) {
      for (const preset of ["minimal", "workspace", "advanced"]) {
        const page = await browser.newPage({
          viewport: { width: 1440, height: 1300 },
          reducedMotion: "reduce",
        });
        await page.goto(
          `${baseURL}/?gallery=1&adapter=${adapter}&theme=${theme}&preset=${preset}`,
        );
        await page.locator("tbody tr").first().waitFor();
        if (preset === "advanced") {
          await page.getByRole("button", { name: "Print table" }).waitFor();
          await page.locator("tbody [role=checkbox]").first().click();
          await page
            .getByRole("button", { name: "Expand row", exact: true })
            .first()
            .click();
        }
        await page.mouse.move(0, 0);
        await page.evaluate(() => document.fonts.ready);
        const file = `${adapter}-${theme}-${preset}.png`;
        await page.locator(".gallery-preview").screenshot({
          path: path.join(output, file),
          animations: "disabled",
        });
        images.push({ file, label: `${adapter} · ${theme} · ${preset}` });
        if (theme === "light" && preset === "workspace") {
          await page.setViewportSize({ width: 390, height: 844 });
          const mobileFile = `${adapter}-mobile.png`;
          await page.locator(".gallery-preview").screenshot({
            path: path.join(output, mobileFile),
            animations: "disabled",
          });
          images.push({
            file: mobileFile,
            label: `${adapter} · mobile / 390px`,
          });
        }
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
await writeFile(
  path.join(output, "index.html"),
  `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>data-table-pro · UI renders</title>
<style>body{margin:0;padding:40px;font:14px system-ui;background:#f4f4f5;color:#18181b}h1{font-size:30px;letter-spacing:-1px}p{color:#52525b;line-height:1.6}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr));gap:24px}figure{margin:0;background:white;border:1px solid #ddd;border-radius:12px;padding:16px}img{width:100%;height:420px;object-fit:contain;object-position:top}figcaption{font-size:13px;margin-bottom:16px}a{color:inherit}</style>
<h1>One table. Three design languages.</h1><p>Actual browser renders of the shared table. Click a preview for the full-resolution PNG.<br>Minimal: controls off. Everyday: search, filters, selection, resizing, pagination. Advanced: grouped headers, selected row, expanded details, editing, summary, export and grid controls.<br>Captured at 1440px desktop and 390px mobile. Light and dark themes.</p><main>${images.map(({ file, label }) => `<figure><figcaption>${label}</figcaption><a href="${file}"><img loading="lazy" src="${file}" alt="${label} table render"></a></figure>`).join("\n")}</main></html>`,
);
console.log(`Wrote ${images.length} renders and docs/ui-renders/index.html`);

// A compact, shareable overview; the individual PNGs retain full detail.
const comparison = `<!doctype html><html lang="en"><meta charset="utf-8"><style>
body{margin:0;padding:36px;background:#ededee;color:#18181b;font:14px system-ui}h1{font-size:30px;letter-spacing:-1px;margin:0 0 8px}p{color:#52525b;margin:0 0 26px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}figure{margin:0}figcaption{font-size:12px;margin:0 0 10px;font-weight:600}img{display:block;width:100%;border-radius:8px;border:1px solid #d4d4d8}
</style><h1>data-table-pro / table explorations</h1><p>Everyday preset · Three ecosystems · Light & dark · Borderless footer</p><main>${["light", "dark"].flatMap((theme) => ["shadcn", "heroui", "thegridcn"].map((adapter) => `<figure><figcaption>${adapter} / ${theme}</figcaption><img src="${adapter}-${theme}-workspace.png" alt="${adapter} ${theme} table"></figure>`)).join("")}</main></html>`;
await writeFile(path.join(output, "comparison.html"), comparison);
const overviewBrowser = await chromium.launch();
try {
  const page = await overviewBrowser.newPage({
    viewport: { width: 1600, height: 1000 },
  });
  await page.goto(new URL(`file://${output}/comparison.html`).href);
  await page
    .locator("img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode())),
    );
  await page.screenshot({
    path: path.join(output, "comparison.png"),
    fullPage: true,
  });
} finally {
  await overviewBrowser.close();
}
