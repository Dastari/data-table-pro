import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DataTableTablePanel } from "./data-table-table-panel";
import type { DataTableTablePanelProps } from "./data-table-table-panel";
import { DataTableVirtualRowMeasurementProvider } from "./data-table-virtual-row-measurement";

export function DataTableVirtualTablePanel<TData>(
  props: DataTableTablePanelProps<TData>,
) {
  const {
    renderedRows,
    shouldRenderInitialLoading,
    tableScrollElement,
    viewportHeight = 0,
    virtualization,
  } = props;
  const virtualizationConfig =
    typeof virtualization === "object" ? virtualization : undefined;
  const enableVirtualization =
    !shouldRenderInitialLoading &&
    (virtualization === true || virtualizationConfig?.enabled === true);
  const shouldUseVirtualRows =
    enableVirtualization && Boolean(tableScrollElement) && viewportHeight > 0;
  const getItemKey = React.useCallback(
    (index: number) => renderedRows[index]?.id ?? index,
    [renderedRows],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual owns its instance functions.
  const rowVirtualizer = useVirtualizer({
    count: enableVirtualization ? renderedRows.length : 0,
    enabled: shouldUseVirtualRows,
    estimateSize: () => virtualizationConfig?.estimateRowHeight ?? 48,
    getItemKey,
    getScrollElement: () => tableScrollElement ?? null,
    overscan: virtualizationConfig?.overscan ?? 8,
  });
  const virtualItems = shouldUseVirtualRows
    ? rowVirtualizer.getVirtualItems()
    : [];
  const rowsToRender = shouldUseVirtualRows
    ? virtualItems.flatMap((virtualItem) => {
        const row = renderedRows[virtualItem.index];
        return row ? [{ row, rowIndex: virtualItem.index }] : [];
      })
    : renderedRows
        .slice(
          0,
          Math.max(
            1,
            Math.floor(virtualizationConfig?.fallbackRowCount ?? 20),
          ),
        )
        .map((row, rowIndex) => ({ row, rowIndex }));
  const virtualPaddingTop = shouldUseVirtualRows
    ? (virtualItems[0]?.start ?? 0)
    : 0;
  const virtualPaddingBottom = shouldUseVirtualRows
    ? Math.max(
        0,
        rowVirtualizer.getTotalSize() -
          (virtualItems.at(-1)?.end ?? virtualPaddingTop),
      )
    : 0;
  const handleGridActiveRowIndexChange = React.useCallback(
    (gridRowIndex: number) => {
      if (!props.gridMode || !shouldUseVirtualRows) return;
      rowVirtualizer.scrollToIndex(
        Math.max(0, gridRowIndex - props.topPinnedRows.length),
        { align: "auto" },
      );
    },
    [
      props.gridMode,
      props.topPinnedRows.length,
      rowVirtualizer,
      shouldUseVirtualRows,
    ],
  );
  const measureRow = React.useCallback<React.RefCallback<HTMLTableRowElement>>(
    (element) => {
      if (element) {
        rowVirtualizer.measureElement(element);
      }
    },
    [rowVirtualizer],
  );

  return (
    <DataTableVirtualRowMeasurementProvider
      measureRow={shouldUseVirtualRows ? measureRow : undefined}
    >
      <DataTableTablePanel
        {...props}
        rowsToRender={rowsToRender}
        virtualPaddingBottom={virtualPaddingBottom}
        virtualPaddingTop={virtualPaddingTop}
        onGridActiveRowIndexChange={handleGridActiveRowIndexChange}
      />
    </DataTableVirtualRowMeasurementProvider>
  );
}
