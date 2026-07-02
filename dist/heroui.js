import { primitiveUiKit, createDataTable, cn, Button, Card, CardHeader, CardContent, Checkbox, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, Input, InputGroup, InputGroupAddon, InputGroupInput, Pagination, PaginationLink, PaginationFirst, PaginationPrevious, PaginationNext, PaginationLast, ScrollArea, ScrollBar, SelectTrigger, SelectContent, SelectItem, Separator, Skeleton, Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TooltipContent, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from './chunk-FNJZDBIH.js';
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
var HeroButton = withClassName(
  Button,
  "rounded-field border-field-border shadow-field data-[variant=default]:bg-accent data-[variant=default]:text-accent-foreground data-[variant=outline]:border-field-border data-[variant=outline]:bg-field data-[variant=outline]:hover:bg-field-hover data-[variant=secondary]:bg-default data-[variant=secondary]:text-default-foreground data-[variant=ghost]:hover:bg-default data-[variant=destructive]:bg-danger-soft data-[variant=destructive]:text-danger"
);
var HeroCard = withClassName(
  Card,
  "rounded-2xl border border-separator bg-surface text-surface-foreground shadow-surface ring-0"
);
var HeroCardHeader = withClassName(CardHeader, "px-5 pt-5 pb-3");
var HeroCardContent = withClassName(CardContent, "px-5 pb-5");
var HeroCheckbox = withClassName(
  Checkbox,
  "rounded-field border-field-border bg-field ring-focus/40 data-checked:bg-accent data-checked:text-accent-foreground data-checked:ring-focus"
);
var HeroDropdownMenuContent = withClassName(
  DropdownMenuContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden **:data-[slot$=-item]:focus:bg-default **:data-[slot$=-item]:data-highlighted:bg-default **:data-[slot$=-separator]:bg-separator **:data-[slot$=-trigger]:focus:bg-default"
);
var HeroDropdownMenuItem = withClassName(
  DropdownMenuItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground data-[variant=destructive]:text-danger data-[variant=destructive]:focus:bg-danger-soft"
);
var HeroDropdownMenuCheckboxItem = withClassName(
  DropdownMenuCheckboxItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground"
);
var HeroDropdownMenuRadioItem = withClassName(
  DropdownMenuRadioItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground"
);
var HeroDropdownMenuLabel = withClassName(
  DropdownMenuLabel,
  "text-muted"
);
var HeroDropdownMenuSeparator = withClassName(
  DropdownMenuSeparator,
  "bg-separator"
);
var HeroDropdownMenuSubContent = withClassName(
  DropdownMenuSubContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden"
);
var HeroDropdownMenuSubTrigger = withClassName(
  DropdownMenuSubTrigger,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground data-open:bg-default data-open:text-overlay-foreground"
);
var HeroInput = withClassName(
  Input,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field placeholder:text-field-placeholder"
);
var HeroInputGroup = withClassName(
  InputGroup,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field"
);
var HeroInputGroupAddon = withClassName(
  InputGroupAddon,
  "text-muted"
);
var HeroInputGroupInput = withClassName(InputGroupInput, "bg-transparent");
var HeroPagination = withClassName(Pagination, "justify-end");
var HeroPaginationLink = withClassName(
  PaginationLink,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
);
var HeroPaginationFirst = withClassName(
  PaginationFirst,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover"
);
var HeroPaginationPrevious = withClassName(
  PaginationPrevious,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover"
);
var HeroPaginationNext = withClassName(
  PaginationNext,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover"
);
var HeroPaginationLast = withClassName(
  PaginationLast,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover"
);
var HeroScrollArea = withClassName(ScrollArea, "rounded-2xl");
var HeroScrollBar = withClassName(
  ScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-default-500"
);
var HeroSelectTrigger = withClassName(
  SelectTrigger,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field"
);
var HeroSelectContent = withClassName(
  SelectContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden"
);
var HeroSelectItem = withClassName(
  SelectItem,
  "rounded-xl focus:bg-default"
);
var HeroSeparator = withClassName(Separator, "bg-separator");
var HeroSkeleton = withClassName(
  Skeleton,
  "rounded-xl bg-default"
);
var HeroTable = withClassName(Table, "rounded-2xl text-foreground");
var HeroTableHeader = withClassName(
  TableHeader,
  "[&_tr]:border-separator"
);
var HeroTableBody = withClassName(TableBody, "");
var HeroTableFooter = withClassName(
  TableFooter,
  "border-separator bg-surface-secondary"
);
var HeroTableHead = withClassName(
  TableHead,
  "h-11 border-separator text-muted font-semibold"
);
var HeroTableRow = withClassName(
  TableRow,
  "border-separator hover:bg-default data-[state=selected]:bg-accent-soft"
);
var HeroTableCell = withClassName(TableCell, "py-2.5");
var HeroTooltipContent = withClassName(
  TooltipContent,
  "rounded-xl bg-overlay text-overlay-foreground ring-1 ring-separator shadow-overlay [&>svg]:bg-overlay [&>svg]:fill-overlay"
);
var HeroEmpty = withClassName(
  Empty,
  "rounded-2xl border-separator bg-surface shadow-surface"
);
var HeroEmptyHeader = withClassName(EmptyHeader, "");
var HeroEmptyMedia = withClassName(
  EmptyMedia,
  "[&[data-variant=icon]]:rounded-2xl [&[data-variant=icon]]:bg-accent-soft [&[data-variant=icon]]:text-accent-soft-foreground"
);
var HeroEmptyTitle = withClassName(EmptyTitle, "text-foreground");
var HeroEmptyDescription = withClassName(
  EmptyDescription,
  "text-muted"
);
var HeroEmptyContent = withClassName(EmptyContent, "");
var heroUiKit = {
  ...primitiveUiKit,
  rootClassName: "dtp-heroui",
  classNames: {
    card: "hover:bg-default data-[state=selected]:bg-accent-soft",
    cardGrid: "bg-transparent",
    cardItem: "min-w-0",
    cardOverlay: "from-surface/95 via-surface/85 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-accent-soft ring-accent",
    cardUnselected: "border-separator",
    cardViewport: "bg-transparent",
    cellBorder: "border-separator/70",
    dragActive: "rounded-2xl border-dashed border-accent",
    emptyState: "border-separator bg-surface",
    footer: "border-separator bg-surface text-surface-foreground",
    headerSortIcon: "text-muted",
    mutedText: "text-muted",
    paginationSelectTrigger: "border-field-border bg-field",
    paginationTotal: "bg-field text-muted",
    pinnedColumn: "border-separator",
    pinnedUtilityColumn: "bg-surface",
    resizeHandle: "after:bg-separator hover:after:bg-accent",
    resizeHandleActive: "after:bg-accent",
    row: "hover:bg-default data-[state=selected]:!bg-accent-soft",
    rowSelected: "!bg-accent-soft",
    tableContainer: "border-separator bg-surface text-surface-foreground",
    tableScrollArea: "bg-surface",
    tableStickyHeader: "sticky top-0 z-30 bg-surface/95 backdrop-blur [&_th]:border-separator [&_th]:bg-surface/95",
    toolbarCompactIconButton: "size-7",
    toolbarIconButton: "text-muted hover:text-foreground",
    toolbarInputButton: "bg-field"
  },
  Button: HeroButton,
  Card: HeroCard,
  CardContent: HeroCardContent,
  CardHeader: HeroCardHeader,
  Checkbox: HeroCheckbox,
  DropdownMenuCheckboxItem: HeroDropdownMenuCheckboxItem,
  DropdownMenuContent: HeroDropdownMenuContent,
  DropdownMenuItem: HeroDropdownMenuItem,
  DropdownMenuLabel: HeroDropdownMenuLabel,
  DropdownMenuRadioItem: HeroDropdownMenuRadioItem,
  DropdownMenuSeparator: HeroDropdownMenuSeparator,
  DropdownMenuSubContent: HeroDropdownMenuSubContent,
  DropdownMenuSubTrigger: HeroDropdownMenuSubTrigger,
  Empty: HeroEmpty,
  EmptyContent: HeroEmptyContent,
  EmptyDescription: HeroEmptyDescription,
  EmptyHeader: HeroEmptyHeader,
  EmptyMedia: HeroEmptyMedia,
  EmptyTitle: HeroEmptyTitle,
  Input: HeroInput,
  InputGroup: HeroInputGroup,
  InputGroupAddon: HeroInputGroupAddon,
  InputGroupInput: HeroInputGroupInput,
  Pagination: HeroPagination,
  PaginationFirst: HeroPaginationFirst,
  PaginationLast: HeroPaginationLast,
  PaginationLink: HeroPaginationLink,
  PaginationNext: HeroPaginationNext,
  PaginationPrevious: HeroPaginationPrevious,
  ScrollArea: HeroScrollArea,
  ScrollBar: HeroScrollBar,
  SelectContent: HeroSelectContent,
  SelectItem: HeroSelectItem,
  SelectTrigger: HeroSelectTrigger,
  Separator: HeroSeparator,
  Skeleton: HeroSkeleton,
  Table: HeroTable,
  TableBody: HeroTableBody,
  TableCell: HeroTableCell,
  TableFooter: HeroTableFooter,
  TableHead: HeroTableHead,
  TableHeader: HeroTableHeader,
  TableRow: HeroTableRow,
  TooltipContent: HeroTooltipContent
};

// src/entries/heroui.ts
var DataTable = createDataTable(heroUiKit);

export { DataTable };
//# sourceMappingURL=heroui.js.map
//# sourceMappingURL=heroui.js.map