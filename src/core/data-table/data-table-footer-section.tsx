import * as React from "react";
import type { PaginationState } from "@tanstack/react-table";
import type { DataTableLabels } from "../types";

type DataTableFooterSectionProps = {
  children?: React.ReactNode;
  currentPagination: PaginationState;
  DataTableFooter: React.ElementType;
  effectivePageCount: number;
  footerTotalRowCount: number;
  handleFooterPageIndexChange: (pageIndex: number) => void;
  handleFooterPageSizeChange: (pageSize: number) => void;
  labels: DataTableLabels;
  rowsPerPageOptions: Array<number>;
  showFooter: boolean;
};

export function DataTableFooterSection({
  children,
  currentPagination,
  DataTableFooter,
  effectivePageCount,
  footerTotalRowCount,
  handleFooterPageIndexChange,
  handleFooterPageSizeChange,
  labels,
  rowsPerPageOptions,
  showFooter,
}: DataTableFooterSectionProps) {
  if (!showFooter && !children) {
    return null;
  }

  return (
    <div data-dtp-slot="data-table-footer" className="shrink-0">
      {showFooter ? (
        <DataTableFooter
          pageIndex={currentPagination.pageIndex}
          pageCount={effectivePageCount}
          pageSize={currentPagination.pageSize}
          totalRowCount={footerTotalRowCount}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageIndexChange={handleFooterPageIndexChange}
          onPageSizeChange={handleFooterPageSizeChange}
          labels={labels}
        />
      ) : null}
      {children}
    </div>
  );
}
