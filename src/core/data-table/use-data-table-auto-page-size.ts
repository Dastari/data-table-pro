import * as React from "react";
import type { DataTableAutoPageSizeConfig } from "../types";

export function useDataTableAutoPageSize({
  config,
  currentPageSize,
  enabled,
  onPageSizeChange,
  viewportElement,
  viewportHeight,
}: {
  config: DataTableAutoPageSizeConfig | undefined;
  currentPageSize: number;
  enabled: boolean;
  onPageSizeChange: (pageSize: number) => void;
  viewportElement: HTMLElement | null;
  viewportHeight: number;
}) {
  const lastRequestedPageSize = React.useRef<number | null>(null);
  const feedbackGuard = React.useRef<{
    pageSize: number;
    viewportHeight: number;
  } | null>(null);

  React.useEffect(() => {
    if (!enabled || !viewportElement || viewportHeight <= 0) {
      lastRequestedPageSize.current = null;
      return;
    }

    let frameId: number | null = null;
    const update = () => {
      frameId = null;
      const row = viewportElement.querySelector<HTMLElement>(
        '[data-dtp-slot="data-table-row"]',
      );
      const rowHeight = Math.max(
        1,
        row?.getBoundingClientRect().height || config?.estimateRowHeight || 48,
      );
      const minRows = Math.max(1, Math.floor(config?.minRows ?? 1));
      const maxRows = Math.max(minRows, Math.floor(config?.maxRows ?? 100));
      const table = viewportElement.querySelector("table");
      const occupiedHeight = table
        ? Array.from(table.querySelectorAll("thead, tfoot")).reduce(
            (total, element) => total + element.getBoundingClientRect().height,
            0,
          )
        : 0;
      const bodyHeight = Math.max(0, viewportElement.clientHeight - occupiedHeight);
      const nextPageSize = Math.min(
        maxRows,
        Math.max(minRows, Math.floor(bodyHeight / rowHeight)),
      );

      const previousRequest = feedbackGuard.current;
      if (
        previousRequest?.pageSize === currentPageSize &&
        viewportElement.clientHeight > previousRequest.viewportHeight &&
        nextPageSize > currentPageSize
      ) {
        // A content-sized viewport can grow in response to the rows we just
        // added. Do not recursively turn that growth into another request.
        feedbackGuard.current = null;
        return;
      }

      if (
        nextPageSize === currentPageSize ||
        nextPageSize === lastRequestedPageSize.current
      ) {
        return;
      }
      lastRequestedPageSize.current = nextPageSize;
      feedbackGuard.current = {
        pageSize: nextPageSize,
        viewportHeight: viewportElement.clientHeight,
      };
      onPageSizeChange(nextPageSize);
    };
    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    scheduleUpdate();
    if (typeof ResizeObserver === "undefined") {
      return () => {
        if (frameId !== null) window.cancelAnimationFrame(frameId);
      };
    }

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(viewportElement);
    const row = viewportElement.querySelector<HTMLElement>(
      '[data-dtp-slot="data-table-row"]',
    );
    if (row) observer.observe(row);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [
    config,
    currentPageSize,
    enabled,
    onPageSizeChange,
    viewportElement,
    viewportHeight,
  ]);
}
