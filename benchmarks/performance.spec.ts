import { expect, test } from "@playwright/test";
import { benchmarkScenarios } from "./fixtures";

for (const scenario of benchmarkScenarios) {
  test(`measures ${scenario.name}`, async ({ page }) => {
    await page.goto(`/?scenario=${scenario.name}`);
    await page.waitForFunction(() => Boolean(window.__DTP_BENCHMARK__));

    const searchStartedAt = await page.evaluate(() => performance.now());
    await page.getByPlaceholder("Search rows...").fill("searchable 42");
    await page.waitForTimeout(50);
    const searchSettleMs = await page.evaluate(
      (startedAt) => performance.now() - startedAt,
      searchStartedAt,
    );
    const scrollFrameMs = await page.evaluate(async () => {
      const viewport = document.querySelector<HTMLElement>(
        '[data-radix-scroll-area-viewport]',
      );
      const startedAt = performance.now();
      viewport?.scrollTo({ top: 12_000 });
      await new Promise(requestAnimationFrame);
      return performance.now() - startedAt;
    });
    const metrics = await page.evaluate(() => window.__DTP_BENCHMARK__!.readMetrics());
    const initialRenderMs = await page.evaluate(
      () => window.__DTP_BENCHMARK__!.initialRenderMs,
    );

    expect(metrics.domNodes).toBeGreaterThan(0);
    console.log(
      JSON.stringify({
        scenario: scenario.name,
        rows: scenario.rows,
        columns: scenario.columns,
        initialRenderMs,
        searchSettleMs,
        scrollFrameMs,
        ...metrics,
      }),
    );
  });
}
