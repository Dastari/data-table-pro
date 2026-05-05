import * as React from "react";
import type { DataTableUiKit } from "../../core/ui-kit";
import { cn } from "../../lib/utils";
import {
  Button as ShadcnButton,
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardHeader as ShadcnCardHeader,
  Checkbox as ShadcnCheckbox,
  DropdownMenuCheckboxItem as ShadcnDropdownMenuCheckboxItem,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuRadioItem as ShadcnDropdownMenuRadioItem,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuSubContent as ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger as ShadcnDropdownMenuSubTrigger,
  Empty as ShadcnEmpty,
  EmptyDescription as ShadcnEmptyDescription,
  EmptyMedia as ShadcnEmptyMedia,
  EmptyTitle as ShadcnEmptyTitle,
  Input as ShadcnInput,
  InputGroup as ShadcnInputGroup,
  PaginationLink as ShadcnPaginationLink,
  ScrollArea as ShadcnScrollArea,
  ScrollBar as ShadcnScrollBar,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  Separator as ShadcnSeparator,
  Skeleton as ShadcnSkeleton,
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCaption as ShadcnTableCaption,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
  TooltipContent as ShadcnTooltipContent,
  shadcnUiKit,
} from "../shadcn";

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
  ShadcnButton,
  "rounded-md border border-cyan-400/45 bg-black/75 font-mono text-[0.8rem] tracking-[0.045em] text-cyan-50 uppercase shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_18px_rgba(34,211,238,0.1)] data-[variant=default]:bg-cyan-300 data-[variant=default]:text-slate-950 data-[variant=outline]:bg-black/55 data-[variant=ghost]:border-transparent data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-cyan-400/10 data-[variant=secondary]:bg-cyan-400/12 data-[variant=destructive]:border-rose-400/50 data-[variant=destructive]:bg-rose-500/15 data-[variant=destructive]:text-rose-200",
);
const GridCard = withClassName(
  ShadcnCard,
  "rounded-md border border-cyan-400/35 bg-[linear-gradient(180deg,rgba(0,229,255,0.055),transparent_58%),rgba(1,8,11,0.9)] font-mono text-cyan-50 shadow-[inset_0_1px_0_rgba(125,211,252,0.08),0_0_0_1px_rgba(34,211,238,0.12),0_0_28px_rgba(34,211,238,0.08)] ring-0",
);
const GridCardHeader = withClassName(ShadcnCardHeader, "px-5 pt-5 pb-3");
const GridCardContent = withClassName(ShadcnCardContent, "px-5 pb-5");
const GridCheckbox = withClassName(
  ShadcnCheckbox,
  "rounded-sm border-cyan-400/55 bg-black/65 ring-cyan-300/70 data-checked:bg-cyan-300 data-checked:text-slate-950 data-checked:ring-cyan-300",
);
const GridDropdownMenuContent = withClassName(
  ShadcnDropdownMenuContent,
  "rounded-md border border-cyan-400/35 bg-black/92 font-mono text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.16)] ring-0 before:hidden **:data-[slot$=-item]:focus:bg-cyan-400/12 **:data-[slot$=-item]:data-highlighted:bg-cyan-400/12 **:data-[slot$=-separator]:bg-cyan-400/18 **:data-[slot$=-trigger]:focus:bg-cyan-400/12",
);
const GridDropdownMenuItem = withClassName(
  ShadcnDropdownMenuItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50 data-[variant=destructive]:text-rose-200 data-[variant=destructive]:focus:bg-rose-500/15",
);
const GridDropdownMenuCheckboxItem = withClassName(
  ShadcnDropdownMenuCheckboxItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50",
);
const GridDropdownMenuRadioItem = withClassName(
  ShadcnDropdownMenuRadioItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50",
);
const GridDropdownMenuLabel = withClassName(
  ShadcnDropdownMenuLabel,
  "font-mono text-[0.68rem] tracking-[0.16em] text-cyan-200/70 uppercase",
);
const GridDropdownMenuSeparator = withClassName(
  ShadcnDropdownMenuSeparator,
  "bg-cyan-400/20",
);
const GridDropdownMenuSubContent = withClassName(
  ShadcnDropdownMenuSubContent,
  "rounded-md border border-cyan-400/35 bg-black/92 font-mono text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.16)] ring-0 before:hidden",
);
const GridDropdownMenuSubTrigger = withClassName(
  ShadcnDropdownMenuSubTrigger,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50 data-open:bg-cyan-400/12 data-open:text-cyan-50",
);
const GridEmpty = withClassName(
  ShadcnEmpty,
  "rounded-md border-cyan-400/35 bg-black/80 font-mono text-cyan-50",
);
const GridEmptyMedia = withClassName(
  ShadcnEmptyMedia,
  "[&[data-variant=icon]]:rounded-xl [&[data-variant=icon]]:bg-cyan-400/12 [&[data-variant=icon]]:text-cyan-200",
);
const GridEmptyTitle = withClassName(ShadcnEmptyTitle, "text-cyan-50");
const GridEmptyDescription = withClassName(
  ShadcnEmptyDescription,
  "text-cyan-100/70",
);
const GridInput = withClassName(
  ShadcnInput,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 placeholder:text-cyan-100/45 focus-visible:ring-cyan-300/70",
);
const GridInputGroup = withClassName(
  ShadcnInputGroup,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.06)]",
);
const GridPaginationLink = withClassName(
  ShadcnPaginationLink,
  "rounded-md border-cyan-400/35 bg-black/55 font-mono text-cyan-50 hover:bg-cyan-400/12 data-[active=true]:bg-cyan-300 data-[active=true]:text-slate-950",
);
const GridScrollArea = withClassName(
  ShadcnScrollArea,
  "rounded-md border border-cyan-400/35 bg-black/72 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_26px_rgba(34,211,238,0.08)]",
);
const GridScrollBar = withClassName(
  ShadcnScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-cyan-300/65",
);
const GridSelectTrigger = withClassName(
  ShadcnSelectTrigger,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 focus-visible:ring-cyan-300/70",
);
const GridSelectContent = withClassName(
  ShadcnSelectContent,
  "rounded-md border border-cyan-400/35 bg-black/95 font-mono text-cyan-50 ring-0 shadow-[0_0_26px_rgba(34,211,238,0.16)] before:hidden",
);
const GridSelectItem = withClassName(
  ShadcnSelectItem,
  "rounded-sm focus:bg-cyan-400/12 focus:text-cyan-50",
);
const GridSeparator = withClassName(
  ShadcnSeparator,
  "bg-cyan-400/20",
);
const GridSkeleton = withClassName(
  ShadcnSkeleton,
  "rounded-md bg-cyan-400/12",
);
const GridTable = withClassName(
  ShadcnTable,
  "border-separate border-spacing-0 border border-cyan-400/45 bg-black/72 font-mono text-[0.84rem] text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_24px_rgba(34,211,238,0.08)]",
);
const GridTableHeader = withClassName(
  ShadcnTableHeader,
  "[&_tr]:border-cyan-400/45",
);
const GridTableBody = withClassName(
  ShadcnTableBody,
  "[&_tr:last-child]:border-b",
);
const GridTableFooter = withClassName(
  ShadcnTableFooter,
  "border-cyan-400/40 bg-cyan-400/10 font-mono",
);
const GridTableHead = withClassName(
  ShadcnTableHead,
  "h-12 border-b border-cyan-400/45 bg-cyan-950/20 px-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] text-cyan-300 uppercase",
);
const GridTableRow = withClassName(
  ShadcnTableRow,
  "border-cyan-400/25 hover:bg-cyan-400/10 data-[state=selected]:bg-cyan-400/15",
);
const GridTableCell = withClassName(
  ShadcnTableCell,
  "border-b border-cyan-400/16 px-3 py-3 font-mono text-cyan-50",
);
const GridTableCaption = withClassName(
  ShadcnTableCaption,
  "font-mono text-cyan-100/65",
);
const GridTooltipContent = withClassName(
  ShadcnTooltipContent,
  "rounded-md bg-black text-cyan-50 ring-1 ring-cyan-400/35 shadow-[0_0_22px_rgba(34,211,238,0.18)] [&>svg]:bg-black [&>svg]:fill-black",
);

export const theGridcnUiKit: DataTableUiKit = {
  ...shadcnUiKit,
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
