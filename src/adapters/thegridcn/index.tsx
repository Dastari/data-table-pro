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
  "rounded-md border border-cyan-400/45 bg-black/75 font-mono text-[0.8rem] tracking-[0.045em] text-cyan-50 uppercase shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_18px_rgba(34,211,238,0.1)] data-[variant=default]:bg-cyan-300 data-[variant=default]:text-slate-950 data-[variant=outline]:bg-black/55 data-[variant=ghost]:border-transparent data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-cyan-400/10 data-[variant=secondary]:bg-cyan-400/12 data-[variant=destructive]:border-rose-400/50 data-[variant=destructive]:bg-rose-500/15 data-[variant=destructive]:text-rose-200",
);
const GridCard = withClassName(
  PrimitiveCard,
  "rounded-md border border-cyan-400/35 bg-[linear-gradient(180deg,rgba(0,229,255,0.055),transparent_58%),rgba(1,8,11,0.9)] font-mono text-cyan-50 shadow-[inset_0_1px_0_rgba(125,211,252,0.08),0_0_0_1px_rgba(34,211,238,0.12),0_0_28px_rgba(34,211,238,0.08)] ring-0",
);
const GridCardHeader = withClassName(PrimitiveCardHeader, "px-5 pt-5 pb-3");
const GridCardContent = withClassName(PrimitiveCardContent, "px-5 pb-5");
const GridCheckbox = withClassName(
  PrimitiveCheckbox,
  "rounded-sm border-cyan-400/55 bg-black/65 ring-cyan-300/70 data-checked:bg-cyan-300 data-checked:text-slate-950 data-checked:ring-cyan-300",
);
const GridDropdownMenuContent = withClassName(
  PrimitiveDropdownMenuContent,
  "rounded-md border border-cyan-400/35 bg-black/92 font-mono text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.16)] ring-0 before:hidden **:data-[slot$=-item]:focus:bg-cyan-400/12 **:data-[slot$=-item]:data-highlighted:bg-cyan-400/12 **:data-[slot$=-separator]:bg-cyan-400/18 **:data-[slot$=-trigger]:focus:bg-cyan-400/12",
);
const GridDropdownMenuItem = withClassName(
  PrimitiveDropdownMenuItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50 data-[variant=destructive]:text-rose-200 data-[variant=destructive]:focus:bg-rose-500/15",
);
const GridDropdownMenuCheckboxItem = withClassName(
  PrimitiveDropdownMenuCheckboxItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50",
);
const GridDropdownMenuRadioItem = withClassName(
  PrimitiveDropdownMenuRadioItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50",
);
const GridDropdownMenuLabel = withClassName(
  PrimitiveDropdownMenuLabel,
  "font-mono text-[0.68rem] tracking-[0.16em] text-cyan-200/70 uppercase",
);
const GridDropdownMenuSeparator = withClassName(
  PrimitiveDropdownMenuSeparator,
  "bg-cyan-400/20",
);
const GridDropdownMenuSubContent = withClassName(
  PrimitiveDropdownMenuSubContent,
  "rounded-md border border-cyan-400/35 bg-black/92 font-mono text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.16)] ring-0 before:hidden",
);
const GridDropdownMenuSubTrigger = withClassName(
  PrimitiveDropdownMenuSubTrigger,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50 data-open:bg-cyan-400/12 data-open:text-cyan-50",
);
const GridEmpty = withClassName(
  PrimitiveEmpty,
  "rounded-md border-cyan-400/35 bg-black/80 font-mono text-cyan-50",
);
const GridEmptyMedia = withClassName(
  PrimitiveEmptyMedia,
  "[&[data-variant=icon]]:rounded-xl [&[data-variant=icon]]:bg-cyan-400/12 [&[data-variant=icon]]:text-cyan-200",
);
const GridEmptyTitle = withClassName(PrimitiveEmptyTitle, "text-cyan-50");
const GridEmptyDescription = withClassName(
  PrimitiveEmptyDescription,
  "text-cyan-100/70",
);
const GridInput = withClassName(
  PrimitiveInput,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 placeholder:text-cyan-100/45 focus-visible:ring-cyan-300/70",
);
const GridInputGroup = withClassName(
  PrimitiveInputGroup,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.06)]",
);
const GridPaginationLink = withClassName(
  PrimitivePaginationLink,
  "rounded-md border-cyan-400/35 bg-black/55 font-mono text-cyan-50 hover:bg-cyan-400/12 data-[active=true]:bg-cyan-300 data-[active=true]:text-slate-950",
);
const GridScrollArea = withClassName(
  PrimitiveScrollArea,
  "rounded-md border border-cyan-400/35 bg-black/72 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_26px_rgba(34,211,238,0.08)]",
);
const GridScrollBar = withClassName(
  PrimitiveScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-cyan-300/65",
);
const GridSelectTrigger = withClassName(
  PrimitiveSelectTrigger,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 focus-visible:ring-cyan-300/70",
);
const GridSelectContent = withClassName(
  PrimitiveSelectContent,
  "rounded-md border border-cyan-400/35 bg-black/95 font-mono text-cyan-50 ring-0 shadow-[0_0_26px_rgba(34,211,238,0.16)] before:hidden",
);
const GridSelectItem = withClassName(
  PrimitiveSelectItem,
  "rounded-sm focus:bg-cyan-400/12 focus:text-cyan-50",
);
const GridSeparator = withClassName(PrimitiveSeparator, "bg-cyan-400/20");
const GridSkeleton = withClassName(
  PrimitiveSkeleton,
  "rounded-md bg-cyan-400/12",
);
const GridTable = withClassName(
  PrimitiveTable,
  "border-separate border-spacing-0 border border-cyan-400/45 bg-black/72 font-mono text-[0.84rem] text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_24px_rgba(34,211,238,0.08)]",
);
const GridTableHeader = withClassName(
  PrimitiveTableHeader,
  "[&_tr]:border-cyan-400/45",
);
const GridTableBody = withClassName(
  PrimitiveTableBody,
  "[&_tr:last-child]:border-b",
);
const GridTableFooter = withClassName(
  PrimitiveTableFooter,
  "border-cyan-400/40 bg-cyan-400/10 font-mono",
);
const GridTableHead = withClassName(
  PrimitiveTableHead,
  "h-12 border-b border-cyan-400/45 bg-cyan-950/20 px-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] text-cyan-300 uppercase",
);
const GridTableRow = withClassName(
  PrimitiveTableRow,
  "border-cyan-400/25 hover:bg-cyan-400/10 data-[state=selected]:bg-cyan-400/15",
);
const GridTableCell = withClassName(
  PrimitiveTableCell,
  "border-b border-cyan-400/16 px-3 py-3 font-mono text-cyan-50",
);
const GridTableCaption = withClassName(
  PrimitiveTableCaption,
  "font-mono text-cyan-100/65",
);
const GridTooltipContent = withClassName(
  PrimitiveTooltipContent,
  "rounded-md bg-black text-cyan-50 ring-1 ring-cyan-400/35 shadow-[0_0_22px_rgba(34,211,238,0.18)] [&>svg]:bg-black [&>svg]:fill-black",
);

export const theGridcnUiKit: DataTableUiKit = {
  ...primitiveUiKit,
  rootClassName: "dtp-thegridcn",
  classNames: {
    card: "hover:bg-cyan-400/10 data-[state=selected]:bg-cyan-400/15",
    cardGrid: "bg-transparent",
    cardItem: "min-w-0",
    cardOverlay: "from-black/95 via-black/75 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-cyan-400/15 ring-cyan-300/70",
    cardUnselected: "border-cyan-400/35",
    cardViewport: "bg-transparent",
    cellBorder: "border-cyan-400/16",
    columnGroupHeader: "bg-cyan-400/10 text-cyan-200",
    dragActive: "rounded-md border-dashed border-cyan-300",
    emptyState: "border-cyan-400/35 bg-black/80",
    footer: "border-cyan-400/40 bg-black/80 text-cyan-50",
    headerSortIcon: "text-cyan-100/65",
    mutedText: "text-cyan-100/70",
    paginationSelectTrigger: "border-cyan-400/45 bg-black/70 text-cyan-50",
    paginationTotal: "text-cyan-100/70",
    pinnedColumn: "border-cyan-400/25",
    pinnedUtilityColumn: "bg-black/80",
    resizeHandle: "after:bg-cyan-400/20 hover:after:bg-cyan-300",
    resizeHandleActive: "after:bg-cyan-300",
    row: "hover:bg-cyan-400/10 data-[state=selected]:!bg-cyan-400/15",
    rowSelected: "!bg-cyan-400/15",
    tableContainer:
      "border-cyan-400/35 bg-black/72 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_26px_rgba(34,211,238,0.08)]",
    tableScrollArea: "bg-black/72",
    tableStickyHeader:
      "sticky top-0 z-30 bg-black/90 backdrop-blur [&_th]:border-cyan-400/45 [&_th]:bg-black/90",
    toolbarCompactIconButton: "size-7",
    toolbarIconButton: "text-cyan-100/70 hover:text-cyan-50",
    toolbarInputButton: "border-cyan-400/45 bg-black/70 text-cyan-50",
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
