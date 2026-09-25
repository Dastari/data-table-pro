import * as React from "react";
import type { DataTableUiKit } from "../../core/ui-kit";
import {
  Button as PrimitiveButton,
  Card as PrimitiveCard,
  CardContent as PrimitiveCardContent,
  CardHeader as PrimitiveCardHeader,
  Checkbox as PrimitiveCheckbox,
  DropdownMenuCheckboxItem as PrimitiveDropdownMenuCheckboxItem,
  DropdownMenuContent as PrimitiveDropdownMenuContent,
  DropdownMenuItem as PrimitiveDropdownMenuItem,
  DropdownMenuLabel as PrimitiveDropdownMenuLabel,
  DropdownMenuRadioItem as PrimitiveDropdownMenuRadioItem,
  DropdownMenuSeparator as PrimitiveDropdownMenuSeparator,
  DropdownMenuSubContent as PrimitiveDropdownMenuSubContent,
  DropdownMenuSubTrigger as PrimitiveDropdownMenuSubTrigger,
  Empty as PrimitiveEmpty,
  EmptyDescription as PrimitiveEmptyDescription,
  EmptyMedia as PrimitiveEmptyMedia,
  EmptyTitle as PrimitiveEmptyTitle,
  Input as PrimitiveInput,
  InputGroup as PrimitiveInputGroup,
  PaginationLink as PrimitivePaginationLink,
  ScrollArea as PrimitiveScrollArea,
  ScrollBar as PrimitiveScrollBar,
  SelectContent as PrimitiveSelectContent,
  SelectItem as PrimitiveSelectItem,
  SelectTrigger as PrimitiveSelectTrigger,
  Separator as PrimitiveSeparator,
  Skeleton as PrimitiveSkeleton,
  Table as PrimitiveTable,
  TableBody as PrimitiveTableBody,
  TableCaption as PrimitiveTableCaption,
  TableCell as PrimitiveTableCell,
  TableFooter as PrimitiveTableFooter,
  TableHead as PrimitiveTableHead,
  TableHeader as PrimitiveTableHeader,
  TableRow as PrimitiveTableRow,
  TooltipContent as PrimitiveTooltipContent,
  primitiveUiKit,
} from "../../core/primitive-ui-kit";
import { cn } from "../../lib/utils";

function withClassName<TProps extends { className?: string }>(
  Component: React.ComponentType<TProps>,
  defaultClassName: string,
) {
  return function Wrapped({ className, ...props }: TProps) {
    return (
      <Component
        className={cn(defaultClassName, className)}
        {...(props as TProps)}
      />
    );
  };
}

const GridButton = withClassName(
  PrimitiveButton,
  "rounded-md border border-border bg-card font-mono text-[0.8rem] tracking-[0.045em] text-foreground uppercase shadow-none data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground data-[variant=outline]:bg-card data-[variant=ghost]:border-transparent data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-primary/10 data-[variant=secondary]:bg-primary/12 data-[variant=destructive]:border-rose-400/50 data-[variant=destructive]:bg-rose-500/15 data-[variant=destructive]:text-rose-200",
);
const GridCard = withClassName(
  PrimitiveCard,
  "rounded-md border border-border bg-card font-mono text-foreground shadow-none ring-0",
);
const GridCardHeader = withClassName(PrimitiveCardHeader, "px-5 pt-5 pb-3");
const GridCardContent = withClassName(PrimitiveCardContent, "px-5 pb-5");
const GridCheckbox = withClassName(
  PrimitiveCheckbox,
  "rounded-sm border-border bg-card ring-ring/50 data-checked:bg-primary data-checked:text-primary-foreground data-checked:ring-cyan-300",
);
const GridDropdownMenuContent = withClassName(
  PrimitiveDropdownMenuContent,
  "rounded-md border border-border bg-card font-mono text-foreground shadow-none ring-0 before:hidden **:data-[slot$=-item]:focus:bg-primary/12 **:data-[slot$=-item]:data-highlighted:bg-primary/12 **:data-[slot$=-separator]:bg-primary/18 **:data-[slot$=-trigger]:focus:bg-primary/12",
);
const GridDropdownMenuItem = withClassName(
  PrimitiveDropdownMenuItem,
  "rounded-sm font-mono text-foreground focus:bg-primary/12 focus:text-foreground data-[variant=destructive]:text-rose-200 data-[variant=destructive]:focus:bg-rose-500/15",
);
const GridDropdownMenuCheckboxItem = withClassName(
  PrimitiveDropdownMenuCheckboxItem,
  "rounded-sm font-mono text-foreground focus:bg-primary/12 focus:text-foreground",
);
const GridDropdownMenuRadioItem = withClassName(
  PrimitiveDropdownMenuRadioItem,
  "rounded-sm font-mono text-foreground focus:bg-primary/12 focus:text-foreground",
);
const GridDropdownMenuLabel = withClassName(
  PrimitiveDropdownMenuLabel,
  "font-mono text-[0.68rem] tracking-[0.16em] text-primary uppercase",
);
const GridDropdownMenuSeparator = withClassName(
  PrimitiveDropdownMenuSeparator,
  "bg-primary/20",
);
const GridDropdownMenuSubContent = withClassName(
  PrimitiveDropdownMenuSubContent,
  "rounded-md border border-border bg-card font-mono text-foreground shadow-none ring-0 before:hidden",
);
const GridDropdownMenuSubTrigger = withClassName(
  PrimitiveDropdownMenuSubTrigger,
  "rounded-sm font-mono text-foreground focus:bg-primary/12 focus:text-foreground data-open:bg-primary/12 data-open:text-foreground",
);
const GridEmpty = withClassName(
  PrimitiveEmpty,
  "rounded-md border-border bg-card font-mono text-foreground",
);
const GridEmptyMedia = withClassName(
  PrimitiveEmptyMedia,
  "[&[data-variant=icon]]:rounded-xl [&[data-variant=icon]]:bg-primary/12 [&[data-variant=icon]]:text-primary",
);
const GridEmptyTitle = withClassName(PrimitiveEmptyTitle, "text-foreground");
const GridEmptyDescription = withClassName(
  PrimitiveEmptyDescription,
  "text-muted-foreground",
);
const GridInput = withClassName(
  PrimitiveInput,
  "rounded-md border-border bg-card font-mono text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50",
);
const GridInputGroup = withClassName(
  PrimitiveInputGroup,
  "rounded-md border-border bg-card font-mono text-foreground shadow-none",
);
const GridPaginationLink = withClassName(
  PrimitivePaginationLink,
  "rounded-md border-border bg-card font-mono text-foreground hover:bg-primary/12 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
);
const GridScrollArea = withClassName(PrimitiveScrollArea, "rounded-md bg-card");
const GridScrollBar = withClassName(
  PrimitiveScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-primary/65",
);
const GridSelectTrigger = withClassName(
  PrimitiveSelectTrigger,
  "rounded-md border-border bg-card font-mono text-foreground focus-visible:ring-ring/50",
);
const GridSelectContent = withClassName(
  PrimitiveSelectContent,
  "rounded-md border border-border bg-card font-mono text-foreground ring-0 shadow-none before:hidden",
);
const GridSelectItem = withClassName(
  PrimitiveSelectItem,
  "rounded-sm focus:bg-primary/12 focus:text-foreground",
);
const GridSeparator = withClassName(PrimitiveSeparator, "bg-primary/20");
const GridSkeleton = withClassName(
  PrimitiveSkeleton,
  "rounded-md bg-primary/12",
);
const GridTable = withClassName(
  PrimitiveTable,
  "border-separate border-spacing-0 bg-card font-mono text-[0.84rem] text-foreground shadow-none",
);
const GridTableHeader = withClassName(
  PrimitiveTableHeader,
  "[&_tr]:border-border",
);
const GridTableBody = withClassName(
  PrimitiveTableBody,
  "[&_tr:last-child]:border-b",
);
const GridTableFooter = withClassName(
  PrimitiveTableFooter,
  "border-border bg-primary/10 font-mono",
);
const GridTableHead = withClassName(
  PrimitiveTableHead,
  "h-12 border-b border-border bg-primary/5 px-3 font-mono text-[0.68rem] font-bold tracking-[0.1em] text-primary uppercase",
);
const GridTableRow = withClassName(
  PrimitiveTableRow,
  "border-border hover:bg-primary/10 data-[state=selected]:bg-primary/15",
);
const GridTableCell = withClassName(
  PrimitiveTableCell,
  "border-b border-border px-3 py-3 font-mono text-foreground",
);
const GridTableCaption = withClassName(
  PrimitiveTableCaption,
  "font-mono text-muted-foreground",
);
const GridTooltipContent = withClassName(
  PrimitiveTooltipContent,
  "rounded-md bg-card text-foreground ring-1 ring-ring/50 shadow-none [&>svg]:bg-card [&>svg]:fill-card",
);

export const theGridcnUiKit: DataTableUiKit = {
  ...primitiveUiKit,
  rootClassName: "dtp-thegridcn",
  classNames: {
    card: "hover:bg-primary/10 data-[state=selected]:bg-primary/15",
    cardGrid: "bg-transparent",
    cardItem: "min-w-0",
    cardOverlay: "from-card/95 via-card/75 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-primary/15 ring-ring/50",
    cardUnselected: "border-border",
    cardViewport: "bg-transparent",
    cellBorder: "border-border",
    cellSelected: "!bg-primary/15 ring-1 ring-inset ring-ring/50",
    columnGroupHeader: "bg-primary/10 text-primary",
    dragActive: "rounded-md border-dashed border-primary",
    emptyState: "border-border bg-card",
    footer: "font-mono text-muted-foreground",
    headerSortIcon: "text-muted-foreground",
    mutedText: "text-muted-foreground",
    paginationSelectTrigger: "border-border bg-card text-foreground",
    paginationTotal: "text-muted-foreground",
    pinnedColumn: "border-border",
    pinnedUtilityColumn: "bg-card",
    resizeHandle: "after:bg-primary/20 hover:after:bg-primary",
    resizeHandleActive: "after:bg-primary",
    row: "hover:bg-primary/10 data-[state=selected]:!bg-primary/15",
    rowSelected: "!bg-primary/15",
    tableContainer: "border-border bg-card text-foreground shadow-none",
    tableScrollArea: "bg-card",
    tableStickyHeader:
      "sticky top-0 z-30 bg-card backdrop-blur [&_th]:border-border [&_th]:bg-card",
    toolbarCompactIconButton: "size-7",
    toolbarIconButton: "text-muted-foreground hover:text-foreground",
    toolbarInputButton: "border-border bg-card text-foreground",
  },
  Button: GridButton,
  Card: GridCard,
  CardContent: GridCardContent,
  CardHeader: GridCardHeader,
  Checkbox: GridCheckbox,
  DropdownMenuCheckboxItem: GridDropdownMenuCheckboxItem,
  DropdownMenuContent: GridDropdownMenuContent,
  DropdownMenuItem: GridDropdownMenuItem,
  DropdownMenuLabel: GridDropdownMenuLabel,
  DropdownMenuRadioItem: GridDropdownMenuRadioItem,
  DropdownMenuSeparator: GridDropdownMenuSeparator,
  DropdownMenuSubContent: GridDropdownMenuSubContent,
  DropdownMenuSubTrigger: GridDropdownMenuSubTrigger,
  Empty: GridEmpty,
  EmptyDescription: GridEmptyDescription,
  EmptyMedia: GridEmptyMedia,
  EmptyTitle: GridEmptyTitle,
  Input: GridInput,
  InputGroup: GridInputGroup,
  PaginationLink: GridPaginationLink,
  ScrollArea: GridScrollArea,
  ScrollBar: GridScrollBar,
  SelectContent: GridSelectContent,
  SelectItem: GridSelectItem,
  SelectTrigger: GridSelectTrigger,
  Separator: GridSeparator,
  Skeleton: GridSkeleton,
  Table: GridTable,
  TableBody: GridTableBody,
  TableCaption: GridTableCaption,
  TableCell: GridTableCell,
  TableFooter: GridTableFooter,
  TableHead: GridTableHead,
  TableHeader: GridTableHeader,
  TableRow: GridTableRow,
  TooltipContent: GridTooltipContent,
};
