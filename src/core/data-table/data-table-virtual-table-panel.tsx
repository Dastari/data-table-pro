import { useVirtualizer } from "@tanstack/react-virtual";
import { DataTableTablePanel } from "./data-table-table-panel";
import type { DataTableTablePanelProps } from "./data-table-table-panel";

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

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual owns its instance functions.
  const rowVirtualizer = useVirtualizer({
    count: enableVirtualization ? renderedRows.length : 0,
    enabled: shouldUseVirtualRows,
    estimateSize: () => virtualizationConfig?.estimateRowHeight ?? 48,
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
    : renderedRows.map((row, rowIndex) => ({ row, rowIndex }));
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

  return (
    <DataTableTablePanel
      {...props}
      rowsToRender={rowsToRender}
      virtualPaddingBottom={virtualPaddingBottom}
      virtualPaddingTop={virtualPaddingTop}
    />
  );
}
