import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const adapter of ["shadcn", "heroui", "thegridcn"]) {
  for (const theme of ["light", "dark"]) {
    for (const preset of ["minimal", "workspace", "advanced"]) {
      test(`${adapter} ${theme} ${preset} gallery`, async ({ page }) => {
        await page.goto(
          `/?gallery=1&adapter=${adapter}&theme=${theme}&preset=${preset}`,
        );
        const table = page.locator("[data-gallery-table]");
        await expect(table.locator("tbody tr").first()).toBeVisible();
        if (preset === "advanced")
          await expect(
            table.getByRole("button", { name: "Print table" }),
          ).toBeVisible();
        const footer = table.locator('[data-dtp-slot="data-table-footer"]');
        if (preset === "minimal") {
          await expect(footer).toHaveCount(0);
          await expect(table.getByRole("separator")).toHaveCount(0);
          await expect(table.getByRole("checkbox")).toHaveCount(0);
        } else {
          await expect(footer).toBeVisible();
          await expect(footer.locator(":scope > div").first()).toHaveCSS(
            "border-top-width",
            "0px",
          );
          await expect(footer.locator(":scope > div").first()).toHaveCSS(
            "border-bottom-width",
            "0px",
          );
          // Natural-height examples must keep the footer below the final row.
          const finalRow = await table.locator("tbody tr").last().boundingBox();
          const footerBox = await footer.boundingBox();
          expect(footerBox!.y).toBeGreaterThanOrEqual(
            finalRow!.y + finalRow!.height - 1,
          );
        }
        const audit = await new AxeBuilder({ page })
          .include("[data-gallery-table]")
          .analyze();
        expect(
          audit.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
        await page.setViewportSize({ width: 390, height: 844 });
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          )
          .toBe(true);
        if (preset !== "minimal") {
          await expect(
            footer.getByRole("link", { name: "Next page", exact: true }),
          ).toBeVisible();
        }
      });
    }
  }
}

for (const mode of ["onChange", "onEnd"]) {
  for (const rtl of [false, true]) {
    test(`flex resize uses rendered width, preserves its edge and resets ${mode} (${rtl ? "RTL" : "LTR"})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1600, height: 1100 });
      await page.goto("/?gallery=1");
      if (rtl || mode === "onEnd") {
        await page.getByText("Fine-tune this example").click();
        if (rtl)
          await page.getByLabel("Right to left", { exact: true }).check();
        if (mode === "onEnd")
          await page.getByLabel("Resize on release", { exact: true }).check();
      }
      const header = page.locator('thead [data-column-id="progress"]');
      await expect(header).toBeVisible();
      const handle = header.getByRole("separator");
      const initial = (await header.boundingBox())!.width;
      expect(initial).toBeGreaterThan(200); // preferred size is only 160px
      const start = (await handle.boundingBox())!;
      await page.mouse.move(
        start.x + start.width / 2,
        start.y + start.height / 2,
      );
      await page.mouse.down();
      await expect
        .poll(async () => (await header.boundingBox())!.width)
        .toBeCloseTo(initial, 0);
      await page.mouse.move(
        start.x + start.width / 2 + (rtl ? 45 : -45),
        start.y + start.height / 2,
        { steps: 5 },
      );
      if (mode === "onEnd")
        await expect
          .poll(async () => (await header.boundingBox())!.width)
          .toBeCloseTo(initial, 0);
      await page.mouse.up();
      await expect
        .poll(async () => (await header.boundingBox())!.width)
        .toBeCloseTo(initial - 45, 0);
      await handle.focus();
      await page.keyboard.press(rtl ? "ArrowLeft" : "ArrowRight");
      await expect
        .poll(async () => (await header.boundingBox())!.width)
        .toBeCloseTo(initial - 35, 0);
      await page.keyboard.press("Home");
      await expect
        .poll(async () => (await header.boundingBox())!.width)
        .toBeCloseTo(initial, 0);
    });
  }
}

test("gallery search, pagination, selection and feature switches work", async ({
  page,
}) => {
  await page.goto("/?gallery=1");
  const table = page.locator("[data-gallery-table]");
  await table.getByRole("link", { name: "Next page", exact: true }).click();
  await expect(table).toContainText("PRJ-1048");
  await table.getByPlaceholder("Search projects…").fill("Website redesign");
  await expect(table.locator("tbody tr")).toHaveCount(6);
  await table.getByPlaceholder("Search projects…").fill("");
  await expect(table.locator("tbody tr")).toHaveCount(8);
  await table
    .getByRole("checkbox", { name: "Select all visible rows" })
    .click();
  await expect(table).toContainText("8 records selected");
  await page.getByText("Fine-tune this example").click();
  await page.getByLabel("Pagination footer", { exact: true }).uncheck();
  await expect(
    table.locator('[data-dtp-slot="data-table-footer"]'),
  ).toHaveCount(0);
  await page.getByLabel("Column resizing", { exact: true }).uncheck();
  await expect(table.getByRole("separator")).toHaveCount(0);
  await page.getByLabel("Empty state", { exact: true }).check();
  await expect(table).toContainText("No rows yet");
});

test("resizing a leading column keeps the trailing fill column flexible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.goto("/?gallery=1");
  const first = page.locator('thead [data-column-id="name"]');
  const last = page.locator('thead [data-column-id="progress"]');
  await expect(last).toBeVisible();
  const initialFirst = (await first.boundingBox())!;
  const initialLast = (await last.boundingBox())!;
  const handle = (await first.getByRole("separator").boundingBox())!;
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    handle.x + handle.width / 2 + 40,
    handle.y + handle.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await first.boundingBox())!.width)
    .toBeCloseTo(initialFirst.width + 40, 0);
  await expect
    .poll(async () => (await last.boundingBox())!.width)
    .toBeCloseTo(initialLast.width - 40, 0);
});

test("grouped headers resize their leaves from rendered widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.goto("/?gallery=1&preset=advanced");
  const group = page.locator('thead [data-column-group-id="investment"]');
  await expect(group).toBeVisible();
  const initial = (await group.boundingBox())!.width;
  const handle = (await group.getByRole("separator").boundingBox())!;
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  );
  await page.mouse.down();
  await expect
    .poll(async () => (await group.boundingBox())!.width)
    .toBeCloseTo(initial, 0);
  await page.mouse.move(
    handle.x + handle.width / 2 - 10,
    handle.y + handle.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await group.boundingBox())!.width)
    .toBeCloseTo(initial - 10, 0);
});
