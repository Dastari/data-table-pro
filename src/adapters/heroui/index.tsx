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
  EmptyContent as ShadcnEmptyContent,
  EmptyDescription as ShadcnEmptyDescription,
  EmptyHeader as ShadcnEmptyHeader,
  EmptyMedia as ShadcnEmptyMedia,
  EmptyTitle as ShadcnEmptyTitle,
  Input as ShadcnInput,
  InputGroup as ShadcnInputGroup,
  InputGroupAddon as ShadcnInputGroupAddon,
  InputGroupInput as ShadcnInputGroupInput,
  Pagination as ShadcnPagination,
  PaginationFirst as ShadcnPaginationFirst,
  PaginationLast as ShadcnPaginationLast,
  PaginationLink as ShadcnPaginationLink,
  PaginationNext as ShadcnPaginationNext,
  PaginationPrevious as ShadcnPaginationPrevious,
  ScrollArea as ShadcnScrollArea,
  ScrollBar as ShadcnScrollBar,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  Separator as ShadcnSeparator,
  Skeleton as ShadcnSkeleton,
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
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

const HeroButton = withClassName(
  ShadcnButton,
  "rounded-field border-field-border shadow-field data-[variant=default]:bg-accent data-[variant=default]:text-accent-foreground data-[variant=outline]:border-field-border data-[variant=outline]:bg-field data-[variant=outline]:hover:bg-field-hover data-[variant=secondary]:bg-default data-[variant=secondary]:text-default-foreground data-[variant=ghost]:hover:bg-default data-[variant=destructive]:bg-danger-soft data-[variant=destructive]:text-danger",
);
const HeroCard = withClassName(
  ShadcnCard,
  "rounded-2xl border border-separator bg-surface text-surface-foreground shadow-surface ring-0",
);
const HeroCardHeader = withClassName(
  ShadcnCardHeader,
  "px-5 pt-5 pb-3",
);
const HeroCardContent = withClassName(
  ShadcnCardContent,
  "px-5 pb-5",
);
const HeroCheckbox = withClassName(
  ShadcnCheckbox,
  "rounded-field border-field-border bg-field ring-focus/40 data-checked:bg-accent data-checked:text-accent-foreground data-checked:ring-focus",
);
const HeroDropdownMenuContent = withClassName(
  ShadcnDropdownMenuContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden **:data-[slot$=-item]:focus:bg-default **:data-[slot$=-item]:data-highlighted:bg-default **:data-[slot$=-separator]:bg-separator **:data-[slot$=-trigger]:focus:bg-default",
);
const HeroDropdownMenuItem = withClassName(
  ShadcnDropdownMenuItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground data-[variant=destructive]:text-danger data-[variant=destructive]:focus:bg-danger-soft",
);
const HeroDropdownMenuCheckboxItem = withClassName(
  ShadcnDropdownMenuCheckboxItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground",
);
const HeroDropdownMenuRadioItem = withClassName(
  ShadcnDropdownMenuRadioItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground",
);
const HeroDropdownMenuLabel = withClassName(
  ShadcnDropdownMenuLabel,
  "text-muted",
);
const HeroDropdownMenuSeparator = withClassName(
  ShadcnDropdownMenuSeparator,
  "bg-separator",
);
const HeroDropdownMenuSubContent = withClassName(
  ShadcnDropdownMenuSubContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden",
);
const HeroDropdownMenuSubTrigger = withClassName(
  ShadcnDropdownMenuSubTrigger,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground data-open:bg-default data-open:text-overlay-foreground",
);
const HeroInput = withClassName(
  ShadcnInput,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field placeholder:text-field-placeholder",
);
const HeroInputGroup = withClassName(
  ShadcnInputGroup,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field",
);
const HeroInputGroupAddon = withClassName(
  ShadcnInputGroupAddon,
  "text-muted",
);
const HeroInputGroupInput = withClassName(
  ShadcnInputGroupInput,
  "bg-transparent",
);
const HeroPagination = withClassName(
  ShadcnPagination,
  "justify-end",
);
const HeroPaginationLink = withClassName(
  ShadcnPaginationLink,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
);
const HeroPaginationFirst = withClassName(
  ShadcnPaginationFirst,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroPaginationPrevious = withClassName(
  ShadcnPaginationPrevious,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroPaginationNext = withClassName(
  ShadcnPaginationNext,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroPaginationLast = withClassName(
  ShadcnPaginationLast,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroScrollArea = withClassName(
  ShadcnScrollArea,
  "rounded-2xl",
);
const HeroScrollBar = withClassName(
  ShadcnScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-default-500",
);
const HeroSelectTrigger = withClassName(
  ShadcnSelectTrigger,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field",
);
const HeroSelectContent = withClassName(
  ShadcnSelectContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden",
);
const HeroSelectItem = withClassName(
  ShadcnSelectItem,
  "rounded-xl focus:bg-default",
);
const HeroSeparator = withClassName(
  ShadcnSeparator,
  "bg-separator",
);
const HeroSkeleton = withClassName(
  ShadcnSkeleton,
  "rounded-xl bg-default",
);
const HeroTable = withClassName(
  ShadcnTable,
  "rounded-2xl text-foreground",
);
const HeroTableHeader = withClassName(
  ShadcnTableHeader,
  "[&_tr]:border-separator",
);
const HeroTableBody = withClassName(ShadcnTableBody, "");
const HeroTableFooter = withClassName(
  ShadcnTableFooter,
  "border-separator bg-surface-secondary",
);
const HeroTableHead = withClassName(
  ShadcnTableHead,
  "h-11 border-separator text-muted font-semibold",
);
const HeroTableRow = withClassName(
  ShadcnTableRow,
  "border-separator hover:bg-default data-[state=selected]:bg-accent-soft",
);
const HeroTableCell = withClassName(
  ShadcnTableCell,
  "py-2.5",
);
const HeroTooltipContent = withClassName(
  ShadcnTooltipContent,
  "rounded-xl bg-overlay text-overlay-foreground ring-1 ring-separator shadow-overlay [&>svg]:bg-overlay [&>svg]:fill-overlay",
);
const HeroEmpty = withClassName(
  ShadcnEmpty,
  "rounded-2xl border-separator bg-surface shadow-surface",
);
const HeroEmptyHeader = withClassName(ShadcnEmptyHeader, "");
const HeroEmptyMedia = withClassName(
  ShadcnEmptyMedia,
  "[&[data-variant=icon]]:rounded-2xl [&[data-variant=icon]]:bg-accent-soft [&[data-variant=icon]]:text-accent-soft-foreground",
);
const HeroEmptyTitle = withClassName(
  ShadcnEmptyTitle,
  "text-foreground",
);
const HeroEmptyDescription = withClassName(
  ShadcnEmptyDescription,
  "text-muted",
);
const HeroEmptyContent = withClassName(ShadcnEmptyContent, "");

export const heroUiKit: DataTableUiKit = {
  ...shadcnUiKit,
  rootClassName: "dtp-heroui",
  classNames: {
    card: "hover:bg-default data-[state=selected]:bg-accent-soft",
    cardOverlay: "from-surface/95 via-surface/85 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-accent-soft ring-accent",
    cardUnselected: "border-separator",
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
    tableStickyHeader:
      "sticky top-0 z-30 bg-surface/95 backdrop-blur [&_th]:border-separator [&_th]:bg-surface/95",
    toolbarIconButton: "text-muted hover:text-foreground",
    toolbarInputButton: "bg-field",
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
  TooltipContent: HeroTooltipContent,
};
