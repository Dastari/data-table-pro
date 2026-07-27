import { primitiveUiKit, createDataTable, cn, Button, Card, CardDescription, CardFooter, Checkbox, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, Empty, EmptyDescription, EmptyMedia, Input, InputGroup, InputGroupAddon, InputGroupInput, ScrollBar, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator, Separator, Skeleton, TableFooter, TableHead, TooltipContent } from './chunk-SQ5AR7HO.js';
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
var ShadcnButton = withClassName(
  Button,
  "rounded-md text-foreground data-[variant=default]:border-primary data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground data-[variant=outline]:border-input data-[variant=outline]:bg-card data-[variant=outline]:hover:bg-accent data-[variant=outline]:hover:text-accent-foreground data-[variant=secondary]:border-secondary data-[variant=secondary]:bg-secondary data-[variant=secondary]:text-secondary-foreground data-[variant=ghost]:border-transparent data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-accent data-[variant=ghost]:hover:text-accent-foreground data-[variant=destructive]:border-destructive data-[variant=destructive]:bg-destructive data-[variant=destructive]:text-destructive-foreground data-[variant=link]:border-transparent data-[variant=link]:bg-transparent"
);
var ShadcnCard = withClassName(
  Card,
  "rounded-xl border-border bg-card text-card-foreground shadow-sm ring-0"
);
var ShadcnCardDescription = withClassName(
  CardDescription,
  "text-muted-foreground"
);
var ShadcnCardFooter = withClassName(
  CardFooter,
  "border-t border-border/60 bg-muted/50"
);
var ShadcnCheckbox = withClassName(
  Checkbox,
  "border-input bg-card ring-ring/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:ring-primary"
);
var ShadcnDropdownMenuContent = withClassName(
  DropdownMenuContent,
  "border-border bg-popover text-popover-foreground shadow-md"
);
var ShadcnDropdownMenuItem = withClassName(
  DropdownMenuItem,
  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10"
);
var ShadcnDropdownMenuCheckboxItem = withClassName(
  DropdownMenuCheckboxItem,
  "focus:bg-accent focus:text-accent-foreground"
);
var ShadcnDropdownMenuRadioItem = withClassName(
  DropdownMenuRadioItem,
  "focus:bg-accent focus:text-accent-foreground"
);
var ShadcnDropdownMenuLabel = withClassName(
  DropdownMenuLabel,
  "text-muted-foreground"
);
var ShadcnDropdownMenuSeparator = withClassName(
  DropdownMenuSeparator,
  "bg-border"
);
var ShadcnDropdownMenuSubContent = withClassName(
  DropdownMenuSubContent,
  "border-border bg-popover text-popover-foreground shadow-md"
);
var ShadcnDropdownMenuSubTrigger = withClassName(
  DropdownMenuSubTrigger,
  "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground"
);
var ShadcnEmpty = withClassName(
  Empty,
  "rounded-2xl border-border/60 bg-background/70"
);
var ShadcnEmptyDescription = withClassName(
  EmptyDescription,
  "text-muted-foreground"
);
var ShadcnEmptyMedia = withClassName(
  EmptyMedia,
  "[&[data-variant=icon]]:bg-muted [&[data-variant=icon]]:text-foreground"
);
var ShadcnInput = withClassName(
  Input,
  "rounded-md border-input bg-card text-foreground placeholder:text-muted-foreground"
);
var ShadcnInputGroup = withClassName(
  InputGroup,
  "rounded-md border-input bg-card text-foreground"
);
var ShadcnInputGroupAddon = withClassName(
  InputGroupAddon,
  "text-muted-foreground"
);
var ShadcnInputGroupInput = withClassName(
  InputGroupInput,
  "bg-transparent"
);
var ShadcnScrollBar = withClassName(
  ScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-border"
);
var ShadcnSelectTrigger = withClassName(
  SelectTrigger,
  "rounded-md border-input bg-card text-foreground"
);
var ShadcnSelectContent = withClassName(
  SelectContent,
  "border-border bg-popover text-popover-foreground shadow-md"
);
var ShadcnSelectItem = withClassName(
  SelectItem,
  "focus:bg-accent focus:text-accent-foreground"
);
var ShadcnSelectLabel = withClassName(
  SelectLabel,
  "text-muted-foreground"
);
var ShadcnSelectSeparator = withClassName(
  SelectSeparator,
  "bg-border"
);
var ShadcnSeparator = withClassName(Separator, "bg-border");
var ShadcnSkeleton = withClassName(Skeleton, "bg-muted");
var ShadcnTableFooter = withClassName(
  TableFooter,
  "border-border bg-muted/50"
);
var ShadcnTableHead = withClassName(
  TableHead,
  "text-foreground"
);
var ShadcnTooltipContent = withClassName(
  TooltipContent,
  "bg-foreground text-background ring-1 ring-foreground/10 [&>svg]:bg-foreground [&>svg]:fill-foreground"
);
var shadcnUiKit = {
  ...primitiveUiKit,
  rootClassName: "dtp-shadcn",
  classNames: {
    card: "hover:bg-muted/50 data-[state=selected]:bg-primary/10",
    cardGrid: "bg-transparent",
    cardItem: "min-w-0",
    cardOverlay: "from-background/95 via-background/85 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-primary/10 ring-primary",
    cardUnselected: "border-border",
    cardViewport: "bg-transparent",
    cellBorder: "border-border/40",
    dragActive: "rounded-md border-dashed border-primary",
    emptyState: "border-border/60 bg-background/70",
    footer: "border-border bg-card",
    headerSortIcon: "text-muted-foreground",
    mutedText: "text-muted-foreground",
    paginationSelectTrigger: "border-input bg-card",
    paginationTotal: "text-muted-foreground",
    pinnedColumn: "border-border",
    pinnedUtilityColumn: "bg-card",
    resizeHandle: "after:bg-border hover:after:bg-primary",
    resizeHandleActive: "after:bg-primary",
    row: "hover:bg-muted/50 data-[state=selected]:!bg-primary/10",
    rowSelected: "!bg-primary/10",
    tableContainer: "border-border bg-card text-card-foreground",
    tableStickyHeader: "sticky top-0 z-30 bg-card/95 backdrop-blur [&_th]:border-border [&_th]:bg-card/95",
    toolbarCompactIconButton: "size-7",
    toolbarIconButton: "text-muted-foreground hover:text-foreground",
    toolbarInputButton: "border-input bg-card"
  },
  Button: ShadcnButton,
  Card: ShadcnCard,
  CardDescription: ShadcnCardDescription,
  CardFooter: ShadcnCardFooter,
  Checkbox: ShadcnCheckbox,
  DropdownMenuCheckboxItem: ShadcnDropdownMenuCheckboxItem,
  DropdownMenuContent: ShadcnDropdownMenuContent,
  DropdownMenuItem: ShadcnDropdownMenuItem,
  DropdownMenuLabel: ShadcnDropdownMenuLabel,
  DropdownMenuRadioItem: ShadcnDropdownMenuRadioItem,
  DropdownMenuSeparator: ShadcnDropdownMenuSeparator,
  DropdownMenuSubContent: ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger: ShadcnDropdownMenuSubTrigger,
  Empty: ShadcnEmpty,
  EmptyDescription: ShadcnEmptyDescription,
  EmptyMedia: ShadcnEmptyMedia,
  Input: ShadcnInput,
  InputGroup: ShadcnInputGroup,
  InputGroupAddon: ShadcnInputGroupAddon,
  InputGroupInput: ShadcnInputGroupInput,
  ScrollBar: ShadcnScrollBar,
  SelectContent: ShadcnSelectContent,
  SelectItem: ShadcnSelectItem,
  SelectLabel: ShadcnSelectLabel,
  SelectSeparator: ShadcnSelectSeparator,
  SelectTrigger: ShadcnSelectTrigger,
  Separator: ShadcnSeparator,
  Skeleton: ShadcnSkeleton,
  TableFooter: ShadcnTableFooter,
  TableHead: ShadcnTableHead,
  TooltipContent: ShadcnTooltipContent
};

// src/index.ts
var DataTable = createDataTable(shadcnUiKit);

export { DataTable };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map