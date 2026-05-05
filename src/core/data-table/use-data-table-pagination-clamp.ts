import * as React from "react";

export function useDataTablePaginationClamp({
  enabled,
  maxPageIndex,
  onPageIndexChange,
  pageIndex,
  setLocalPageIndex,
}: {
  enabled: boolean;
  maxPageIndex: number;
  onPageIndexChange?: (pageIndex: number) => void;
  pageIndex: number;
  setLocalPageIndex: (pageIndex: number) => void;
}) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    if (pageIndex >= 0 && pageIndex <= maxPageIndex) {
      return;
    }

    const nextPageIndex = Math.min(Math.max(pageIndex, 0), maxPageIndex);
    setLocalPageIndex(nextPageIndex);
    onPageIndexChange?.(nextPageIndex);
  }, [enabled, maxPageIndex, onPageIndexChange, pageIndex, setLocalPageIndex]);
}
