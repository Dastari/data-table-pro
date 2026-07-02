import { primitiveUiKit, createDataTable, cn, Button, Card, CardHeader, CardContent, Checkbox, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, Empty, EmptyMedia, EmptyTitle, EmptyDescription, Input, InputGroup, PaginationLink, ScrollArea, ScrollBar, SelectTrigger, SelectContent, SelectItem, Separator, Skeleton, Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TooltipContent } from './chunk-BWUSOBIM.js';
import 'react';
import { jsx } from 'react/jsx-runtime';

function withClassName(Component, defaultClassName) {
  return function Wrapped({ className, ...props }) {
    return /* @__PURE__ */ jsx(
      Component,
      {
        className: cn(defaultClassName, className),
        ...props
      }
    );
  };
}
var GridButton = withClassName(
  Button,
  "rounded-md border border-cyan-400/45 bg-black/75 font-mono text-[0.8rem] tracking-[0.045em] text-cyan-50 uppercase shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_18px_rgba(34,211,238,0.1)] data-[variant=default]:bg-cyan-300 data-[variant=default]:text-slate-950 data-[variant=outline]:bg-black/55 data-[variant=ghost]:border-transparent data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-cyan-400/10 data-[variant=secondary]:bg-cyan-400/12 data-[variant=destructive]:border-rose-400/50 data-[variant=destructive]:bg-rose-500/15 data-[variant=destructive]:text-rose-200"
);
var GridCard = withClassName(
  Card,
  "rounded-md border border-cyan-400/35 bg-[linear-gradient(180deg,rgba(0,229,255,0.055),transparent_58%),rgba(1,8,11,0.9)] font-mono text-cyan-50 shadow-[inset_0_1px_0_rgba(125,211,252,0.08),0_0_0_1px_rgba(34,211,238,0.12),0_0_28px_rgba(34,211,238,0.08)] ring-0"
);
var GridCardHeader = withClassName(CardHeader, "px-5 pt-5 pb-3");
var GridCardContent = withClassName(CardContent, "px-5 pb-5");
var GridCheckbox = withClassName(
  Checkbox,
  "rounded-sm border-cyan-400/55 bg-black/65 ring-cyan-300/70 data-checked:bg-cyan-300 data-checked:text-slate-950 data-checked:ring-cyan-300"
);
var GridDropdownMenuContent = withClassName(
  DropdownMenuContent,
  "rounded-md border border-cyan-400/35 bg-black/92 font-mono text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.16)] ring-0 before:hidden **:data-[slot$=-item]:focus:bg-cyan-400/12 **:data-[slot$=-item]:data-highlighted:bg-cyan-400/12 **:data-[slot$=-separator]:bg-cyan-400/18 **:data-[slot$=-trigger]:focus:bg-cyan-400/12"
);
var GridDropdownMenuItem = withClassName(
  DropdownMenuItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50 data-[variant=destructive]:text-rose-200 data-[variant=destructive]:focus:bg-rose-500/15"
);
var GridDropdownMenuCheckboxItem = withClassName(
  DropdownMenuCheckboxItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50"
);
var GridDropdownMenuRadioItem = withClassName(
  DropdownMenuRadioItem,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50"
);
var GridDropdownMenuLabel = withClassName(
  DropdownMenuLabel,
  "font-mono text-[0.68rem] tracking-[0.16em] text-cyan-200/70 uppercase"
);
var GridDropdownMenuSeparator = withClassName(
  DropdownMenuSeparator,
  "bg-cyan-400/20"
);
var GridDropdownMenuSubContent = withClassName(
  DropdownMenuSubContent,
  "rounded-md border border-cyan-400/35 bg-black/92 font-mono text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.16)] ring-0 before:hidden"
);
var GridDropdownMenuSubTrigger = withClassName(
  DropdownMenuSubTrigger,
  "rounded-sm font-mono text-cyan-50 focus:bg-cyan-400/12 focus:text-cyan-50 data-open:bg-cyan-400/12 data-open:text-cyan-50"
);
var GridEmpty = withClassName(
  Empty,
  "rounded-md border-cyan-400/35 bg-black/80 font-mono text-cyan-50"
);
var GridEmptyMedia = withClassName(
  EmptyMedia,
  "[&[data-variant=icon]]:rounded-xl [&[data-variant=icon]]:bg-cyan-400/12 [&[data-variant=icon]]:text-cyan-200"
);
var GridEmptyTitle = withClassName(EmptyTitle, "text-cyan-50");
var GridEmptyDescription = withClassName(
  EmptyDescription,
  "text-cyan-100/70"
);
var GridInput = withClassName(
  Input,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 placeholder:text-cyan-100/45 focus-visible:ring-cyan-300/70"
);
var GridInputGroup = withClassName(
  InputGroup,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.06)]"
);
var GridPaginationLink = withClassName(
  PaginationLink,
  "rounded-md border-cyan-400/35 bg-black/55 font-mono text-cyan-50 hover:bg-cyan-400/12 data-[active=true]:bg-cyan-300 data-[active=true]:text-slate-950"
);
var GridScrollArea = withClassName(
  ScrollArea,
  "rounded-md border border-cyan-400/35 bg-black/72 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_26px_rgba(34,211,238,0.08)]"
);
var GridScrollBar = withClassName(
  ScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-cyan-300/65"
);
var GridSelectTrigger = withClassName(
  SelectTrigger,
  "rounded-md border-cyan-400/45 bg-black/70 font-mono text-cyan-50 focus-visible:ring-cyan-300/70"
);
var GridSelectContent = withClassName(
  SelectContent,
  "rounded-md border border-cyan-400/35 bg-black/95 font-mono text-cyan-50 ring-0 shadow-[0_0_26px_rgba(34,211,238,0.16)] before:hidden"
);
var GridSelectItem = withClassName(
  SelectItem,
  "rounded-sm focus:bg-cyan-400/12 focus:text-cyan-50"
);
var GridSeparator = withClassName(Separator, "bg-cyan-400/20");
var GridSkeleton = withClassName(
  Skeleton,
  "rounded-md bg-cyan-400/12"
);
var GridTable = withClassName(
  Table,
  "border-separate border-spacing-0 border border-cyan-400/45 bg-black/72 font-mono text-[0.84rem] text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_24px_rgba(34,211,238,0.08)]"
);
var GridTableHeader = withClassName(
  TableHeader,
  "[&_tr]:border-cyan-400/45"
);
var GridTableBody = withClassName(
  TableBody,
  "[&_tr:last-child]:border-b"
);
var GridTableFooter = withClassName(
  TableFooter,
  "border-cyan-400/40 bg-cyan-400/10 font-mono"
);
var GridTableHead = withClassName(
  TableHead,
  "h-12 border-b border-cyan-400/45 bg-cyan-950/20 px-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] text-cyan-300 uppercase"
);
var GridTableRow = withClassName(
  TableRow,
  "border-cyan-400/25 hover:bg-cyan-400/10 data-[state=selected]:bg-cyan-400/15"
);
var GridTableCell = withClassName(
  TableCell,
  "border-b border-cyan-400/16 px-3 py-3 font-mono text-cyan-50"
);
var GridTableCaption = withClassName(
  TableCaption,
  "font-mono text-cyan-100/65"
);
var GridTooltipContent = withClassName(
  TooltipContent,
  "rounded-md bg-black text-cyan-50 ring-1 ring-cyan-400/35 shadow-[0_0_22px_rgba(34,211,238,0.18)] [&>svg]:bg-black [&>svg]:fill-black"
);
var theGridcnUiKit = {
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
    dragActive: "rounded-md border-dashed border-cyan-300",
    emptyState: "border-cyan-400/35 bg-black/80",
    footer: "border-cyan-400/40 bg-black/80 text-cyan-50",
    headerSortIcon: "text-cyan-100/65",
    mutedText: "text-cyan-100/70",
    paginationSelectTrigger: "border-cyan-400/45 bg-black/70 text-cyan-50",
    paginationTotal: "border border-cyan-400/25 bg-black/70 text-cyan-100/70",
    pinnedColumn: "border-cyan-400/25",
    pinnedUtilityColumn: "bg-black/80",
    resizeHandle: "after:bg-cyan-400/20 hover:after:bg-cyan-300",
    resizeHandleActive: "after:bg-cyan-300",
    row: "hover:bg-cyan-400/10 data-[state=selected]:!bg-cyan-400/15",
    rowSelected: "!bg-cyan-400/15",
    tableContainer: "border-cyan-400/35 bg-black/72 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_26px_rgba(34,211,238,0.08)]",
    tableScrollArea: "bg-black/72",
    tableStickyHeader: "sticky top-0 z-30 bg-black/90 backdrop-blur [&_th]:border-cyan-400/45 [&_th]:bg-black/90",
    toolbarCompactIconButton: "size-7",
    toolbarIconButton: "text-cyan-100/70 hover:text-cyan-50",
    toolbarInputButton: "border-cyan-400/45 bg-black/70 text-cyan-50"
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
  TooltipContent: GridTooltipContent
};

// src/entries/thegridcn.ts
var DataTable = createDataTable(theGridcnUiKit);

export { DataTable };
//# sourceMappingURL=thegridcn.js.map
//# sourceMappingURL=thegridcn.js.map