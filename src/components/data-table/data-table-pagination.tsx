import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type DataTablePaginationProps = {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  rowsPerPageOptions: Array<number>;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function DataTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  rowsPerPageOptions,
  onPageIndexChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const pages = getVisiblePages(pageIndex, Math.max(1, pageCount));

  return (
    <div className="flex flex-row justify-between gap-4 rounded-md border bg-card p-2 px-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="hidden md:block">Records per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            onPageSizeChange(Number(value));
          }}
        >
          <SelectTrigger className="w-22 border-border bg-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-end gap-4">
        <div className="text-sm text-muted-foreground">
          Page {pageIndex + 1} of {Math.max(1, pageCount)}
        </div>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={pageIndex <= 0}
                    onClick={() => {
                      onPageIndexChange(Math.max(0, pageIndex - 1));
                    }}
                    aria-label="Go to previous page"
                  >
                    <IconChevronLeft />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous page</TooltipContent>
              </Tooltip>
            </PaginationItem>
            {pages.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={item === pageIndex + 1}
                    size="icon-sm"
                    onClick={(event) => {
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={pageIndex + 1 >= pageCount}
                    onClick={() => {
                      onPageIndexChange(pageIndex + 1);
                    }}
                    aria-label="Go to next page"
                  >
                    <IconChevronRight />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next page</TooltipContent>
              </Tooltip>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
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
