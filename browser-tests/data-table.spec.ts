import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const adapters = [
  { key: "shadcn", label: "shadcn" },
  { key: "heroui", label: "HeroUI" },
  { key: "thegridcn", label: "The Gridcn" },
] as const;
const themes = ["light", "dark"] as const;

const hideContentSizedCards = async (page: Page) => {
  await page
    .getByRole("heading", { name: "Content-sized cards" })
    .evaluate((heading) => {
      const section = heading.closest("section");
      if (section) {
        section.hidden = true;
      }
    });
};

for (const adapter of adapters) {
  for (const theme of themes) {
    test(`${adapter.label} renders an accessible ${theme} layout`, async ({
      page,
    }) => {
      await page.goto("/");
      await page
        .getByRole("button", { name: adapter.label, exact: true })
        .click();
      await page
        .getByRole("button", {
          name: `${theme === "light" ? "Light" : "Dark"} theme`,
        })
        .click();
      await hideContentSizedCards(page);

      const shell = page.locator("main.demo-shell");
      const table = page
        .locator('[data-dtp-slot="data-table-root"]')
        .first();
      await expect(shell).toHaveAttribute("data-demo-adapter", adapter.key);
      await expect(shell).toHaveAttribute("data-theme", theme);
      await expect(table).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: `${adapter.label} employees`,
        }),
      ).toBeVisible();
      // These controls are loaded from an optional chunk. Waiting for them
      // keeps every adapter/theme screenshot on the same settled UI state.
      await expect(
        table.getByRole("button", { name: "Print table" }),
      ).toBeVisible();
      await expect(
        table.getByRole("button", { name: "Enter fullscreen" }),
      ).toBeVisible();

      const layout = await table.evaluate((element) => {
        const root = element.getBoundingClientRect();
        const toolbar = element
          .querySelector('[data-dtp-slot="data-table-toolbar"]')
          ?.getBoundingClientRect();
        const toolbarControls = element
          .querySelector('[data-dtp-slot="data-table-toolbar-controls"]')
          ?.getBoundingClientRect();
        const toolbarEndControls = element
          .querySelector('[data-dtp-slot="data-table-toolbar-end-controls"]')
          ?.getBoundingClientRect();
        const content = element
          .querySelector('[data-dtp-slot="data-table-content"]')
          ?.getBoundingClientRect();
        const footer = element
          .querySelector('[data-dtp-slot="data-table-footer"]')
          ?.getBoundingClientRect();
        const checkbox = element
          .querySelector<HTMLElement>(
            'thead [role="checkbox"], thead input[type="checkbox"]',
          )
          ?.getBoundingClientRect();
        const checkboxCell = element
          .querySelector('thead [role="checkbox"], thead input[type="checkbox"]')
          ?.closest("th")
          ?.getBoundingClientRect();

        return {
          root: {
            width: root.width,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
          },
          toolbarWidth: toolbar?.width,
          toolbarEndClearance:
            toolbarControls && toolbarEndControls
              ? toolbarControls.right - toolbarEndControls.right
              : undefined,
          contentWidth: content?.width,
          footerWidth: footer?.width,
          checkboxClearance:
            checkbox && checkboxCell
              ? {
                  top: checkbox.top - checkboxCell.top,
                  bottom: checkboxCell.bottom - checkbox.bottom,
                }
              : undefined,
        };
      });

      expect(layout.root.width).toBeGreaterThan(900);
      expect(layout.root.scrollWidth).toBeLessThanOrEqual(
        layout.root.clientWidth + 1,
      );
      expect(layout.toolbarWidth).toBeCloseTo(layout.root.width, 0);
      expect(layout.toolbarEndClearance).toBeGreaterThanOrEqual(0);
      expect(layout.toolbarEndClearance).toBeLessThanOrEqual(5);
      expect(layout.contentWidth).toBeCloseTo(layout.root.width, 0);
      expect(layout.footerWidth).toBeCloseTo(layout.root.width, 0);
      expect(layout.checkboxClearance?.top).toBeGreaterThanOrEqual(2);
      expect(layout.checkboxClearance?.bottom).toBeGreaterThanOrEqual(2);

      await table.evaluate((element) => {
        element.setAttribute("data-browser-test-root", "true");
      });
      const accessibility = await new AxeBuilder({ page })
        .include('[data-browser-test-root="true"]')
        .analyze();
      expect(
        accessibility.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          targets: violation.nodes.map((node) => node.target),
        })),
      ).toEqual([]);

      await expect(table).toHaveScreenshot(
        `${adapter.key}-${theme}-table.png`,
        {
          animations: "disabled",
          caret: "hide",
          scale: "css",
        },
      );
    });
  }
}

test("responsive behavior follows table container boundaries", async ({
  page,
}) => {
  await page.goto("/");

  const table = page.locator('[data-dtp-slot="data-table-root"]').first();
  const setContainerWidth = async (width: number) => {
    await table.evaluate((element, nextWidth) => {
      element.style.flex = "none";
      element.style.maxWidth = "none";
      element.style.width = `${nextWidth}px`;
    }, width);
    await expect(table).toHaveCSS("width", `${width}px`);
  };
  const header = (columnId: string) =>
    table.locator(`thead [data-column-id="${columnId}"]`);

  await setContainerWidth(639);
  await expect(header("department")).toHaveCount(0);

  await setContainerWidth(640);
  await expect(header("department")).toBeVisible();

  await setContainerWidth(767);
  await expect(header("role")).toHaveCount(0);
  await expect(
    table.getByRole("button", { name: "Search table" }),
  ).toBeVisible();

  await setContainerWidth(768);
  await expect(header("role")).toBeVisible();
  await expect(
    table.getByPlaceholder("Search name, role, status, manager..."),
  ).toBeVisible();

  await setContainerWidth(1023);
  await expect(header("location")).toHaveCount(0);

  await setContainerWidth(1024);
  await expect(header("location")).toBeVisible();

  await page.evaluate(() => {
    document.documentElement.style.fontSize = "20px";
  });
  await setContainerWidth(768);
  await expect(header("role")).toBeVisible();
  await expect(header("location")).toHaveCount(0);
});

test("fill layout gives spare width to the internal spacer and preserves overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1700, height: 900 });
  await page.goto("/");
  await hideContentSizedCards(page);

  const table = page.locator('[data-dtp-slot="data-table-root"]').first();
  await table.evaluate((element) => {
    element.style.flex = "none";
    element.style.width = "1500px";
    element.style.height = "520px";
  });

  const readLayout = () =>
    table.evaluate((element) => {
      const scrollArea = element.querySelector<HTMLElement>(
        '[data-slot="scroll-area"]',
      );
      const viewport = element.querySelector<HTMLElement>(
        '[data-slot="scroll-area-viewport"]',
      );
      const headers = Array.from(
        element.querySelectorAll<HTMLElement>(
          "thead tr:last-child [data-column-id]",
        ),
      );
      const name = headers.find(
        (header) => header.dataset.columnId === "name",
      );
      const spacer = headers.find(
        (header) => header.dataset.columnId === "__spacer__",
      );
      const actions = headers.find(
        (header) => header.dataset.columnId === "__actions__",
      );
      if (!scrollArea || !viewport || !name || !spacer || !actions) {
        throw new Error("Expected the fill-layout regression columns");
      }
      return {
        actionIndex: headers.indexOf(actions),
        clientWidth: viewport.clientWidth,
        nameWidth: name.getBoundingClientRect().width,
        scrollWidth: viewport.scrollWidth,
        spacerIndex: headers.indexOf(spacer),
        spacerWidth: spacer.getBoundingClientRect().width,
        width: scrollArea.getBoundingClientRect().width,
      };
    });

  await expect.poll(async () => (await readLayout()).spacerWidth).toBeGreaterThan(0);
  const wideLayout = await readLayout();
  expect(wideLayout.nameWidth).toBeCloseTo(220, 0);
  expect(wideLayout.spacerIndex).toBe(wideLayout.actionIndex - 1);
  expect(wideLayout.scrollWidth).toBeLessThanOrEqual(
    wideLayout.clientWidth + 1,
  );

  await table.evaluate((element) => {
    element.style.width = "720px";
  });
  await expect(table).toHaveCSS("width", "720px");
  await expect.poll(async () => (await readLayout()).scrollWidth).toBeGreaterThan(720);

  const narrowLayout = await readLayout();
  expect(narrowLayout.nameWidth).toBeCloseTo(220, 0);
  expect(narrowLayout.spacerIndex).toBe(narrowLayout.actionIndex - 1);
  expect(narrowLayout.scrollWidth).toBeGreaterThan(narrowLayout.clientWidth);
});

test("interactive grid navigation follows the rendered cell geometry", async ({
  page,
}) => {
  await page.goto("/");
  const grid = page.getByRole("grid").first();
  await expect(grid).toHaveAttribute("aria-colcount", /[1-9]/);
  await expect(grid).toHaveAttribute("aria-rowcount", /[1-9]/);

  const firstCell = grid.getByRole("gridcell").first();
  await firstCell.focus();
  await page.keyboard.press("ArrowRight");
  await expect(grid.getByRole("gridcell").nth(1)).toBeFocused();
  await page.keyboard.press("PageDown");
  const focused = await page.locator(':focus').evaluate((element) => ({
    row: element.getAttribute("data-grid-row-index"),
    column: element.getAttribute("data-grid-column-index"),
  }));
  expect(focused.row).not.toBe("0");
  expect(focused.column).toBe("1");
});

test("interactive grid selects a pointer-dragged cell range", async ({ page }) => {
  await page.goto("/");
  await hideContentSizedCards(page);
  const grid = page.getByRole("grid").first();
  // The demo's first two cells are detail and row-selection utilities. Range
  // selection intentionally begins only from data cells.
  const firstCell = grid.locator(
    '[role="gridcell"][data-grid-row-index="0"][data-grid-column-index="2"]',
  );
  const fourthCell = grid.locator(
    '[role="gridcell"][data-grid-row-index="0"][data-grid-column-index="5"]',
  );
  const start = await firstCell.boundingBox();
  const end = await fourthCell.boundingBox();
  expect(start).not.toBeNull();
  expect(end).not.toBeNull();
  await page.mouse.move(
    start!.x + start!.width / 2,
    start!.y + start!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(end!.x + end!.width / 2, end!.y + end!.height / 2, {
    steps: 4,
  });
  await page.mouse.up();
  await expect(firstCell).toHaveAttribute("aria-selected", "true");
  await expect(fourthCell).toHaveAttribute("aria-selected", "true");
});

test("persistent scrollbars stack above fixed columns and a bottom-pinned row", async ({
  page,
}) => {
  await page.goto("/?scrollbar-regression=1");
  await hideContentSizedCards(page);

  const table = page.locator('[data-dtp-slot="data-table-root"]').first();
  await table.evaluate((element) => {
    element.style.flex = "none";
    element.style.width = "720px";
    element.style.height = "520px";
  });

  const scrollArea = table.locator('[data-slot="scroll-area"]').first();
  const viewport = scrollArea.locator('[data-slot="scroll-area-viewport"]');
  const horizontalScrollbar = scrollArea.locator(
    '[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]',
  );
  const verticalScrollbar = scrollArea.locator(
    '[data-slot="scroll-area-scrollbar"][data-orientation="vertical"]',
  );
  const corner = scrollArea.locator('[data-slot="scroll-area-corner"]');
  const fixedLeftHeader = table.locator(
    'thead [data-column-id="name"]',
  );
  const fixedActionsHeader = table.locator(
    'thead [data-column-id="__actions__"]',
  );
  const bottomPinnedRow = table.locator(
    '[data-dtp-slot="data-table-pinned-row"][data-row-pinned="bottom"]',
  );

  await expect(fixedLeftHeader).toBeVisible();
  await expect(fixedActionsHeader).toBeVisible();
  await expect(bottomPinnedRow).toBeVisible();
  await expect(horizontalScrollbar).toBeVisible();
  await expect(verticalScrollbar).toBeVisible();
  await expect(corner).toBeVisible();

  const geometry = await viewport.evaluate((element) => ({
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
  }));
  expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);
  expect(geometry.scrollHeight).toBeGreaterThan(geometry.clientHeight);

  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  const stacking = await scrollArea.evaluate((element) => {
    const horizontal = element.querySelector<HTMLElement>(
      '[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]',
    );
    const vertical = element.querySelector<HTMLElement>(
      '[data-slot="scroll-area-scrollbar"][data-orientation="vertical"]',
    );
    const cornerElement = element.querySelector<HTMLElement>(
      '[data-slot="scroll-area-corner"]',
    );
    if (!horizontal || !vertical || !cornerElement) {
      throw new Error("Expected both scrollbars and their corner");
    }

    const topSlotAt = (x: number, y: number) =>
      document
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>(
          '[data-slot="scroll-area-scrollbar"], [data-slot="scroll-area-corner"]',
        )
        ?.dataset.slot;
    const horizontalRect = horizontal.getBoundingClientRect();
    const verticalRect = vertical.getBoundingClientRect();
    const cornerRect = cornerElement.getBoundingClientRect();
    const fixedLeftRect = element
      .querySelector<HTMLElement>('thead [data-column-id="name"]')
      ?.getBoundingClientRect();
    const bottomPinnedRect = element
      .querySelector<HTMLElement>(
        '[data-dtp-slot="data-table-pinned-row"][data-row-pinned="bottom"]',
      )
      ?.getBoundingClientRect();
    if (!fixedLeftRect || !bottomPinnedRect) {
      throw new Error("Expected fixed and pinned regression regions");
    }

    return {
      horizontalZIndex: getComputedStyle(horizontal).zIndex,
      verticalZIndex: getComputedStyle(vertical).zIndex,
      cornerZIndex: getComputedStyle(cornerElement).zIndex,
      overFixedLeft: topSlotAt(
        fixedLeftRect.left + fixedLeftRect.width / 2,
        horizontalRect.top + horizontalRect.height / 2,
      ),
      overFixedActions: topSlotAt(
        verticalRect.left + verticalRect.width / 2,
        bottomPinnedRect.top + bottomPinnedRect.height / 2,
      ),
      atCorner: topSlotAt(
        cornerRect.left + cornerRect.width / 2,
        cornerRect.top + cornerRect.height / 2,
      ),
    };
  });

  expect(stacking).toEqual({
    horizontalZIndex: "100",
    verticalZIndex: "100",
    cornerZIndex: "100",
    overFixedLeft: "scroll-area-scrollbar",
    overFixedActions: "scroll-area-scrollbar",
    atCorner: "scroll-area-corner",
  });
});
