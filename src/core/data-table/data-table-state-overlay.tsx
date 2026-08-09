import * as React from "react";
import type {
  DataTableLabels,
  DataTableStateOverlay,
  DataTableStateOverlayContext,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";

export function createDataTableStateOverlay(ui: DataTableUiKit) {
  const { Button } = ui;

  return function DataTableStateOverlay<TData>({
    labels,
    overlay,
    rows,
    toolbarQueryValue,
  }: {
    labels: DataTableLabels;
    overlay: DataTableStateOverlay<TData>;
    rows: Array<TData>;
    toolbarQueryValue: string;
  }) {
    if (overlay.error == null) {
      return null;
    }
    const context: DataTableStateOverlayContext<TData> = {
      rows,
      toolbarQueryValue,
      error: overlay.error,
      isRetrying: overlay.isRetrying ?? false,
      retry: overlay.onRetry,
    };

    return (
      <div
        data-dtp-slot="data-table-state-overlay"
        className="absolute inset-0 z-40 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
        role="alert"
      >
        {overlay.renderError ? (
          overlay.renderError(context)
        ) : (
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <div className="text-base font-semibold">{labels.errorTitle}</div>
            <p className="text-sm text-muted-foreground">
              {labels.errorDescription}
            </p>
            {overlay.onRetry ? (
              <Button
                type="button"
                disabled={overlay.isRetrying}
                onClick={() => {
                  void overlay.onRetry?.();
                }}
              >
                {labels.retry}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    );
  };
}
