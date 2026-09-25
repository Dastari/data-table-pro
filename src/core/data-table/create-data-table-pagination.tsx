import * as React from "react";
import type { DataTableLabels } from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { DATA_TABLE_DEFAULT_LABELS } from "./data-table-labels";

type DataTablePaginationProps = {
  countOnly?: boolean;
  pageIndex: number;
  pageCount: number;
  pageCountKnown: boolean;
  pageSize: number;
  totalRowCount?: number;
  rowsPerPageOptions: Array<number>;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  labels: DataTableLabels;
};

export function createDataTablePagination(ui: DataTableUiKit) {
  const uiClassNames = ui.classNames ?? {};
  const {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } = ui;

  function DataTablePagination({
    countOnly = false,
    pageIndex,
    pageCount,
    pageCountKnown,
    pageSize,
    totalRowCount,
    rowsPerPageOptions,
    onPageIndexChange,
    onPageSizeChange,
    labels,
  }: DataTablePaginationProps) {
    const pages = pageCountKnown
      ? getVisiblePages(pageIndex, Math.max(1, pageCount))
      : [];
    const canGoPrevious = pageIndex > 0;
    const canGoNext = pageIndex + 1 < pageCount;
    const lastPageIndex = Math.max(0, pageCount - 1);
    const totalRecordCount =
      totalRowCount !== undefined ? (
        <div className="flex shrink-0 items-center">
          <div
            className={`inline-flex items-center text-xs tabular-nums ${uiClassNames.paginationTotal ?? ""}`}
            aria-label={labels.totalRecords(totalRowCount)}
          >
            <span>{labels.totalRecords(totalRowCount)}</span>
          </div>
        </div>
      ) : null;

    if (countOnly) {
      return <div className="flex justify-start">{totalRecordCount}</div>;
    }

    return (
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {totalRecordCount}
        <div
          className={`ml-auto flex items-center gap-2 text-xs ${uiClassNames.mutedText ?? "opacity-70"}`}
        >
          <span className="hidden @min-[768px]/data-table:inline">
            {labels.recordsPerPage}
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value: string) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger
              aria-label={labels.recordsPerPage}
              className={`h-8 w-18 text-xs ${uiClassNames.paginationSelectTrigger ?? ""}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {rowsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div
            className={`hidden text-xs tabular-nums @min-[1024px]/data-table:inline ${uiClassNames.mutedText ?? "opacity-70"}`}
          >
            {pageCountKnown
              ? labels.pageStatus(pageIndex, Math.max(1, pageCount))
              : (
                  labels.pageStatusUnknown ??
                  DATA_TABLE_DEFAULT_LABELS.pageStatusUnknown
                )(pageIndex)}
          </div>
          <Pagination
            aria-label={
              labels.pagination ?? DATA_TABLE_DEFAULT_LABELS.pagination
            }
            className="mx-0 w-auto justify-end"
          >
            <PaginationContent>
              <PaginationItem className="@min-[768px]/data-table:hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationFirst
                      aria-label={labels.firstPage}
                      href="#"
                      size="icon-sm"
                      showText={false}
                      disabled={!canGoPrevious}
                      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        if (canGoPrevious) {
                          onPageIndexChange(0);
                        }
                      }}
                      text={labels.firstPage}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{labels.firstPage}</TooltipContent>
                </Tooltip>
              </PaginationItem>
              <PaginationItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationPrevious
                      aria-label={labels.previousPage}
                      href="#"
                      size="icon-sm"
                      showText={false}
                      disabled={!canGoPrevious}
                      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        if (canGoPrevious) {
                          onPageIndexChange(pageIndex - 1);
                        }
                      }}
                      text={labels.previousPage}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{labels.previousPage}</TooltipContent>
                </Tooltip>
              </PaginationItem>
              {pages.map((item, index) => (
                <PaginationItem
                  key={`${item}-${index}`}
                  className="hidden @min-[768px]/data-table:block"
                >
                  {item === "ellipsis" ? (
                    <PaginationEllipsis
                      text={
                        labels.morePages ?? DATA_TABLE_DEFAULT_LABELS.morePages
                      }
                    />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === pageIndex + 1}
                      size="icon-sm"
                      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        onPageIndexChange(item - 1);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationNext
                      aria-label={labels.nextPage}
                      href="#"
                      size="icon-sm"
                      showText={false}
                      disabled={!canGoNext}
                      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        if (canGoNext) {
                          onPageIndexChange(pageIndex + 1);
                        }
                      }}
                      text={labels.nextPage}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{labels.nextPage}</TooltipContent>
                </Tooltip>
              </PaginationItem>
              {pageCountKnown ? (
                <PaginationItem className="@min-[768px]/data-table:hidden">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PaginationLast
                        aria-label={labels.lastPage}
                        href="#"
                        size="icon-sm"
                        showText={false}
                        text={labels.lastPage}
                        disabled={!canGoNext}
                        onClick={(
                          event: React.MouseEvent<HTMLAnchorElement>,
                        ) => {
                          event.preventDefault();
                          if (canGoNext) {
                            onPageIndexChange(lastPageIndex);
                          }
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{labels.lastPage}</TooltipContent>
                  </Tooltip>
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }

  function DataTableFooter(props: DataTablePaginationProps) {
    return (
      <div className={`px-1 py-2 ${uiClassNames.footer ?? ""}`}>
        <DataTablePagination {...props} />
      </div>
    );
  }

  function DataTableCountOnlyFooter(props: DataTablePaginationProps) {
    return <DataTableFooter {...props} countOnly />;
  }

  return {
    DataTableCountOnlyFooter,
    DataTableFooter,
    DataTablePagination,
  };
}

function getVisiblePages(currentPageIndex: number, pageCount: number) {
  const currentPage = currentPageIndex + 1;
  const pages = new Set<number>([1, pageCount]);

  for (
    let page = Math.max(1, currentPage - 2);
    page <= Math.min(pageCount, currentPage + 2);
    page += 1
  ) {
    pages.add(page);
  }

  const orderedPages = Array.from(pages).sort((left, right) => left - right);
  const items: Array<number | "ellipsis"> = [];

  for (let index = 0; index < orderedPages.length; index += 1) {
    const page = orderedPages[index];
    const previous = orderedPages[index - 1];

    if (previous && page - previous > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  }

  return items;
}
