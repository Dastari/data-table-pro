import * as React from "react";
import { IconDatabase } from "@tabler/icons-react";
import type { DataTableUiKit } from "../ui-kit";

type DataTablePaginationProps = {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalRowCount?: number;
  rowsPerPageOptions: Array<number>;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function createDataTablePagination(ui: DataTableUiKit) {
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
    pageIndex,
    pageCount,
    pageSize,
    totalRowCount,
    rowsPerPageOptions,
    onPageIndexChange,
    onPageSizeChange,
  }: DataTablePaginationProps) {
    const pages = getVisiblePages(pageIndex, Math.max(1, pageCount));
    const canGoPrevious = pageIndex > 0;
    const canGoNext = pageIndex + 1 < pageCount;
    const lastPageIndex = Math.max(0, pageCount - 1);

    return (
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 text-sm text-muted-foreground">
          <span className="hidden @md/data-table:inline">Records per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value: string) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="w-22 border-border bg-input">
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

        <div className="flex shrink-0 items-center justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-lg bg-input px-2.5 py-1.5 text-sm text-muted-foreground"
            aria-label={`Total records: ${totalRowCount ?? 0}`}
          >
            <IconDatabase className="size-4" />
            <span className="@md/data-table:hidden">{totalRowCount ?? 0}</span>
            <span className="hidden @md/data-table:inline">
              Total Records {totalRowCount ?? 0}
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden text-sm text-muted-foreground @md/data-table:inline">
            Page {pageIndex + 1} of {Math.max(1, pageCount)}
          </div>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem className="@md/data-table:hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationFirst
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
                    >
                      First
                    </PaginationFirst>
                  </TooltipTrigger>
                  <TooltipContent>First page</TooltipContent>
                </Tooltip>
              </PaginationItem>
              <PaginationItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationPrevious
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
                    >
                      Previous
                    </PaginationPrevious>
                  </TooltipTrigger>
                  <TooltipContent>Previous page</TooltipContent>
                </Tooltip>
              </PaginationItem>
              {pages.map((item, index) => (
                <PaginationItem
                  key={`${item}-${index}`}
                  className="hidden @md/data-table:block"
                >
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
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
                    >
                      Next
                    </PaginationNext>
                  </TooltipTrigger>
                  <TooltipContent>Next page</TooltipContent>
                </Tooltip>
              </PaginationItem>
              <PaginationItem className="@md/data-table:hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationLast
                      href="#"
                      size="icon-sm"
                      showText={false}
                      disabled={!canGoNext}
                      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        if (canGoNext) {
                          onPageIndexChange(lastPageIndex);
                        }
                      }}
                    >
                      Last
                    </PaginationLast>
                  </TooltipTrigger>
                  <TooltipContent>Last page</TooltipContent>
                </Tooltip>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }

  function DataTableFooter(props: DataTablePaginationProps) {
    return (
      <div className="rounded-md border border-border bg-card px-2 py-1">
        <DataTablePagination {...props} />
      </div>
    );
  }

  return {
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
