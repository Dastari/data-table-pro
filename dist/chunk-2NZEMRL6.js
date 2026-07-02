import * as React30 from 'react';
import { cva } from 'class-variance-authority';
import { Slot, Separator as Separator$1, Checkbox as Checkbox$1, DropdownMenu as DropdownMenu$1, ScrollArea as ScrollArea$1, Select as Select$1, Tooltip as Tooltip$1 } from 'radix-ui';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useVirtualizer } from '@tanstack/react-virtual';
import { flexRender, functionalUpdate, useReactTable, getPaginationRowModel, getExpandedRowModel, getSortedRowModel, getFilteredRowModel, getCoreRowModel } from '@tanstack/react-table';
import { flushSync } from 'react-dom';

// src/components/ui/button.tsx
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        secondary: "",
        ghost: "",
        destructive: "",
        link: "underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator$1.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}
var buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
        vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!"
      }
    },
    defaultVariants: {
      orientation: "horizontal"
    }
  }
);
function ButtonGroup({
  className,
  orientation,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "button-group",
      "data-orientation": orientation,
      className: cn(buttonGroupVariants({ orientation }), className),
      ...props
    }
  );
}
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      className: cn(
        "flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      "data-slot": "button-group-separator",
      orientation,
      className: cn(
        "relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className
      ),
      ...props
    }
  );
}
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl border py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      ),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm opacity-80", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-action",
      className: cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn(
        "flex items-center rounded-b-xl border-t p-4 group-data-[size=sm]/card:p-3",
        className
      ),
      ...props
    }
  );
}
function Icon({
  children,
  viewBox = "0 0 24 24",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-hidden": "true",
      focusable: "false",
      width: "1em",
      height: "1em",
      viewBox,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
      children
    }
  );
}
function IconAdjustmentsHorizontal(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 7h4" }),
    /* @__PURE__ */ jsx("path", { d: "M14 7h6" }),
    /* @__PURE__ */ jsx("path", { d: "M10 5v4" }),
    /* @__PURE__ */ jsx("path", { d: "M4 17h10" }),
    /* @__PURE__ */ jsx("path", { d: "M18 17h2" }),
    /* @__PURE__ */ jsx("path", { d: "M16 15v4" })
  ] });
}
function IconCheck(props) {
  return /* @__PURE__ */ jsx(Icon, { ...props, children: /* @__PURE__ */ jsx("path", { d: "M5 12l4 4L19 6" }) });
}
function IconChevronDown(props) {
  return /* @__PURE__ */ jsx(Icon, { ...props, children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) });
}
function IconChevronLeft(props) {
  return /* @__PURE__ */ jsx(Icon, { ...props, children: /* @__PURE__ */ jsx("path", { d: "M15 6l-6 6 6 6" }) });
}
function IconChevronRight(props) {
  return /* @__PURE__ */ jsx(Icon, { ...props, children: /* @__PURE__ */ jsx("path", { d: "M9 6l6 6-6 6" }) });
}
function IconChevronUp(props) {
  return /* @__PURE__ */ jsx(Icon, { ...props, children: /* @__PURE__ */ jsx("path", { d: "M6 15l6-6 6 6" }) });
}
function IconChevronsLeft(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M11 6l-6 6 6 6" }),
    /* @__PURE__ */ jsx("path", { d: "M19 6l-6 6 6 6" })
  ] });
}
function IconChevronsRight(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M5 6l6 6-6 6" }),
    /* @__PURE__ */ jsx("path", { d: "M13 6l6 6-6 6" })
  ] });
}
function IconClock(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 2" })
  ] });
}
function IconDatabase(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("ellipse", { cx: "12", cy: "5", rx: "7", ry: "3" }),
    /* @__PURE__ */ jsx("path", { d: "M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" }),
    /* @__PURE__ */ jsx("path", { d: "M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" })
  ] });
}
function IconDots(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M5 12h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M12 12h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M19 12h.01" })
  ] });
}
function IconDownload(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 3v12" }),
    /* @__PURE__ */ jsx("path", { d: "M7 10l5 5 5-5" }),
    /* @__PURE__ */ jsx("path", { d: "M5 21h14" })
  ] });
}
function IconEdit(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 20h4l11-11-4-4L4 16v4z" }),
    /* @__PURE__ */ jsx("path", { d: "M13 7l4 4" })
  ] });
}
function IconEye(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
  ] });
}
function IconEyeOff(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M3 3l18 18" }),
    /* @__PURE__ */ jsx("path", { d: "M10.6 10.6a2 2 0 0 0 2.8 2.8" }),
    /* @__PURE__ */ jsx("path", { d: "M9.9 5.3A10.5 10.5 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-3.2 4" }),
    /* @__PURE__ */ jsx("path", { d: "M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a10.6 10.6 0 0 0 4.1-.8" })
  ] });
}
function IconInbox(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 13l2-8h12l2 8" }),
    /* @__PURE__ */ jsx("path", { d: "M4 13h5l2 3h2l2-3h5v6H4z" })
  ] });
}
function IconLayoutGrid(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 4h6v6H4z" }),
    /* @__PURE__ */ jsx("path", { d: "M14 4h6v6h-6z" }),
    /* @__PURE__ */ jsx("path", { d: "M4 14h6v6H4z" }),
    /* @__PURE__ */ jsx("path", { d: "M14 14h6v6h-6z" })
  ] });
}
function IconList(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M8 6h13" }),
    /* @__PURE__ */ jsx("path", { d: "M8 12h13" }),
    /* @__PURE__ */ jsx("path", { d: "M8 18h13" }),
    /* @__PURE__ */ jsx("path", { d: "M3 6h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M3 12h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M3 18h.01" })
  ] });
}
function IconSearch(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ jsx("path", { d: "M16 16l5 5" })
  ] });
}
function IconSelector(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M8 9l4-4 4 4" }),
    /* @__PURE__ */ jsx("path", { d: "M16 15l-4 4-4-4" })
  ] });
}
function IconX(props) {
  return /* @__PURE__ */ jsxs(Icon, { ...props, children: [
    /* @__PURE__ */ jsx("path", { d: "M18 6L6 18" }),
    /* @__PURE__ */ jsx("path", { d: "M6 6l12 12" })
  ] });
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Checkbox$1.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border ring-2 transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-checked:ring-2",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        Checkbox$1.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
          children: /* @__PURE__ */ jsx(IconCheck, {})
        }
      )
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Portal, { "data-slot": "dropdown-menu-portal", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenu$1.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      align,
      className: cn(
        "relative z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) animate-none! overflow-x-hidden overflow-y-auto rounded-lg border p-1 shadow-md duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:outline-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    DropdownMenu$1.CheckboxItem,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:outline-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      checked,
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-checkbox-item-indicator",
            children: /* @__PURE__ */ jsx(DropdownMenu$1.ItemIndicator, { children: /* @__PURE__ */ jsx(IconCheck, {}) })
          }
        ),
        children
      ]
    }
  );
}
function DropdownMenuRadioGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.RadioGroup,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...props
    }
  );
}
function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    DropdownMenu$1.RadioItem,
    {
      "data-slot": "dropdown-menu-radio-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:outline-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-radio-item-indicator",
            children: /* @__PURE__ */ jsx(DropdownMenu$1.ItemIndicator, { children: /* @__PURE__ */ jsx(IconCheck, {}) })
          }
        ),
        children
      ]
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-1.5 py-1 text-xs font-medium opacity-80 data-inset:pl-7",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("-mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function DropdownMenuShortcut({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest opacity-75",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSub({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Sub, { "data-slot": "dropdown-menu-sub", ...props });
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    DropdownMenu$1.SubTrigger,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:outline-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(IconChevronRight, { className: "ml-auto" })
      ]
    }
  );
}
function DropdownMenuSubContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.SubContent,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: cn(
        "relative z-50 min-w-[96px] origin-(--radix-dropdown-menu-content-transform-origin) animate-none! overflow-hidden rounded-lg border p-1 shadow-lg duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props
    }
  );
}
function Empty({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty",
      className: cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance",
        className
      ),
      ...props
    }
  );
}
function EmptyHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-header",
      className: cn("flex max-w-sm flex-col items-center gap-2", className),
      ...props
    }
  );
}
var emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function EmptyMedia({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-icon",
      "data-variant": variant,
      className: cn(emptyMediaVariants({ variant, className })),
      ...props
    }
  );
}
function EmptyTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-title",
      className: cn(
        "font-heading text-sm font-medium tracking-tight",
        className
      ),
      ...props
    }
  );
}
function EmptyDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-description",
      className: cn(
        "text-sm/relaxed opacity-80 [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      ...props
    }
  );
}
function EmptyContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-content",
      className: cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/input-base.ts
var inputClassName = "h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:opacity-70 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
function InputGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "input-group",
      className: cn(
        "group/input-group flex w-full min-w-0 items-stretch rounded-lg border transition-colors outline-none focus-within:outline-none has-[>[data-slot=input-group-addon][data-align=block-start]]:flex-col has-[>[data-slot=input-group-addon][data-align=block-end]]:flex-col has-[>[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[>[data-slot=input-group-control]:disabled]:opacity-50",
        className
      ),
      ...props
    }
  );
}
var InputGroupInput = React30.forwardRef(function InputGroupInput2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      "data-slot": "input-group-control",
      type: props.type,
      className: cn(
        inputClassName,
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0",
        className
      ),
      ...props
    }
  );
});
function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "input-group-addon",
      "data-align": align,
      className: cn(
        "flex shrink-0 items-center gap-1.5 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        align === "inline-start" && "order-first pl-2.5 pr-1",
        align === "inline-end" && "order-last pl-1 pr-2.5",
        align === "block-start" && "order-first w-full justify-between border-b px-2.5 py-1.5 text-sm",
        align === "block-end" && "order-last w-full justify-between border-t px-2.5 py-1.5 text-sm",
        className
      ),
      ...props
    }
  );
}
function InputGroupText({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "input-group-text",
      className: cn("whitespace-nowrap text-sm", className),
      ...props
    }
  );
}
InputGroupInput.displayName = "InputGroupInput";
var Input = React30.forwardRef(function Input2({ className, passwordToggle = false, type, ...props }, ref) {
  const [showPassword, setShowPassword] = React30.useState(false);
  const canTogglePassword = passwordToggle && type === "password";
  if (!canTogglePassword) {
    return /* @__PURE__ */ jsx(
      "input",
      {
        ref,
        type,
        "data-slot": "input",
        className: cn(inputClassName, className),
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsxs(InputGroup, { className, children: [
    /* @__PURE__ */ jsx(
      InputGroupInput,
      {
        ref,
        type: showPassword ? "text" : "password",
        "data-slot": "input-group-control",
        className: "pr-0",
        ...props
      }
    ),
    /* @__PURE__ */ jsx(InputGroupAddon, { align: "inline-end", children: /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "icon-xs",
        "aria-label": showPassword ? "Hide password" : "Show password",
        "aria-pressed": showPassword,
        className: "hover:bg-transparent",
        onMouseDown: (event) => event.preventDefault(),
        onClick: () => setShowPassword((current) => !current),
        children: showPassword ? /* @__PURE__ */ jsx(IconEyeOff, { "data-icon": "inline-start" }) : /* @__PURE__ */ jsx(IconEye, { "data-icon": "inline-start" })
      }
    ) })
  ] });
});
Input.displayName = "Input";
function Pagination({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      role: "navigation",
      "aria-label": "pagination",
      "data-slot": "pagination",
      className: cn("mx-auto flex w-full justify-center", className),
      ...props
    }
  );
}
function PaginationContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "pagination-content",
      className: cn("flex items-center gap-1", className),
      ...props
    }
  );
}
function PaginationItem({ ...props }) {
  return /* @__PURE__ */ jsx("li", { "data-slot": "pagination-item", ...props });
}
function PaginationLink({
  className,
  isActive,
  disabled = false,
  variant,
  size = "icon",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      asChild: true,
      variant: variant ?? (isActive ? "outline" : "ghost"),
      size,
      className: cn(disabled && "pointer-events-none opacity-50", className),
      children: /* @__PURE__ */ jsx(
        "a",
        {
          "aria-current": isActive ? "page" : void 0,
          "aria-disabled": disabled ? true : void 0,
          "data-slot": "pagination-link",
          "data-active": isActive,
          tabIndex: disabled ? -1 : props.tabIndex,
          ...props
        }
      )
    }
  );
}
function PaginationPrevious({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "Previous",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    PaginationLink,
    {
      "aria-label": "Go to previous page",
      disabled,
      size,
      variant: "outline",
      className: cn("pl-1.5!", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(IconChevronLeft, { "data-icon": "inline-start" }),
        showText ? /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: text }) : null
      ]
    }
  );
}
function PaginationFirst({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "First",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    PaginationLink,
    {
      "aria-label": "Go to first page",
      disabled,
      size,
      variant: "outline",
      className: cn("pl-1.5!", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(IconChevronsLeft, { "data-icon": "inline-start" }),
        showText ? /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: text }) : null
      ]
    }
  );
}
function PaginationNext({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "Next",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    PaginationLink,
    {
      "aria-label": "Go to next page",
      disabled,
      size,
      variant: "outline",
      className: cn("pr-1.5!", className),
      ...props,
      children: [
        showText ? /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: text }) : null,
        /* @__PURE__ */ jsx(IconChevronRight, { "data-icon": "inline-end" })
      ]
    }
  );
}
function PaginationLast({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "Last",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    PaginationLink,
    {
      "aria-label": "Go to last page",
      disabled,
      size,
      variant: "outline",
      className: cn("pr-1.5!", className),
      ...props,
      children: [
        showText ? /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: text }) : null,
        /* @__PURE__ */ jsx(IconChevronsRight, { "data-icon": "inline-end" })
      ]
    }
  );
}
function PaginationEllipsis({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "aria-hidden": true,
      "data-slot": "pagination-ellipsis",
      className: cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(IconDots, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More pages" })
      ]
    }
  );
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollArea$1.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollArea$1.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:outline-none",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, { className: "z-100" }),
        /* @__PURE__ */ jsx(ScrollArea$1.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollArea$1.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      "data-orientation": orientation,
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollArea$1.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "relative flex-1 rounded-full"
        }
      )
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Root, { "data-slot": "select", ...props });
}
function SelectGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.Group,
    {
      "data-slot": "select-group",
      className: cn("scroll-my-1 p-1", className),
      ...props
    }
  );
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Select$1.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(Select$1.Icon, { asChild: true, children: /* @__PURE__ */ jsx(IconSelector, { className: "pointer-events-none size-4" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Portal, { children: /* @__PURE__ */ jsxs(
    Select$1.Content,
    {
      "data-slot": "select-content",
      "data-align-trigger": position === "item-aligned",
      className: cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) animate-none! overflow-x-hidden overflow-y-auto rounded-lg border shadow-md duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          Select$1.Viewport,
          {
            "data-position": position,
            className: cn(
              "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
              position === "popper" && ""
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.Label,
    {
      "data-slot": "select-label",
      className: cn("px-1.5 py-1 text-xs opacity-80", className),
      ...props
    }
  );
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Select$1.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:outline-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx(Select$1.ItemIndicator, { children: /* @__PURE__ */ jsx(IconCheck, { className: "pointer-events-none" }) }) }),
        /* @__PURE__ */ jsx(Select$1.ItemText, { children })
      ]
    }
  );
}
function SelectSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.Separator,
    {
      "data-slot": "select-separator",
      className: cn("pointer-events-none -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(IconChevronUp, {})
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(IconChevronDown, {})
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("animate-pulse rounded-md", className),
      ...props
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full border-collapse caption-bottom text-sm", className),
      ...props
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: cn(
        "border-t font-medium [&>tr]:last:border-b-0",
        className
      ),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCaption({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn("mt-4 text-sm opacity-80", className),
      ...props
    }
  );
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tooltip$1.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Portal, { children: /* @__PURE__ */ jsxs(
    Tooltip$1.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(Tooltip$1.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}

// src/core/primitive-ui-kit.ts
var primitiveUiKit = {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
};

// src/core/types.ts
var DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
function isRowVisible(row, hiddenRows, showHiddenRows) {
  if (!hiddenRows) {
    return true;
  }
  if (showHiddenRows) {
    return true;
  }
  return !hiddenRows.getIsHidden(row);
}
function resolveRowActionLabel(label, row) {
  return typeof label === "function" ? label(row) : label;
}
function canUseRowAction(action, row) {
  return !action.hidden?.(row);
}
function canEditRow(editableRows, row) {
  return editableRows?.canEditRow ? editableRows.canEditRow(row) : Boolean(editableRows);
}
function alignClassName(align) {
  switch (align) {
    case "center":
      return "text-center";
    case "end":
      return "text-right";
    default:
      return "text-left";
  }
}
function resolveColumnAlign(align, type) {
  if (align) {
    return align;
  }
  if (type === "numeric") {
    return "end";
  }
  return "start";
}
function headerAlignClassName(context) {
  const meta = context.column.columnDef.meta;
  return alignClassName(resolveColumnAlign(meta?.align, meta?.type));
}
function cellAlignClassName(context) {
  const meta = context.column.columnDef.meta;
  return alignClassName(resolveColumnAlign(meta?.align, meta?.type));
}
function hideOnClassName(hideOn) {
  if (!hideOn) {
    return void 0;
  }
  const values = Array.isArray(hideOn) ? hideOn : [hideOn];
  return values.map((value) => `dt-hide-on-${value}`).join(" ");
}
function isHiddenAtContainerWidth(hideOn, containerWidth) {
  if (!hideOn || containerWidth <= 0) {
    return false;
  }
  const values = Array.isArray(hideOn) ? hideOn : [hideOn];
  return values.some(
    (value) => containerWidth < DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS[value]
  );
}

// src/core/data-table/use-data-table-container-width.ts
var BREAKPOINT_WIDTHS = Object.values(DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS).slice().sort((first, second) => first - second);
function useDataTableContainerWidth(containerRef) {
  const widthRef = React30.useRef(0);
  const [width, setWidth] = React30.useState(0);
  React30.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    let frameId = null;
    const updateWidth = () => {
      const nextWidth = quantizeContainerWidth(element.clientWidth);
      if (nextWidth === widthRef.current) {
        return;
      }
      widthRef.current = nextWidth;
      setWidth(nextWidth);
    };
    updateWidth();
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateWidth();
      });
    });
    observer.observe(element);
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, [containerRef]);
  return width;
}
function quantizeContainerWidth(width) {
  if (width <= 0) {
    return 0;
  }
  let bucket = 1;
  for (const breakpointWidth of BREAKPOINT_WIDTHS) {
    if (width < breakpointWidth) {
      break;
    }
    bucket = breakpointWidth;
  }
  return bucket;
}
function useDataTableScrollViewport(containerRef, refreshKey) {
  const [viewportElement, setViewportElement] = React30.useState(null);
  const [viewportHeight, setViewportHeight] = React30.useState(0);
  React30.useEffect(() => {
    const element = containerRef.current?.querySelector(
      "[data-slot='scroll-area-viewport']"
    ) ?? null;
    setViewportElement(element);
    if (!element) {
      setViewportHeight(0);
      return;
    }
    let frameId = null;
    const updateHeight = () => {
      setViewportHeight((currentHeight) => {
        const nextHeight = element.clientHeight;
        return currentHeight === nextHeight ? currentHeight : nextHeight;
      });
    };
    updateHeight();
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateHeight();
      });
    });
    observer.observe(element);
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, [containerRef, refreshKey]);
  return { viewportElement, viewportHeight };
}
function DataTableCardPanel({
  cardClassName,
  cardGridClassName,
  cardRenderer,
  currentRowSelection,
  DataTableCardView,
  DataTableEmptyState,
  dragAndDrop,
  editableRows,
  editingRowId,
  emptyNode,
  enableRowSelection,
  flexGrow,
  getRowClassName,
  hasCardTitle,
  infiniteScroll,
  localSearchValue,
  onRowClick,
  renderedRows,
  renderExpandedRow,
  resolvedLabels,
  resolvedLoadingRowCount,
  rowActions = [],
  ScrollArea: ScrollArea2,
  sentinelRef,
  setCurrentRowSelection,
  setEditingRowId,
  shouldRenderInitialLoading,
  tableContainerClassName,
  uiClassNames,
  virtualization
}) {
  const shouldRenderCards = shouldRenderInitialLoading || renderedRows.length > 0;
  const cardScrollContainerRef = React30.useRef(null);
  const { viewportElement, viewportHeight } = useDataTableScrollViewport(
    cardScrollContainerRef,
    shouldRenderCards
  );
  const containerWidth = useDataTableContainerWidth(cardScrollContainerRef);
  const virtualizationConfig = typeof virtualization === "object" ? virtualization.card : void 0;
  const enableCardVirtualization = !shouldRenderInitialLoading && renderedRows.length > 0 && virtualizationConfig?.enabled === true;
  const lanes = resolveCardVirtualizationLanes(
    virtualizationConfig?.lanes,
    containerWidth
  );
  const virtualRowCount = Math.ceil(renderedRows.length / lanes);
  const shouldUseVirtualCardRows = enableCardVirtualization && Boolean(viewportElement) && viewportHeight > 0;
  const cardVirtualizer = useVirtualizer({
    count: enableCardVirtualization ? virtualRowCount : 0,
    enabled: shouldUseVirtualCardRows,
    estimateSize: () => virtualizationConfig?.estimateCardHeight ?? 280,
    getScrollElement: () => viewportElement,
    overscan: virtualizationConfig?.overscan ?? 4
  });
  const virtualCardRows = shouldUseVirtualCardRows ? cardVirtualizer.getVirtualItems() : [];
  const renderCardView = (rows, options) => /* @__PURE__ */ jsx(
    DataTableCardView,
    {
      rows,
      cardRenderer,
      cardGridClassName,
      cardClassName,
      rowActions,
      editableRows,
      renderExpandedRow,
      hasCardTitle,
      rowSelection: currentRowSelection,
      onRowSelectionChange: setCurrentRowSelection,
      enableRowSelection,
      editingRowId,
      onEditingRowIdChange: setEditingRowId,
      getRowClassName,
      onRowClick,
      getRowDraggable: dragAndDrop?.getRowDraggable,
      onRowDragStart: dragAndDrop?.onRowDragStart,
      onRowDragEnd: dragAndDrop?.onRowDragEnd,
      isLoading: options?.isLoading,
      loadingRowCount: options?.loadingRowCount,
      labels: resolvedLabels
    }
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: cardScrollContainerRef,
      "data-dtp-slot": "data-table-card-shell",
      className: cn(
        "box-border border-2 border-transparent transition-colors",
        flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
        dragAndDrop?.isDragging && (uiClassNames.dragActive ?? "rounded-md border-dashed")
      ),
      children: /* @__PURE__ */ jsx(
        ScrollArea2,
        {
          className: cn(
            flexGrow ? "min-h-0 flex-1" : "h-full",
            uiClassNames.cardScrollArea,
            tableContainerClassName
          ),
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              "data-dtp-slot": "data-table-card-viewport",
              className: cn(
                "flex min-h-full min-w-0 flex-col",
                flexGrow && "min-h-0 flex-1",
                uiClassNames.cardViewport
              ),
              children: [
                shouldRenderCards ? shouldRenderInitialLoading ? renderCardView([], {
                  isLoading: true,
                  loadingRowCount: resolvedLoadingRowCount
                }) : shouldUseVirtualCardRows ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-dtp-slot": "data-table-card-virtualizer",
                    style: {
                      height: cardVirtualizer.getTotalSize(),
                      position: "relative",
                      width: "100%"
                    },
                    children: virtualCardRows.map((virtualRow) => {
                      const startIndex = virtualRow.index * lanes;
                      const rows = renderedRows.slice(
                        startIndex,
                        startIndex + lanes
                      );
                      return /* @__PURE__ */ jsx(
                        "div",
                        {
                          "data-index": virtualRow.index,
                          ref: cardVirtualizer.measureElement,
                          style: {
                            left: 0,
                            position: "absolute",
                            top: 0,
                            transform: `translateY(${virtualRow.start}px)`,
                            width: "100%"
                          },
                          children: renderCardView(rows)
                        },
                        virtualRow.key
                      );
                    })
                  }
                ) : renderCardView(renderedRows) : /* @__PURE__ */ jsx("div", { className: "flex min-h-0 flex-1 items-center justify-center p-4", children: emptyNode ?? /* @__PURE__ */ jsx(
                  DataTableEmptyState,
                  {
                    title: localSearchValue ? resolvedLabels.noMatchingRowsTitle : resolvedLabels.noRowsTitle,
                    description: localSearchValue ? resolvedLabels.noMatchingRowsDescription : resolvedLabels.noRowsDescription
                  }
                ) }),
                infiniteScroll?.enabled && !shouldRenderInitialLoading ? /* @__PURE__ */ jsx("div", { className: "shrink-0 px-4 pb-4", children: /* @__PURE__ */ jsx("div", { ref: sentinelRef, className: "h-4 w-full" }) }) : null
              ]
            }
          )
        }
      )
    }
  );
}
function resolveCardVirtualizationLanes(configuredLanes, containerWidth) {
  if (typeof configuredLanes === "number") {
    return Math.max(1, Math.floor(configuredLanes));
  }
  if (configuredLanes !== "auto") {
    return 1;
  }
  if (containerWidth >= 1536) {
    return 5;
  }
  if (containerWidth >= 1280) {
    return 4;
  }
  if (containerWidth >= 1024) {
    return 3;
  }
  if (containerWidth >= 640) {
    return 2;
  }
  return 1;
}
function DataTableFooterSection({
  children,
  currentPagination,
  DataTableFooter,
  effectivePageCount,
  footerTotalRowCount,
  handleFooterPageIndexChange,
  handleFooterPageSizeChange,
  labels,
  rowsPerPageOptions,
  showFooter
}) {
  if (!showFooter && !children) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { "data-dtp-slot": "data-table-footer", className: "shrink-0", children: [
    showFooter ? /* @__PURE__ */ jsx(
      DataTableFooter,
      {
        pageIndex: currentPagination.pageIndex,
        pageCount: effectivePageCount,
        pageSize: currentPagination.pageSize,
        totalRowCount: footerTotalRowCount,
        rowsPerPageOptions,
        onPageIndexChange: handleFooterPageIndexChange,
        onPageSizeChange: handleFooterPageSizeChange,
        labels
      }
    ) : null,
    children
  ] });
}
function useRowEditing({
  columns,
  editableRows
}) {
  const [editingRowId, setEditingRowId] = React30.useState(null);
  const [draftValues, setDraftValues] = React30.useState({});
  const draftValuesRef = React30.useRef(draftValues);
  const [isSavingEdit, setIsSavingEdit] = React30.useState(false);
  React30.useEffect(() => {
    draftValuesRef.current = draftValues;
  }, [draftValues]);
  const cancelEditing = React30.useCallback(() => {
    setEditingRowId(null);
    setDraftValues({});
  }, []);
  const startEditingRow = React30.useCallback(
    (row, rowId) => {
      const initialValues = editableRows?.getInitialValues?.(row) ?? defaultDraftValues(row, columns);
      setDraftValues(initialValues);
      setEditingRowId(rowId);
    },
    [columns, editableRows]
  );
  const saveEdit = React30.useCallback(
    async (row) => {
      if (!editableRows) {
        return;
      }
      setIsSavingEdit(true);
      try {
        await editableRows.onSaveRow(row, draftValuesRef.current);
        React30.startTransition(cancelEditing);
      } finally {
        setIsSavingEdit(false);
      }
    },
    [cancelEditing, editableRows]
  );
  return {
    cancelEditing,
    draftValues,
    editingRowId,
    isSavingEdit,
    saveEdit,
    setDraftValues,
    setEditingRowId,
    startEditingRow
  };
}
function defaultDraftValues(row, columns) {
  return columns.reduce((draft, column) => {
    if ("accessorKey" in column && typeof column.accessorKey === "string") {
      draft[column.accessorKey] = row[column.accessorKey];
    }
    return draft;
  }, {});
}
function renderEditableCell(context, draftValues, setDraftValues, components) {
  const { Checkbox: Checkbox2, Input: Input3 } = components;
  const column = context.column.columnDef;
  const meta = column.meta;
  const accessorKey = "accessorKey" in column && typeof column.accessorKey === "string" ? column.accessorKey : context.column.id;
  const draftValue = draftValues[accessorKey];
  const setDraftValue = (value) => {
    setDraftValues((current) => ({
      ...current,
      [accessorKey]: value
    }));
  };
  if (meta?.renderEditCell) {
    return meta.renderEditCell({
      cell: context,
      row: context.row.original,
      value: context.getValue(),
      draftValue,
      setDraftValue
    });
  }
  const inputType = getEditableInputType(meta?.type, draftValue);
  if (typeof draftValue === "boolean") {
    return /* @__PURE__ */ jsx(
      Checkbox2,
      {
        checked: draftValue,
        onCheckedChange: (checked) => {
          setDraftValue(checked === true);
        }
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Input3,
    {
      type: inputType,
      value: meta?.formatEditValue ? meta.formatEditValue(draftValue, context) : getEditableInputValue(draftValue, inputType),
      onChange: (event) => {
        const rawValue = event.target.value;
        const parsedValue = meta?.parseEditValue ? meta.parseEditValue(rawValue, context) : parseEditableInputValue(rawValue, inputType, draftValue);
        setDraftValue(parsedValue);
      }
    }
  );
}
function getEditableInputType(type, value) {
  if (type === "numeric" || typeof value === "number") {
    return "number";
  }
  if (type === "date" || value instanceof Date) {
    return "datetime-local";
  }
  return "text";
}
function getEditableInputValue(value, inputType = "text") {
  if (value == null) {
    return "";
  }
  if (value instanceof Date) {
    return inputType === "datetime-local" ? value.toISOString().slice(0, 16) : value.toISOString();
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  return "";
}
function parseEditableInputValue(value, inputType, previousValue) {
  if (inputType === "number") {
    return value === "" ? null : Number(value);
  }
  if (inputType === "datetime-local") {
    if (!value) {
      return null;
    }
    return previousValue instanceof Date ? new Date(value) : value;
  }
  return value;
}
function renderDataTableCellContent(context, classNames, options) {
  const column = context.column.columnDef;
  const meta = column.meta;
  const value = context.getValue();
  const hasCustomCell = options?.hasCustomCell ?? false;
  const renderedCellContent = hasCustomCell && column.cell ? flexRender(column.cell, context) : void 0;
  const hasComplexRenderedContent = isComplexRenderedCellContent(
    renderedCellContent
  );
  const resolvedOverflow = resolveDataTableCellOverflow({
    context,
    useCustomOverflowDefaults: options?.useCustomOverflowDefaults ?? false,
    value
  });
  if (meta?.type === "date" && !hasCustomCell) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-dtp-slot": "data-table-cell-content",
        "data-dtp-overflow": resolvedOverflow,
        className: cn(
          getCellOverflowClassName(resolvedOverflow),
          "flex w-full min-w-0 items-center justify-end gap-2"
        ),
        children: [
          /* @__PURE__ */ jsx(
            IconClock,
            {
              className: cn(
                "shrink-0",
                classNames?.mutedText ?? "opacity-70"
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", children: formatDateValue(value) })
        ]
      }
    );
  }
  const content = renderedCellContent !== void 0 && renderedCellContent !== null && renderedCellContent !== "" ? renderedCellContent : value == null || value === "" ? /* @__PURE__ */ jsx("span", { className: classNames?.mutedText ?? "opacity-70", children: "-" }) : formatCellValue(value);
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-dtp-slot": "data-table-cell-content",
      "data-dtp-overflow": resolvedOverflow,
      className: cn(
        getCellOverflowClassName(resolvedOverflow),
        "w-full min-w-0 max-w-full",
        hasComplexRenderedContent && "[&>*]:max-w-full [&>*]:min-w-0"
      ),
      children: content
    }
  );
}
function resolveDataTableCellOverflow({
  context,
  useCustomOverflowDefaults,
  value
}) {
  const column = context.column.columnDef;
  const resolvedOverflow = typeof column.meta?.overflow === "function" ? column.meta.overflow({
    row: context.row.original,
    value
  }) : column.meta?.overflow;
  if (resolvedOverflow) {
    return resolvedOverflow;
  }
  return useCustomOverflowDefaults ? "clip" : "truncate";
}
function getCellOverflowClassName(overflow) {
  switch (overflow) {
    case "clip":
      return "block overflow-hidden whitespace-nowrap";
    case "wrap":
      return "block overflow-hidden whitespace-normal break-words";
    case "visible":
      return "block overflow-visible whitespace-normal";
    case "truncate":
    default:
      return "block overflow-hidden text-ellipsis whitespace-nowrap";
  }
}
function isComplexRenderedCellContent(content) {
  if (content == null) {
    return false;
  }
  return React30.isValidElement(content) || Array.isArray(content) || typeof content === "object";
}
function formatDateValue(value) {
  if (typeof value === "number") {
    return new Date(value * 1e3).toLocaleString();
  }
  if (typeof value === "string" && value) {
    return value;
  }
  return "-";
}
function formatCellValue(value) {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "-";
  }
}

// src/core/data-table/data-table-utils.ts
var DATA_TABLE_LOADING_ROW = /* @__PURE__ */ Symbol("data-table-loading-row");
var UTILITY_COLUMN_SIZE = 50;
function createDataTableLoadingRows(count) {
  return Array.from({ length: count }, (_, index) => {
    return {
      [DATA_TABLE_LOADING_ROW]: true,
      index
    };
  });
}
function isDataTableLoadingRow(row) {
  return Boolean(
    row && typeof row === "object" && DATA_TABLE_LOADING_ROW in row
  );
}
function getDataTableLoadingRowId(index) {
  return `__loading__${index}`;
}
function getConfiguredColumnMinWidth(column) {
  if (typeof column.meta?.minWidth === "number") {
    return column.meta.minWidth;
  }
  if (Object.prototype.hasOwnProperty.call(column, "minSize")) {
    const minSize = column.minSize;
    if (typeof minSize === "number") {
      return minSize;
    }
  }
  return void 0;
}
function decorateFilterableColumn(column) {
  const filter = column.meta?.filter;
  if (!filter || column.filterFn) {
    return column;
  }
  return {
    ...column,
    filterFn: (row, columnId, filterValue) => {
      if (!hasFilterValue(filterValue)) {
        return true;
      }
      const value = row.getValue(columnId);
      const optionValue = filter.getOptionValue?.(value, row.original) ?? normalizeFilterValue(value);
      if (filter.type === "multi") {
        return Array.isArray(filterValue) ? filterValue.map(String).includes(optionValue) : true;
      }
      if (filter.type === "select") {
        return optionValue === String(filterValue);
      }
      return normalizeFilterValue(value).toLowerCase().includes(String(filterValue).toLowerCase());
    }
  };
}
function normalizeColumnFilterOptions(options) {
  return options.map(
    (option) => typeof option === "string" ? { label: startCase(option), value: option } : option
  );
}
function normalizeFilterValue(value) {
  if (value == null) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") {
    return String(value);
  }
  return "";
}
function hasFilterValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== void 0 && value !== null && value !== "";
}
function rowMatchesToolbarQuery(row, columns, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }
  return columns.some((column) => {
    const value = getColumnSearchValue(row, column);
    return normalizeFilterValue(value).toLowerCase().includes(normalizedQuery);
  });
}
function getColumnSearchValue(row, column) {
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return row[column.accessorKey];
  }
  if ("accessorFn" in column && typeof column.accessorFn === "function") {
    return column.accessorFn(row, 0);
  }
  return void 0;
}
async function exportDataTableCsv({
  csvExport,
  table
}) {
  if (csvExport === false) {
    return;
  }
  const options = csvExport === true ? {} : csvExport;
  const filename = options.filename ?? "data-table.csv";
  const exportColumnIds = options.columns ? new Set(options.columns) : void 0;
  const columns = table.getVisibleLeafColumns().filter(
    (column) => !isUtilityColumnId(column.id) && column.id !== "__spacer__" && (!exportColumnIds || exportColumnIds.has(column.id))
  );
  const rows = table.getFilteredRowModel().rows;
  const csvRows = [];
  if (options.includeHeaders ?? true) {
    csvRows.push(
      columns.map(
        (column) => typeof column.columnDef.header === "string" ? column.columnDef.header : startCase(column.id)
      )
    );
  }
  for (const row of rows) {
    csvRows.push(
      columns.map((column) => {
        const value = row.getValue(column.id);
        return options.getCellValue ? options.getCellValue({
          row: row.original,
          rowId: row.id,
          columnId: column.id,
          value
        }) : value;
      })
    );
  }
  const csv = csvRows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  if (options.onExport) {
    await options.onExport({
      csv,
      filename,
      rows: rows.map((row) => row.original)
    });
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
function escapeCsvCell(value) {
  const text = normalizeFilterValue(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
function getInitialColumnPinning(columns) {
  const left = [];
  const right = [];
  for (const [index, column] of columns.entries()) {
    const columnId = getColumnId(column, index);
    if (column.meta?.fixed === "left") {
      left.push(columnId);
    }
    if (column.meta?.fixed === "right") {
      right.push(columnId);
    }
  }
  return { left, right };
}
function getColumnId(column, index) {
  if (column.id) {
    return column.id;
  }
  const accessorKey = getAccessorKey(column);
  if (accessorKey) {
    return accessorKey;
  }
  return `column-${index}`;
}
function getAccessorKey(column) {
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey;
  }
  return void 0;
}
function getFixedSide(column) {
  const pinnedSide = column.getIsPinned();
  if (pinnedSide) {
    return pinnedSide;
  }
  if (column.id === "__select__") {
    return "left";
  }
  if (column.id === "__expand__") {
    return "left";
  }
  if (column.id === "__actions__") {
    return "right";
  }
  const meta = column.columnDef.meta;
  return meta?.fixed;
}
function getPinnedColumnClassName(side, uiClassNames, options) {
  const isUtilityColumn = options?.isUtilityColumn ?? false;
  return cn(
    "sticky backdrop-blur box-border",
    uiClassNames.pinnedColumn,
    !isUtilityColumn && "border-dotted",
    isUtilityColumn ? uiClassNames.pinnedUtilityColumn : void 0,
    side === "left" ? "border-r-1" : "border-l"
  );
}
function isUtilityColumnId(columnId) {
  return columnId === "__select__" || columnId === "__expand__" || columnId === "__actions__";
}
function getDensityHeaderClassName(density) {
  switch (density) {
    case "compact":
      return "h-8 py-1";
    case "spacious":
      return "h-14 py-4";
    case "comfortable":
    default:
      return void 0;
  }
}
function getDensityCellClassName(density) {
  switch (density) {
    case "compact":
      return "py-1.5";
    case "spacious":
      return "py-4";
    case "comfortable":
    default:
      return void 0;
  }
}
function moveColumnInOrder(currentOrder, sourceColumnId, targetColumnId) {
  const order = currentOrder.includes(sourceColumnId) ? currentOrder.slice() : [...currentOrder, sourceColumnId];
  const sourceIndex = order.indexOf(sourceColumnId);
  const targetIndex = order.indexOf(targetColumnId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return order;
  }
  const [source] = order.splice(sourceIndex, 1);
  order.splice(targetIndex, 0, source);
  return order;
}
function startCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (character) => character.toUpperCase());
}
function DataTableBodyRowInner({
  columnLayouts,
  components,
  currentDensity,
  draftValues,
  dragAndDrop,
  explicitCustomCellColumnIds,
  getRowClassName,
  isDraggable,
  isEditing,
  isExpanded,
  isInitialLoadingRow,
  isSelected,
  loadingState,
  onRowClick,
  originalRow,
  renderExpandedRow,
  row,
  setDraftValues,
  uiClassNames,
  visibleCells,
  visibleLeafColumnCount
}) {
  const { Checkbox: Checkbox2, Input: Input3, Skeleton: Skeleton2, TableCell: TableCell2, TableRow: TableRow2 } = components;
  return /* @__PURE__ */ jsxs(React30.Fragment, { children: [
    /* @__PURE__ */ jsx(
      TableRow2,
      {
        draggable: isInitialLoadingRow ? false : isDraggable,
        "data-loading": loadingState?.isLoading || void 0,
        "data-state": isInitialLoadingRow ? void 0 : isSelected ? "selected" : void 0,
        role: onRowClick && !isInitialLoadingRow ? "button" : void 0,
        tabIndex: onRowClick && !isInitialLoadingRow ? 0 : void 0,
        className: cn(
          !isInitialLoadingRow && getRowClassName?.(originalRow),
          uiClassNames.row,
          isSelected && !isInitialLoadingRow && uiClassNames.rowSelected,
          onRowClick && !isInitialLoadingRow && "cursor-pointer",
          isInitialLoadingRow && "pointer-events-none"
        ),
        onClick: (event) => {
          if (isInitialLoadingRow) {
            return;
          }
          const target = event.target;
          if (target?.closest("[data-row-click-ignore='true']")) {
            return;
          }
          void onRowClick?.({ row: originalRow, rowId: row.id });
        },
        onKeyDown: (event) => {
          if (isInitialLoadingRow || !onRowClick || event.key !== "Enter" && event.key !== " ") {
            return;
          }
          const target = event.target;
          if (target?.closest("[data-row-click-ignore='true']")) {
            return;
          }
          event.preventDefault();
          void onRowClick({ row: originalRow, rowId: row.id });
        },
        onDragStart: (event) => {
          if (isInitialLoadingRow) {
            return;
          }
          dragAndDrop?.onRowDragStart?.({
            row: originalRow,
            rowId: row.id,
            event
          });
        },
        onDragEnd: (event) => {
          if (isInitialLoadingRow) {
            return;
          }
          dragAndDrop?.onRowDragEnd?.({
            row: originalRow,
            rowId: row.id,
            event
          });
        },
        children: visibleCells.map((cell) => {
          const meta = cell.column.columnDef.meta;
          const cellContext = cell.getContext();
          const value = cell.getValue();
          const layout = columnLayouts.get(cell.column.id);
          const isSelectionColumn = layout?.isSelectionColumn ?? false;
          const isExpansionColumn = layout?.isExpansionColumn ?? false;
          const isActionsColumn = layout?.isActionsColumn ?? false;
          const isSpacerColumn = layout?.isSpacerColumn ?? false;
          const hideClassName = hideOnClassName(meta?.hideOn);
          const cellClassName = isInitialLoadingRow || isDataTableLoadingRow(originalRow) ? void 0 : typeof meta?.cellClassName === "function" ? meta.cellClassName({
            row: originalRow,
            value
          }) : meta?.cellClassName;
          return /* @__PURE__ */ jsx(
            TableCell2,
            {
              className: cn(
                "border-b",
                getDensityCellClassName(currentDensity),
                uiClassNames.cellBorder,
                layout?.utilityClassName,
                layout?.isSpacerColumn && "border-b-0 bg-transparent p-0",
                layout?.pinnedClassName,
                hideClassName,
                cellAlignClassName(cellContext),
                meta?.responsiveClassName,
                cellClassName
              ),
              style: layout?.cellStyle,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-row-click-ignore": isSelectionColumn || isExpansionColumn || isActionsColumn ? "true" : void 0,
                  className: "min-w-0 max-w-full",
                  children: loadingState?.isLoading ? meta?.skeleton?.(cellContext) ?? loadingState.skeleton ?? /* @__PURE__ */ jsx(
                    Skeleton2,
                    {
                      className: cn(
                        "h-4 rounded",
                        meta?.type === "numeric" ? "ml-auto w-16" : meta?.type === "date" ? "ml-auto w-28" : "w-full"
                      )
                    }
                  ) : isEditing && cell.column.id !== "__select__" && cell.column.id !== "__expand__" && cell.column.id !== "__actions__" ? renderEditableCell(cellContext, draftValues, setDraftValues, {
                    Checkbox: Checkbox2,
                    Input: Input3
                  }) : renderDataTableCellContent(cellContext, uiClassNames, {
                    hasCustomCell: explicitCustomCellColumnIds.has(cell.column.id) || isSelectionColumn || isExpansionColumn || isActionsColumn || isSpacerColumn,
                    useCustomOverflowDefaults: explicitCustomCellColumnIds.has(cell.column.id) || isSelectionColumn || isExpansionColumn || isActionsColumn || isSpacerColumn
                  })
                }
              )
            },
            cell.id
          );
        })
      }
    ),
    !isInitialLoadingRow && renderExpandedRow && isExpanded ? /* @__PURE__ */ jsx(TableRow2, { children: /* @__PURE__ */ jsx(
      TableCell2,
      {
        colSpan: Math.max(1, visibleLeafColumnCount),
        className: cn(
          "border-b",
          getDensityCellClassName(currentDensity),
          uiClassNames.cellBorder
        ),
        children: renderExpandedRow({
          row: originalRow,
          rowId: row.id,
          tableRow: row
        })
      }
    ) }) : null
  ] });
}
function areDataTableBodyRowsEqual(previous, next) {
  return previous.row.id === next.row.id && previous.row.original === next.row.original && previous.rowIndex === next.rowIndex && previous.isSelected === next.isSelected && previous.isInitialLoadingRow === next.isInitialLoadingRow && previous.isEditing === next.isEditing && previous.isExpanded === next.isExpanded && previous.isDraggable === next.isDraggable && sameLoadingState(previous.loadingState, next.loadingState) && sameVisibleCells(previous.visibleCells, next.visibleCells) && previous.components === next.components && sameColumnLayouts(
    previous.columnLayouts,
    next.columnLayouts,
    next.visibleCells
  ) && previous.currentDensity === next.currentDensity && previous.renderExpandedRow === next.renderExpandedRow && previous.onRowClick === next.onRowClick && previous.dragAndDrop === next.dragAndDrop && previous.getRowClassName === next.getRowClassName && previous.uiClassNames === next.uiClassNames && previous.explicitCustomCellColumnIds === next.explicitCustomCellColumnIds && (!previous.isEditing || previous.draftValues === next.draftValues);
}
function sameLoadingState(previous, next) {
  return previous?.isLoading === next?.isLoading && previous?.skeleton === next?.skeleton;
}
function sameVisibleCells(previous, next) {
  return previous.length === next.length && previous.every((cell, index) => {
    const nextCell = next[index];
    return nextCell?.id === cell.id && nextCell.column.id === cell.column.id;
  });
}
function sameColumnLayouts(previous, next, cells) {
  return cells.every((cell) => {
    const previousLayout = previous.get(cell.column.id);
    const nextLayout = next.get(cell.column.id);
    return previousLayout?.fixedSide === nextLayout?.fixedSide && previousLayout?.isActionsColumn === nextLayout?.isActionsColumn && previousLayout?.isExpansionColumn === nextLayout?.isExpansionColumn && previousLayout?.isSelectionColumn === nextLayout?.isSelectionColumn && previousLayout?.isSpacerColumn === nextLayout?.isSpacerColumn && previousLayout?.isUtilityColumn === nextLayout?.isUtilityColumn && previousLayout?.pinnedClassName === nextLayout?.pinnedClassName && previousLayout?.utilityClassName === nextLayout?.utilityClassName && sameCellStyle(previousLayout?.cellStyle, nextLayout?.cellStyle);
  });
}
function sameCellStyle(previous, next) {
  return previous?.width === next?.width && previous?.minWidth === next?.minWidth && previous?.maxWidth === next?.maxWidth && previous?.insetInlineStart === next?.insetInlineStart && previous?.insetInlineEnd === next?.insetInlineEnd;
}
var DataTableBodyRow = React30.memo(
  DataTableBodyRowInner,
  areDataTableBodyRowsEqual
);
function DataTableHeaderCellInner({
  currentDensity,
  currentSorting,
  draggedColumnIdRef,
  enableColumnReordering,
  enableColumnResizing,
  header,
  headerGroupHeaders,
  layout,
  primeColumnForResize,
  reorderColumn,
  resetColumnSize,
  TableHead: TableHead2,
  uiClassNames
}) {
  const meta = header.column.columnDef.meta;
  const canSort = header.column.getCanSort();
  const sortingState = header.column.getIsSorted();
  const sortingIndex = currentSorting.findIndex(
    (sort) => sort.id === header.column.id
  );
  const canReorderColumn = enableColumnReordering && !layout.isUtilityColumn && !layout.isSpacerColumn;
  const hideClassName = hideOnClassName(meta?.hideOn);
  return /* @__PURE__ */ jsxs(
    TableHead2,
    {
      className: cn(
        "relative border-b",
        getDensityHeaderClassName(currentDensity),
        layout.utilityClassName,
        layout.isSpacerColumn && "border-b-1 bg-transparent p-0",
        layout.pinnedClassName,
        hideClassName,
        headerAlignClassName(header.getContext()),
        meta?.headerClassName,
        meta?.responsiveClassName
      ),
      style: layout.headerStyle,
      "aria-sort": sortingState === "asc" ? "ascending" : sortingState === "desc" ? "descending" : canSort ? "none" : void 0,
      draggable: canReorderColumn,
      tabIndex: canReorderColumn ? 0 : void 0,
      onDragStart: canReorderColumn ? (event) => {
        draggedColumnIdRef.current = header.column.id;
        event.dataTransfer.effectAllowed = "move";
      } : void 0,
      onDragOver: canReorderColumn ? (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      } : void 0,
      onDrop: canReorderColumn ? (event) => {
        event.preventDefault();
        const sourceColumnId = draggedColumnIdRef.current;
        draggedColumnIdRef.current = null;
        if (sourceColumnId) {
          reorderColumn(sourceColumnId, header.column.id);
        }
      } : void 0,
      onKeyDown: canReorderColumn ? (event) => {
        if (!event.altKey || event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
          return;
        }
        event.preventDefault();
        const headers = headerGroupHeaders.filter(
          (item) => !isUtilityColumnId(item.column.id) && item.column.id !== "__spacer__"
        );
        const currentIndex = headers.findIndex(
          (item) => item.column.id === header.column.id
        );
        const target = headers[event.key === "ArrowLeft" ? currentIndex - 1 : currentIndex + 1];
        if (target) {
          reorderColumn(header.column.id, target.column.id);
        }
      } : void 0,
      children: [
        header.isPlaceholder ? null : canSort ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: cn(
              "flex w-full items-center gap-2 font-medium",
              headerAlignClassName(header.getContext())
            ),
            onClick: header.column.getToggleSortingHandler(),
            children: [
              /* @__PURE__ */ jsx("span", { className: "truncate", children: flexRender(header.column.columnDef.header, header.getContext()) }),
              sortingState ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  IconChevronDown,
                  {
                    className: cn(
                      "size-4 shrink-0 transition-transform",
                      sortingState === "desc" ? "rotate-0" : "rotate-180"
                    )
                  }
                ),
                currentSorting.length > 1 && sortingIndex >= 0 ? /* @__PURE__ */ jsx("span", { className: "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none", children: sortingIndex + 1 }) : null
              ] }) : /* @__PURE__ */ jsx(
                IconSelector,
                {
                  className: cn(
                    "size-4 shrink-0",
                    uiClassNames.headerSortIcon ?? "opacity-70"
                  )
                }
              )
            ]
          }
        ) : flexRender(header.column.columnDef.header, header.getContext()),
        enableColumnResizing && header.column.getCanResize() ? /* @__PURE__ */ jsx(
          "div",
          {
            onDoubleClick: () => {
              resetColumnSize(header.column.id);
            },
            onMouseDown: (event) => {
              primeColumnForResize(header.column.id, header.getSize());
              header.getResizeHandler()(event);
            },
            onTouchStart: (event) => {
              primeColumnForResize(header.column.id, header.getSize());
              header.getResizeHandler()(event);
            },
            className: cn(
              "absolute inset-y-0 right-0 z-50 h-full w-3 translate-x-1/2 cursor-col-resize touch-none select-none after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2",
              uiClassNames.resizeHandle ?? "after:bg-current after:opacity-20 hover:after:opacity-70",
              header.column.getIsResizing() && (uiClassNames.resizeHandleActive ?? "after:opacity-100")
            )
          }
        ) : null
      ]
    },
    header.id
  );
}
function areDataTableHeaderCellsEqual(previous, next) {
  return previous.header.id === next.header.id && previous.header.column.id === next.header.column.id && previous.currentDensity === next.currentDensity && previous.enableColumnReordering === next.enableColumnReordering && previous.enableColumnResizing === next.enableColumnResizing && previous.TableHead === next.TableHead && previous.uiClassNames === next.uiClassNames && previous.draggedColumnIdRef === next.draggedColumnIdRef && previous.primeColumnForResize === next.primeColumnForResize && previous.reorderColumn === next.reorderColumn && previous.resetColumnSize === next.resetColumnSize && previous.selectionState === next.selectionState && sameSorting(previous.currentSorting, next.currentSorting) && sameHeaderGroupHeaders(
    previous.headerGroupHeaders,
    next.headerGroupHeaders
  ) && sameHeaderLayout(previous.layout, next.layout);
}
function sameSorting(previous, next) {
  return previous.length === next.length && previous.every((sort, index) => {
    const nextSort = next[index];
    return nextSort?.id === sort.id && nextSort.desc === sort.desc;
  });
}
function sameHeaderGroupHeaders(previous, next) {
  return previous.length === next.length && previous.every((header, index) => next[index]?.id === header.id);
}
function sameHeaderLayout(previous, next) {
  return previous.fixedSide === next.fixedSide && previous.isSpacerColumn === next.isSpacerColumn && previous.isUtilityColumn === next.isUtilityColumn && previous.pinnedClassName === next.pinnedClassName && previous.utilityClassName === next.utilityClassName && previous.headerStyle?.width === next.headerStyle?.width && previous.headerStyle?.minWidth === next.headerStyle?.minWidth && previous.headerStyle?.maxWidth === next.headerStyle?.maxWidth && previous.headerStyle?.insetInlineStart === next.headerStyle?.insetInlineStart && previous.headerStyle?.insetInlineEnd === next.headerStyle?.insetInlineEnd;
}
var DataTableHeaderCell = React30.memo(
  DataTableHeaderCellInner,
  areDataTableHeaderCellsEqual
);
function DataTableTablePanel({
  bodyRowComponents,
  columnLayouts,
  currentDensity,
  currentSorting = [],
  DataTableEmptyState,
  dragAndDrop,
  draggedColumnIdRef,
  draftValues,
  editingRowId,
  emptyNode,
  enableColumnReordering,
  enableColumnResizing,
  explicitCustomCellColumnIds,
  fillMinWidth,
  flexGrow,
  getColumnLayout,
  getRowClassName,
  getRowLoadingState,
  infiniteScroll,
  layoutMode,
  localSearchValue,
  onRowClick,
  primeColumnForResize,
  renderedRows,
  renderExpandedRow,
  reorderColumn,
  resetColumnSize,
  resolvedLabels,
  rowsToRender,
  ScrollArea: ScrollArea2,
  ScrollBar: ScrollBar2,
  sentinelRef,
  setDraftValues,
  shouldRenderInitialLoading,
  stickyHeader,
  summaryRows,
  table,
  tableClassName,
  tableContainerClassName,
  Table: Table2,
  TableBody: TableBody2,
  TableCell: TableCell2,
  TableFooter: TableFooter2 = "tfoot",
  TableHead: TableHead2,
  TableHeader: TableHeader2,
  TableRow: TableRow2,
  tableScrollContainerRef,
  uiClassNames,
  virtualPaddingBottom,
  virtualPaddingTop,
  visibleLeafColumnCount,
  visibleLeafColumns
}) {
  const selectionState = table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-dtp-slot": "data-table-table-shell",
      className: cn(
        "box-border border-2 border-transparent transition-colors",
        flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
        dragAndDrop?.isDragging && (uiClassNames.dragActive ?? "rounded-md border-dashed")
      ),
      children: /* @__PURE__ */ jsx(
        "div",
        {
          ref: tableScrollContainerRef,
          className: cn(flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full"),
          children: /* @__PURE__ */ jsxs(
            ScrollArea2,
            {
              className: cn(
                "rounded-md border",
                flexGrow ? "min-h-0 flex-1" : "h-full",
                uiClassNames.tableContainer,
                uiClassNames.tableScrollArea,
                tableContainerClassName
              ),
              children: [
                /* @__PURE__ */ jsx("div", { className: "min-h-full", children: /* @__PURE__ */ jsxs(
                  Table2,
                  {
                    className: cn(
                      "w-full table-fixed border-separate border-spacing-0",
                      tableClassName
                    ),
                    style: {
                      minWidth: layoutMode === "fill" ? fillMinWidth || void 0 : void 0,
                      width: layoutMode === "fit" ? table.getTotalSize() : "100%"
                    },
                    children: [
                      /* @__PURE__ */ jsx("colgroup", { children: table.getVisibleLeafColumns().map((column) => {
                        const layout = getColumnLayout(column.id);
                        return /* @__PURE__ */ jsx("col", { style: layout.colStyle }, column.id);
                      }) }),
                      /* @__PURE__ */ jsx(
                        TableHeader2,
                        {
                          className: cn(
                            stickyHeader ? uiClassNames.tableStickyHeader ?? "sticky top-0 z-30 backdrop-blur" : void 0
                          ),
                          children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow2, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsx(
                            DataTableHeaderCell,
                            {
                              currentDensity,
                              currentSorting,
                              draggedColumnIdRef,
                              enableColumnReordering,
                              enableColumnResizing,
                              header,
                              headerGroupHeaders: headerGroup.headers,
                              layout: getColumnLayout(header.column.id),
                              primeColumnForResize,
                              reorderColumn,
                              resetColumnSize,
                              selectionState: header.column.id === "__select__" ? selectionState : void 0,
                              TableHead: TableHead2,
                              uiClassNames
                            },
                            header.id
                          )) }, headerGroup.id))
                        }
                      ),
                      /* @__PURE__ */ jsx(TableBody2, { children: renderedRows.length ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        virtualPaddingTop > 0 ? /* @__PURE__ */ jsx(TableRow2, { "aria-hidden": "true", children: /* @__PURE__ */ jsx(
                          TableCell2,
                          {
                            colSpan: Math.max(1, visibleLeafColumnCount),
                            className: "border-b-0 p-0",
                            style: { height: virtualPaddingTop }
                          }
                        ) }) : null,
                        rowsToRender.map(({ row, rowIndex }) => {
                          const originalRow = row.original;
                          const isInitialLoadingRow = isDataTableLoadingRow(originalRow);
                          const loadingState = isInitialLoadingRow ? { isLoading: true } : getRowLoadingState?.(originalRow, rowIndex);
                          const resolvedLoadingState = typeof loadingState === "boolean" ? { isLoading: loadingState } : loadingState;
                          const isDraggable = isInitialLoadingRow ? false : dragAndDrop?.getRowDraggable?.(originalRow) ?? false;
                          return /* @__PURE__ */ jsx(
                            DataTableBodyRow,
                            {
                              columnLayouts,
                              components: bodyRowComponents,
                              currentDensity,
                              draftValues,
                              dragAndDrop,
                              explicitCustomCellColumnIds,
                              getRowClassName,
                              isDraggable,
                              isEditing: editingRowId === row.id,
                              isExpanded: row.getIsExpanded(),
                              isInitialLoadingRow,
                              isSelected: row.getIsSelected(),
                              loadingState: resolvedLoadingState,
                              onRowClick,
                              originalRow,
                              renderExpandedRow,
                              row,
                              rowIndex,
                              setDraftValues,
                              uiClassNames,
                              visibleCells: row.getVisibleCells(),
                              visibleLeafColumnCount
                            },
                            row.id
                          );
                        }),
                        virtualPaddingBottom > 0 ? /* @__PURE__ */ jsx(TableRow2, { "aria-hidden": "true", children: /* @__PURE__ */ jsx(
                          TableCell2,
                          {
                            colSpan: Math.max(1, visibleLeafColumnCount),
                            className: "border-b-0 p-0",
                            style: { height: virtualPaddingBottom }
                          }
                        ) }) : null
                      ] }) : /* @__PURE__ */ jsx(TableRow2, { children: /* @__PURE__ */ jsx(
                        TableCell2,
                        {
                          colSpan: Math.max(1, visibleLeafColumnCount),
                          className: "h-full grow",
                          children: /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-full w-full grow items-center justify-center", children: emptyNode ?? /* @__PURE__ */ jsx(
                            DataTableEmptyState,
                            {
                              title: localSearchValue ? resolvedLabels.noMatchingRowsTitle : resolvedLabels.noRowsTitle,
                              description: localSearchValue ? resolvedLabels.noMatchingRowsDescription : resolvedLabels.noRowsDescription
                            }
                          ) })
                        }
                      ) }) }),
                      summaryRows.length ? /* @__PURE__ */ jsx(TableFooter2, { children: summaryRows.map((summaryRow) => /* @__PURE__ */ jsx(TableRow2, { children: visibleLeafColumns.map((column, index) => {
                        const content = summaryRow.cells[column.id] ?? (index === 0 ? summaryRow.label : null);
                        return /* @__PURE__ */ jsx(
                          TableCell2,
                          {
                            className: cn(
                              "border-b font-medium",
                              uiClassNames.cellBorder
                            ),
                            children: typeof content === "function" ? content({
                              rows: table.getFilteredRowModel().rows.map((row) => row.original),
                              columnId: column.id
                            }) : content
                          },
                          `${summaryRow.key}-${column.id}`
                        );
                      }) }, summaryRow.key)) }) : null
                    ]
                  }
                ) }),
                infiniteScroll?.enabled && renderedRows.length && !shouldRenderInitialLoading ? /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx("div", { ref: sentinelRef, className: "h-4 w-full" }) }) : null,
                /* @__PURE__ */ jsx(ScrollBar2, { orientation: "horizontal" })
              ]
            }
          )
        }
      )
    }
  );
}
function DataTableToolbarSection({
  allRows,
  columnFilters,
  columnVisibilityOptions,
  compactToolbar,
  customToolbar,
  DataTableToolbar,
  description,
  effectiveToolbarActions,
  enableColumnPinning,
  enableDensityToggle,
  enableViewToggle,
  hiddenRowsLabel,
  labels,
  onClearColumnFilters,
  onColumnFilterChange,
  onColumnPinningChange,
  onDensityChange,
  onShowHiddenRowsChange,
  onToolbarQueryValueChange,
  onViewModeChange,
  openFileDialog,
  selectedRows,
  selectionActions,
  showHiddenRows,
  table,
  title,
  toolbarQueryPlaceholder,
  toolbarQueryValue,
  toolbarVisibility,
  density,
  viewMode
}) {
  return /* @__PURE__ */ jsx("div", { "data-dtp-slot": "data-table-toolbar", className: "shrink-0", children: /* @__PURE__ */ jsx(
    DataTableToolbar,
    {
      title,
      description,
      toolbarQueryValue,
      toolbarQueryPlaceholder,
      onToolbarQueryValueChange,
      customToolbar,
      compactToolbar,
      viewMode,
      onViewModeChange,
      enableViewToggle,
      toolbarActions: effectiveToolbarActions,
      selectionActions,
      selectedRows,
      showHiddenRows,
      hiddenRowsLabel,
      onShowHiddenRowsChange,
      allRows,
      columnVisibilityOptions,
      onColumnVisibilityChange: (columnId, visible) => {
        table.getColumn(columnId)?.toggleVisibility(visible);
      },
      enableColumnPinning,
      onColumnPinningChange,
      columnFilters,
      onColumnFilterChange,
      onClearColumnFilters,
      density,
      onDensityChange,
      enableDensityToggle,
      labels,
      toolbarVisibility,
      openFileDialog
    }
  ) });
}
function useDataTableColumns({
  Button: Button2,
  Checkbox: Checkbox2,
  DataTableRowActions,
  Tooltip: Tooltip2,
  TooltipContent: TooltipContent2,
  TooltipTrigger: TooltipTrigger2,
  cancelEditing,
  columns,
  editableRows,
  editingRowId,
  enableRowSelection,
  getRowCanExpand,
  isSavingEdit,
  labels,
  lastSelectedRowIdRef,
  renderExpandedRow,
  rowActions,
  saveEdit,
  startEditingRow,
  tableRef
}) {
  const selectRowRange = React30.useCallback(
    (targetRowId, selected) => {
      const tableInstance = tableRef.current;
      if (!tableInstance || !lastSelectedRowIdRef.current) {
        return;
      }
      const rows = tableInstance.getRowModel().rows.filter((row) => !isDataTableLoadingRow(row.original));
      const startIndex = rows.findIndex(
        (row) => row.id === lastSelectedRowIdRef.current
      );
      const endIndex = rows.findIndex((row) => row.id === targetRowId);
      if (startIndex < 0 || endIndex < 0) {
        return;
      }
      const from = Math.min(startIndex, endIndex);
      const to = Math.max(startIndex, endIndex);
      tableInstance.setRowSelection((current) => {
        const next = { ...current };
        for (const row of rows.slice(from, to + 1)) {
          if (selected) {
            next[row.id] = true;
          } else {
            delete next[row.id];
          }
        }
        return next;
      });
    },
    [lastSelectedRowIdRef, tableRef]
  );
  return React30.useMemo(() => {
    const defs = [];
    if (renderExpandedRow) {
      defs.push({
        id: "__expand__",
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: UTILITY_COLUMN_SIZE,
        minSize: UTILITY_COLUMN_SIZE,
        maxSize: UTILITY_COLUMN_SIZE,
        header: () => /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.expandRow }),
        cell: ({ row }) => {
          const canExpand = getRowCanExpand?.(row.original) ?? Boolean(renderExpandedRow);
          if (!canExpand) {
            return null;
          }
          const isExpanded = row.getIsExpanded();
          return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
            Button2,
            {
              type: "button",
              variant: "ghost",
              size: "icon-sm",
              "aria-label": isExpanded ? labels.collapseRow : labels.expandRow,
              "aria-expanded": isExpanded,
              onClick: () => row.toggleExpanded(),
              children: /* @__PURE__ */ jsx(
                IconChevronDown,
                {
                  className: cn(
                    "transition-transform",
                    isExpanded ? "rotate-0" : "-rotate-90"
                  )
                }
              )
            }
          ) });
        }
      });
    }
    if (enableRowSelection) {
      defs.push({
        id: "__select__",
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: UTILITY_COLUMN_SIZE,
        minSize: UTILITY_COLUMN_SIZE,
        maxSize: UTILITY_COLUMN_SIZE,
        header: ({ table }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
          Checkbox2,
          {
            checked: table.getIsAllPageRowsSelected(),
            onCheckedChange: (checked) => {
              table.toggleAllPageRowsSelected(checked === true);
            },
            "aria-label": "Select all visible rows"
          }
        ) }),
        cell: ({ row }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
          Checkbox2,
          {
            checked: row.getIsSelected(),
            onClick: (event) => {
              if (!event.shiftKey || !lastSelectedRowIdRef.current) {
                lastSelectedRowIdRef.current = row.id;
                return;
              }
              event.preventDefault();
              event.stopPropagation();
              selectRowRange(row.id, !row.getIsSelected());
              lastSelectedRowIdRef.current = row.id;
            },
            onCheckedChange: (checked) => {
              lastSelectedRowIdRef.current = row.id;
              row.toggleSelected(checked === true);
            },
            "aria-label": "Select row"
          }
        ) })
      });
    }
    defs.push(...columns.map((column) => decorateFilterableColumn(column)));
    if (rowActions.length || editableRows) {
      defs.push({
        id: "__actions__",
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: UTILITY_COLUMN_SIZE,
        minSize: UTILITY_COLUMN_SIZE,
        maxSize: UTILITY_COLUMN_SIZE,
        header: () => /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.actions }),
        cell: ({ row }) => {
          const rowId = row.id;
          const isEditing = editingRowId === rowId;
          if (isEditing) {
            return /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                Button2,
                {
                  type: "button",
                  size: "sm",
                  disabled: isSavingEdit,
                  onClick: () => {
                    void saveEdit(row.original);
                  },
                  children: labels.saveEdit
                }
              ),
              /* @__PURE__ */ jsxs(Tooltip2, { children: [
                /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
                  Button2,
                  {
                    type: "button",
                    size: "icon-sm",
                    variant: "ghost",
                    onClick: cancelEditing,
                    children: [
                      /* @__PURE__ */ jsx(IconChevronDown, { className: "rotate-45" }),
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.cancelEdit })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx(TooltipContent2, { children: labels.cancelEdit })
              ] })
            ] });
          }
          return /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-center", children: /* @__PURE__ */ jsx(
            DataTableRowActions,
            {
              row: row.original,
              rowActions,
              editableRows,
              isEditing: false,
              onStartEditing: () => {
                startEditingRow(row.original, row.id);
              },
              onCancelEditing: () => {
              },
              labels
            }
          ) });
        }
      });
    }
    return defs;
  }, [
    Button2,
    Checkbox2,
    DataTableRowActions,
    Tooltip2,
    TooltipContent2,
    TooltipTrigger2,
    cancelEditing,
    columns,
    editableRows,
    editingRowId,
    enableRowSelection,
    getRowCanExpand,
    isSavingEdit,
    labels,
    lastSelectedRowIdRef,
    renderExpandedRow,
    rowActions,
    saveEdit,
    selectRowRange,
    startEditingRow
  ]);
}
function useDataTableInfiniteScroll({
  enabled,
  hasMore,
  isLoadingMore,
  onLoadMore
}) {
  const sentinelRef = React30.useRef(null);
  const onLoadMoreEvent = React30.useEffectEvent(onLoadMore);
  React30.useEffect(() => {
    if (!enabled || !hasMore || isLoadingMore) {
      return;
    }
    const target = sentinelRef.current;
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          void onLoadMoreEvent();
        }
      },
      {
        rootMargin: "200px 0px 200px 0px"
      }
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [enabled, hasMore, isLoadingMore]);
  return sentinelRef;
}
function useDataTablePaginationClamp({
  enabled,
  maxPageIndex,
  onPageIndexChange,
  pageIndex,
  setLocalPageIndex
}) {
  React30.useEffect(() => {
    if (!enabled) {
      return;
    }
    if (pageIndex >= 0 && pageIndex <= maxPageIndex) {
      return;
    }
    const nextPageIndex = Math.min(Math.max(pageIndex, 0), maxPageIndex);
    setLocalPageIndex(nextPageIndex);
    onPageIndexChange?.(nextPageIndex);
  }, [enabled, maxPageIndex, onPageIndexChange, pageIndex, setLocalPageIndex]);
}

// src/core/data-table/use-data-table-instance.ts
function useDataTableInstance({
  autoResetPageIndex,
  columnResizeMode,
  currentColumnFilters,
  currentColumnOrder,
  currentColumnPinning,
  currentColumnSizing,
  currentExpanded,
  currentPagination,
  currentRowSelection,
  currentSorting,
  currentViewMode,
  defaultColumn,
  effectiveColumnVisibility,
  enableColumnResizing,
  enableRowSelection,
  getRowCanExpand,
  globalFilterFn,
  globalFilterValue,
  handleColumnFiltersChange,
  handleColumnOrderChange,
  handleColumnPinningChange,
  handleColumnVisibilityChange,
  handleExpandedChange,
  infiniteScroll,
  manualFiltering,
  manualPagination,
  manualSorting,
  onPageIndexChange,
  onPageSizeChange,
  pageCount,
  pageIndex,
  pageSize,
  renderExpandedRow,
  setCurrentRowSelection,
  setCurrentSorting,
  setLocalColumnSizing,
  setLocalPagination,
  shouldRenderInitialLoading,
  tableColumns,
  tableData,
  tableGetRowId,
  tableRef,
  tableScrollElement,
  toolbarFilteredData,
  totalRowCount,
  virtualization,
  viewportHeight
}) {
  const generatedColumnIds = React30.useMemo(() => {
    return tableColumns.map(
      (column, index) => getColumnId(column, index)
    );
  }, [tableColumns]);
  const effectiveColumnOrder = React30.useMemo(() => {
    const columnIds = generatedColumnIds;
    const dataColumnIds = columnIds.filter(
      (columnId) => !isUtilityColumnId(columnId) && columnId !== "__spacer__"
    );
    const dataColumnIdSet = new Set(dataColumnIds);
    const orderedDataColumnIds = currentColumnOrder.filter(
      (columnId) => dataColumnIdSet.has(columnId)
    );
    const unorderedDataColumnIds = dataColumnIds.filter(
      (columnId) => !orderedDataColumnIds.includes(columnId)
    );
    return [
      ...columnIds.filter(
        (columnId) => columnId === "__expand__" || columnId === "__select__"
      ),
      ...orderedDataColumnIds,
      ...unorderedDataColumnIds,
      ...columnIds.filter((columnId) => columnId === "__spacer__"),
      ...columnIds.filter((columnId) => columnId === "__actions__")
    ];
  }, [currentColumnOrder, generatedColumnIds]);
  const effectiveColumnPinning = React30.useMemo(() => {
    const columnIdSet = new Set(generatedColumnIds);
    const dataColumnIdSet = new Set(
      generatedColumnIds.filter(
        (columnId) => !isUtilityColumnId(columnId) && columnId !== "__spacer__"
      )
    );
    const dataLeft = (currentColumnPinning.left ?? []).filter(
      (columnId) => dataColumnIdSet.has(columnId)
    );
    const dataRight = (currentColumnPinning.right ?? []).filter(
      (columnId) => dataColumnIdSet.has(columnId)
    );
    return {
      left: [
        ...["__expand__", "__select__"].filter(
          (columnId) => columnIdSet.has(columnId)
        ),
        ...dataLeft
      ],
      right: [
        ...dataRight,
        ...["__actions__"].filter((columnId) => columnIdSet.has(columnId))
      ]
    };
  }, [currentColumnPinning, generatedColumnIds]);
  const tableState = React30.useMemo(
    () => ({
      sorting: currentSorting,
      pagination: currentPagination,
      rowSelection: currentRowSelection,
      columnVisibility: effectiveColumnVisibility,
      columnFilters: currentColumnFilters,
      globalFilter: globalFilterValue,
      expanded: currentExpanded,
      columnOrder: effectiveColumnOrder,
      columnPinning: effectiveColumnPinning,
      columnSizing: currentColumnSizing
    }),
    [
      currentColumnFilters,
      currentColumnSizing,
      currentExpanded,
      currentPagination,
      currentRowSelection,
      currentSorting,
      effectiveColumnVisibility,
      effectiveColumnOrder,
      effectiveColumnPinning,
      globalFilterValue
    ]
  );
  const handlePaginationChange = React30.useCallback(
    (updater) => {
      const nextValue = typeof updater === "function" ? updater(currentPagination) : updater;
      if (pageIndex === void 0 || pageSize === void 0) {
        setLocalPagination((current) => ({
          pageIndex: pageIndex === void 0 ? nextValue.pageIndex : current.pageIndex,
          pageSize: pageSize === void 0 ? nextValue.pageSize : current.pageSize
        }));
      }
      onPageIndexChange?.(nextValue.pageIndex);
      onPageSizeChange?.(nextValue.pageSize);
    },
    [
      currentPagination,
      onPageIndexChange,
      onPageSizeChange,
      pageIndex,
      pageSize,
      setLocalPagination
    ]
  );
  const handleColumnSizingChange = React30.useCallback((updater) => {
    setLocalColumnSizing((current) => functionalUpdate(updater, current));
  }, [setLocalColumnSizing]);
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? void 0 : getFilteredRowModel(),
    getSortedRowModel: manualSorting ? void 0 : getSortedRowModel(),
    getExpandedRowModel: renderExpandedRow ? getExpandedRowModel() : void 0,
    getPaginationRowModel: manualPagination || infiniteScroll?.enabled ? void 0 : getPaginationRowModel(),
    enableRowSelection,
    enableMultiRowSelection: enableRowSelection,
    enableColumnResizing,
    columnResizeMode,
    getRowId: tableGetRowId,
    getRowCanExpand: renderExpandedRow ? (row) => getRowCanExpand?.(row.original) ?? true : void 0,
    globalFilterFn,
    manualSorting,
    manualFiltering,
    manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
    defaultColumn,
    autoResetPageIndex,
    state: tableState,
    onSortingChange: setCurrentSorting,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setCurrentRowSelection,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onExpandedChange: handleExpandedChange,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnPinningChange: handleColumnPinningChange,
    onColumnSizingChange: handleColumnSizingChange
  });
  tableRef.current = table;
  const visibleLeafColumns = table.getVisibleLeafColumns();
  const reorderColumn = React30.useCallback(
    (sourceColumnId, targetColumnId) => {
      if (sourceColumnId === targetColumnId) {
        return;
      }
      const defaultOrder = table.getAllLeafColumns().map((column) => column.id).filter((columnId) => !isUtilityColumnId(columnId));
      const nextOrder = moveColumnInOrder(
        currentColumnOrder.length ? currentColumnOrder : defaultOrder,
        sourceColumnId,
        targetColumnId
      );
      handleColumnOrderChange(nextOrder);
    },
    [currentColumnOrder, handleColumnOrderChange, table]
  );
  const renderedRows = table.getRowModel().rows;
  const virtualizationConfig = typeof virtualization === "object" ? virtualization : void 0;
  const enableVirtualization = currentViewMode === "table" && !shouldRenderInitialLoading && (virtualization === true || virtualizationConfig?.enabled === true);
  const shouldUseVirtualRows = enableVirtualization && Boolean(tableScrollElement) && viewportHeight > 0;
  const rowVirtualizer = useVirtualizer({
    count: enableVirtualization ? renderedRows.length : 0,
    enabled: shouldUseVirtualRows,
    estimateSize: () => virtualizationConfig?.estimateRowHeight ?? 48,
    getScrollElement: () => tableScrollElement,
    overscan: virtualizationConfig?.overscan ?? 8
  });
  const virtualItems = shouldUseVirtualRows ? rowVirtualizer.getVirtualItems() : [];
  const rowsToRender = shouldUseVirtualRows ? virtualItems.flatMap((virtualItem) => {
    const row = renderedRows[virtualItem.index];
    return row ? [{ row, rowIndex: virtualItem.index }] : [];
  }) : renderedRows.map((row, rowIndex) => ({ row, rowIndex }));
  const virtualPaddingTop = shouldUseVirtualRows ? virtualItems[0]?.start ?? 0 : 0;
  const virtualPaddingBottom = shouldUseVirtualRows ? Math.max(
    0,
    rowVirtualizer.getTotalSize() - (virtualItems.at(-1)?.end ?? virtualPaddingTop)
  ) : 0;
  const derivedTotalRowCount = manualPagination || infiniteScroll?.enabled ? toolbarFilteredData.length : table.getFilteredRowModel().rows.length;
  const effectiveTotalRowCount = totalRowCount ?? derivedTotalRowCount;
  const footerTotalRowCount = totalRowCount ?? effectiveTotalRowCount;
  const effectivePageCount = shouldRenderInitialLoading ? 1 : pageCount ?? (manualPagination || infiniteScroll?.enabled ? Math.max(
    1,
    Math.ceil(effectiveTotalRowCount / currentPagination.pageSize)
  ) : table.getPageCount());
  const maxPageIndex = Math.max(0, effectivePageCount - 1);
  const setLocalPageIndex = React30.useCallback(
    (nextPageIndex) => {
      if (pageIndex !== void 0) {
        return;
      }
      setLocalPagination(
        (current) => current.pageIndex === nextPageIndex ? current : { ...current, pageIndex: nextPageIndex }
      );
    },
    [pageIndex, setLocalPagination]
  );
  useDataTablePaginationClamp({
    enabled: !shouldRenderInitialLoading && !infiniteScroll?.enabled,
    maxPageIndex,
    onPageIndexChange,
    pageIndex: currentPagination.pageIndex,
    setLocalPageIndex
  });
  const handleFooterPageIndexChange = React30.useCallback(
    (nextPageIndex) => {
      onPageIndexChange?.(nextPageIndex);
      if (pageIndex === void 0) {
        setLocalPagination(
          (current) => current.pageIndex === nextPageIndex ? current : { ...current, pageIndex: nextPageIndex }
        );
      }
    },
    [onPageIndexChange, pageIndex, setLocalPagination]
  );
  const handleFooterPageSizeChange = React30.useCallback(
    (nextPageSize) => {
      onPageIndexChange?.(0);
      onPageSizeChange?.(nextPageSize);
      if (pageSize === void 0) {
        setLocalPagination({
          pageIndex: 0,
          pageSize: nextPageSize
        });
      }
    },
    [onPageIndexChange, onPageSizeChange, pageSize, setLocalPagination]
  );
  const sentinelRef = useDataTableInfiniteScroll({
    enabled: Boolean(infiniteScroll?.enabled),
    hasMore: Boolean(infiniteScroll?.hasMore),
    isLoadingMore: infiniteScroll?.isLoadingMore,
    onLoadMore: () => {
      void infiniteScroll?.onLoadMore();
    }
  });
  return {
    effectivePageCount,
    footerTotalRowCount,
    handleFooterPageIndexChange,
    handleFooterPageSizeChange,
    renderedRows,
    reorderColumn,
    rowsToRender,
    sentinelRef,
    table,
    virtualPaddingBottom,
    virtualPaddingTop,
    visibleLeafColumns
  };
}
function useControllableState({
  defaultValue,
  onChange,
  value
}) {
  const [uncontrolledValue, setUncontrolledValue] = React30.useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;
  const setValue = React30.useCallback(
    (updater) => {
      const nextValue = typeof updater === "function" ? updater(currentValue) : updater;
      onChange?.(nextValue);
      if (value === void 0) {
        setUncontrolledValue(nextValue);
      }
    },
    [currentValue, onChange, value]
  );
  return [currentValue, setValue];
}
var STORAGE_PREFIX = "data-table-pro:column-prefs:";
function readDataTableColumnPrefs(key) {
  if (!key || typeof window === "undefined") {
    return {};
  }
  try {
    const value = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!value) {
      return {};
    }
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
function usePersistDataTableColumnPrefs({
  key,
  prefs
}) {
  React30.useEffect(() => {
    if (!key || typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(prefs)
      );
    } catch {
    }
  }, [key, prefs]);
}

// src/core/data-table/use-data-table-state.ts
function useDataTableState({
  columnFilters,
  columnOrder,
  columnPinning,
  columnPrefsKey,
  columnVisibility,
  columns,
  data,
  density,
  enableRowSelection,
  enableToolbarQueryFiltering,
  expanded,
  getRowId,
  hiddenRows,
  isLoading,
  loadingRowCount,
  manualFiltering,
  onColumnFiltersChange,
  onColumnOrderChange,
  onColumnPinningChange,
  onColumnVisibilityChange,
  onDensityChange,
  onExpandedChange,
  onPageIndexChange,
  onRowSelectionChange,
  onShowHiddenRowsChange,
  onSortingChange,
  onToolbarQueryValueChange,
  onViewModeChange,
  pageIndex,
  pageSize,
  resolvedLabels,
  rowSelection,
  rowsPerPageOptions,
  selectionActions,
  showHiddenRows,
  sorting,
  toolbarQueryDebounceMs,
  toolbarQueryPlaceholder,
  toolbarQueryValue,
  viewMode,
  containerRef
}) {
  const persistedColumnPrefs = React30.useMemo(
    () => readDataTableColumnPrefs(columnPrefsKey),
    [columnPrefsKey]
  );
  const [localPagination, setLocalPagination] = React30.useState({
    pageIndex: 0,
    pageSize: rowsPerPageOptions[0] ?? 20
  });
  const [localColumnSizing, setLocalColumnSizing] = React30.useState(() => persistedColumnPrefs.sizing ?? {});
  const [currentSorting, setCurrentSorting] = useControllableState({
    value: sorting,
    onChange: onSortingChange,
    defaultValue: []
  });
  const [currentRowSelection, setCurrentRowSelection] = useControllableState({
    value: rowSelection,
    onChange: onRowSelectionChange,
    defaultValue: {}
  });
  const [currentColumnVisibility, setCurrentColumnVisibility] = useControllableState({
    value: columnVisibility,
    onChange: onColumnVisibilityChange,
    defaultValue: () => persistedColumnPrefs.visibility ?? {}
  });
  const [currentColumnFilters, setCurrentColumnFilters] = useControllableState({
    value: columnFilters,
    onChange: onColumnFiltersChange,
    defaultValue: []
  });
  const [currentExpanded, setCurrentExpanded] = useControllableState({
    value: expanded,
    onChange: onExpandedChange,
    defaultValue: {}
  });
  const [currentColumnOrder, setCurrentColumnOrder] = useControllableState({
    value: columnOrder,
    onChange: onColumnOrderChange,
    defaultValue: () => persistedColumnPrefs.order ?? []
  });
  const [currentColumnPinning, setCurrentColumnPinning] = useControllableState({
    value: columnPinning,
    onChange: onColumnPinningChange,
    defaultValue: () => persistedColumnPrefs.pinning ?? getInitialColumnPinning(columns)
  });
  const [currentViewMode, setCurrentViewMode] = useControllableState({
    value: viewMode,
    onChange: onViewModeChange,
    defaultValue: () => viewMode ?? "table"
  });
  const [currentShowHiddenRows, setCurrentShowHiddenRows] = useControllableState({
    value: showHiddenRows,
    onChange: onShowHiddenRowsChange,
    defaultValue: () => showHiddenRows ?? false
  });
  const [currentDensity, setCurrentDensity] = useControllableState({
    value: density,
    onChange: onDensityChange,
    defaultValue: () => density ?? persistedColumnPrefs.density ?? "comfortable"
  });
  const resolvedToolbarQueryValue = toolbarQueryValue ?? "";
  const resolvedToolbarQueryPlaceholder = toolbarQueryPlaceholder ?? resolvedLabels.searchPlaceholder;
  const resolvedToolbarQueryDebounceMs = toolbarQueryDebounceMs ?? 250;
  const [localSearchValue, setLocalSearchValue] = React30.useState(
    resolvedToolbarQueryValue
  );
  const containerWidth = useDataTableContainerWidth(containerRef);
  const hasOnSearchValueChange = Boolean(onToolbarQueryValueChange);
  const lastReportedSearchValueRef = React30.useRef(resolvedToolbarQueryValue);
  const onToolbarQueryValueChangeEvent = React30.useEffectEvent(
    (value) => {
      lastReportedSearchValueRef.current = value;
      onToolbarQueryValueChange?.(value);
    }
  );
  React30.useEffect(() => {
    lastReportedSearchValueRef.current = resolvedToolbarQueryValue;
    setLocalSearchValue(resolvedToolbarQueryValue);
  }, [resolvedToolbarQueryValue]);
  React30.useEffect(() => {
    if (!hasOnSearchValueChange) {
      return;
    }
    if (localSearchValue === resolvedToolbarQueryValue) {
      return;
    }
    if (localSearchValue === lastReportedSearchValueRef.current) {
      return;
    }
    const timeout = window.setTimeout(() => {
      onToolbarQueryValueChangeEvent(localSearchValue);
    }, resolvedToolbarQueryDebounceMs);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    hasOnSearchValueChange,
    localSearchValue,
    resolvedToolbarQueryDebounceMs,
    resolvedToolbarQueryValue
  ]);
  const currentPagination = React30.useMemo(
    () => ({
      pageIndex: pageIndex ?? localPagination.pageIndex,
      pageSize: pageSize ?? localPagination.pageSize
    }),
    [
      localPagination.pageIndex,
      localPagination.pageSize,
      pageIndex,
      pageSize
    ]
  );
  const resolvedLoadingRowCount = Math.max(
    1,
    loadingRowCount ?? Math.min(5, currentPagination.pageSize)
  );
  const currentColumnSizing = localColumnSizing;
  const globalFilterValue = "";
  const handleViewModeChange = React30.useCallback(
    (nextViewMode) => {
      setCurrentViewMode(nextViewMode);
    },
    [setCurrentViewMode]
  );
  const handleShowHiddenRowsChange = React30.useCallback(
    (nextShowHiddenRows) => {
      setCurrentShowHiddenRows(nextShowHiddenRows);
    },
    [setCurrentShowHiddenRows]
  );
  const handleDensityChange = React30.useCallback(
    (nextDensity) => {
      setCurrentDensity(nextDensity);
    },
    [setCurrentDensity]
  );
  const resetPageIndexForFilterChange = React30.useCallback(() => {
    onPageIndexChange?.(0);
    if (pageIndex === void 0) {
      setLocalPagination(
        (current) => current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
      );
    }
  }, [onPageIndexChange, pageIndex]);
  const filterResetSignature = React30.useMemo(
    () => JSON.stringify({
      globalFilterValue,
      columnFilters: currentColumnFilters
    }),
    [currentColumnFilters, globalFilterValue]
  );
  const lastFilterResetSignatureRef = React30.useRef(filterResetSignature);
  React30.useEffect(() => {
    if (manualFiltering) {
      lastFilterResetSignatureRef.current = filterResetSignature;
      return;
    }
    if (lastFilterResetSignatureRef.current === filterResetSignature) {
      return;
    }
    lastFilterResetSignatureRef.current = filterResetSignature;
    resetPageIndexForFilterChange();
  }, [filterResetSignature, manualFiltering, resetPageIndexForFilterChange]);
  usePersistDataTableColumnPrefs({
    key: columnPrefsKey,
    prefs: {
      visibility: columnVisibility ? void 0 : currentColumnVisibility,
      sizing: currentColumnSizing,
      order: columnOrder ? void 0 : currentColumnOrder,
      pinning: columnPinning ? void 0 : currentColumnPinning,
      density: density ? void 0 : currentDensity
    }
  });
  const responsiveColumnVisibility = React30.useMemo(() => {
    return columns.reduce((visibility, column, index) => {
      const columnId = getColumnId(column, index);
      if (isHiddenAtContainerWidth(column.meta?.hideOn, containerWidth)) {
        visibility[columnId] = false;
      }
      return visibility;
    }, {});
  }, [columns, containerWidth]);
  const effectiveColumnVisibility = React30.useMemo(() => {
    return {
      ...currentColumnVisibility,
      ...responsiveColumnVisibility
    };
  }, [currentColumnVisibility, responsiveColumnVisibility]);
  const visibleData = React30.useMemo(
    () => data.filter(
      (row) => isRowVisible(row, hiddenRows, currentShowHiddenRows)
    ),
    [currentShowHiddenRows, data, hiddenRows]
  );
  const toolbarFilteredData = React30.useMemo(() => {
    if (manualFiltering || !enableToolbarQueryFiltering || !localSearchValue.trim()) {
      return visibleData;
    }
    return visibleData.filter(
      (row) => rowMatchesToolbarQuery(row, columns, localSearchValue)
    );
  }, [
    columns,
    enableToolbarQueryFiltering,
    localSearchValue,
    manualFiltering,
    visibleData
  ]);
  const shouldRenderInitialLoading = isLoading && visibleData.length === 0;
  const loadingRows = React30.useMemo(
    () => createDataTableLoadingRows(resolvedLoadingRowCount),
    [resolvedLoadingRowCount]
  );
  const tableData = shouldRenderInitialLoading ? loadingRows : toolbarFilteredData;
  const tableGetRowId = React30.useCallback(
    (row, index) => {
      if (isDataTableLoadingRow(row)) {
        return getDataTableLoadingRowId(index);
      }
      return getRowId(row, index);
    },
    [getRowId]
  );
  const shouldResolveSelectedRows = enableRowSelection || (selectionActions?.length ?? 0) > 0 || Object.values(currentRowSelection).some(Boolean);
  const rowById = React30.useMemo(() => {
    if (!shouldResolveSelectedRows) {
      return /* @__PURE__ */ new Map();
    }
    return new Map(
      visibleData.map((row, index) => [getRowId(row, index), row])
    );
  }, [getRowId, shouldResolveSelectedRows, visibleData]);
  const selectedRows = React30.useMemo(() => {
    if (!shouldResolveSelectedRows) {
      return [];
    }
    return Object.entries(currentRowSelection).filter(([, selected]) => selected).map(([rowId]) => rowById.get(rowId)).filter((row) => Boolean(row));
  }, [currentRowSelection, rowById, shouldResolveSelectedRows]);
  return {
    currentColumnFilters,
    currentColumnOrder,
    currentColumnPinning,
    currentColumnSizing,
    currentDensity,
    currentExpanded,
    currentPagination,
    currentRowSelection,
    currentShowHiddenRows,
    currentSorting,
    currentViewMode,
    effectiveColumnVisibility,
    globalFilterValue,
    handleDensityChange,
    handleShowHiddenRowsChange,
    handleViewModeChange,
    localSearchValue,
    resolvedLoadingRowCount,
    resolvedToolbarQueryPlaceholder,
    selectedRows,
    setCurrentColumnFilters,
    setCurrentColumnOrder,
    setCurrentColumnPinning,
    setCurrentColumnVisibility,
    setCurrentExpanded,
    setCurrentRowSelection,
    setCurrentSorting,
    setLocalColumnSizing,
    setLocalPagination,
    setLocalSearchValue,
    shouldRenderInitialLoading,
    tableData,
    tableGetRowId,
    toolbarFilteredData,
    visibleData
  };
}
var EMPTY_COLUMN_LAYOUT = {
  cellStyle: void 0,
  colStyle: void 0,
  fixedSide: void 0,
  headerStyle: void 0,
  isActionsColumn: false,
  isExpansionColumn: false,
  isSelectionColumn: false,
  isSpacerColumn: false,
  isUtilityColumn: false,
  pinnedClassName: void 0,
  utilityClassName: void 0
};
function useColumnLayout({
  columns,
  columnSizing,
  editableRows,
  enableRowSelection,
  hasRowActions,
  hasRowExpansion,
  layoutMode,
  uiClassNames,
  visibleLeafColumns
}) {
  const explicitlySizedColumnIds = React30.useMemo(() => {
    const ids = /* @__PURE__ */ new Set();
    for (const [index, column] of columns.entries()) {
      if (Object.prototype.hasOwnProperty.call(column, "size")) {
        ids.add(getColumnId(column, index));
      }
    }
    if (enableRowSelection) {
      ids.add("__select__");
    }
    if (hasRowExpansion) {
      ids.add("__expand__");
    }
    if (hasRowActions || editableRows) {
      ids.add("__actions__");
    }
    return ids;
  }, [
    columns,
    editableRows,
    enableRowSelection,
    hasRowActions,
    hasRowExpansion
  ]);
  const minimumColumnWidths = React30.useMemo(() => {
    const widths = /* @__PURE__ */ new Map();
    for (const [index, column] of columns.entries()) {
      const configuredMinWidth = getConfiguredColumnMinWidth(column);
      if (configuredMinWidth !== void 0) {
        widths.set(getColumnId(column, index), configuredMinWidth);
      }
    }
    return widths;
  }, [columns]);
  const pinnedColumns = React30.useMemo(() => {
    const left = /* @__PURE__ */ new Map();
    const right = /* @__PURE__ */ new Map();
    let leftOffset = 0;
    for (const column of visibleLeafColumns) {
      if (getFixedSide(column) === "left") {
        left.set(column.id, leftOffset);
        leftOffset += getColumnLayoutSize(column);
      }
    }
    let rightOffset = 0;
    for (const column of [...visibleLeafColumns].reverse()) {
      if (getFixedSide(column) === "right") {
        right.set(column.id, rightOffset);
        rightOffset += getColumnLayoutSize(column);
      }
    }
    return { left, right };
  }, [visibleLeafColumns]);
  const fillColumnId = React30.useMemo(() => {
    if (layoutMode !== "fill") {
      return void 0;
    }
    const dataColumns = visibleLeafColumns.filter(
      (column) => !isUtilityColumnId(column.id)
    );
    if (!dataColumns.length) {
      return void 0;
    }
    const allDataColumnsAreFixed = dataColumns.every(
      (column) => explicitlySizedColumnIds.has(column.id) || Object.prototype.hasOwnProperty.call(columnSizing, column.id)
    );
    return allDataColumnsAreFixed ? dataColumns[dataColumns.length - 1]?.id : void 0;
  }, [
    columnSizing,
    explicitlySizedColumnIds,
    layoutMode,
    visibleLeafColumns
  ]);
  const fixedWidthColumnIds = React30.useMemo(() => {
    const ids = /* @__PURE__ */ new Set([
      ...explicitlySizedColumnIds,
      ...Object.keys(columnSizing)
    ]);
    if (fillColumnId) {
      ids.delete(fillColumnId);
    }
    return ids;
  }, [columnSizing, explicitlySizedColumnIds, fillColumnId]);
  const columnLayouts = React30.useMemo(() => {
    const layouts = /* @__PURE__ */ new Map();
    for (const column of visibleLeafColumns) {
      const isSelectionColumn = column.id === "__select__";
      const isExpansionColumn = column.id === "__expand__";
      const isActionsColumn = column.id === "__actions__";
      const isUtilityColumn = isSelectionColumn || isExpansionColumn || isActionsColumn;
      const isSpacerColumn = column.id === "__spacer__";
      const configuredMinWidth = minimumColumnWidths.get(column.id);
      const isFlexibleFillColumn = column.id === fillColumnId;
      const columnMinWidth = configuredMinWidth ?? (isFlexibleFillColumn ? column.getSize() : void 0);
      const shouldFixWidth = !isSpacerColumn && (layoutMode === "fit" || isUtilityColumn || fixedWidthColumnIds.has(column.id));
      const baseStyle = shouldFixWidth || columnMinWidth !== void 0 ? {
        width: shouldFixWidth ? isUtilityColumn ? UTILITY_COLUMN_SIZE : column.getSize() : void 0,
        minWidth: isUtilityColumn ? UTILITY_COLUMN_SIZE : shouldFixWidth ? column.getSize() : columnMinWidth,
        maxWidth: shouldFixWidth ? isUtilityColumn ? UTILITY_COLUMN_SIZE : column.getSize() : void 0
      } : void 0;
      const fixedSide = getFixedSide(column);
      const pinnedStyle = fixedSide ? {
        insetInlineStart: fixedSide === "left" ? pinnedColumns.left.get(column.id) : void 0,
        insetInlineEnd: fixedSide === "right" ? pinnedColumns.right.get(column.id) : void 0
      } : void 0;
      const cellStyle = baseStyle || pinnedStyle ? { ...baseStyle, ...pinnedStyle } : void 0;
      layouts.set(column.id, {
        cellStyle,
        colStyle: baseStyle,
        fixedSide,
        headerStyle: cellStyle,
        isActionsColumn,
        isExpansionColumn,
        isSelectionColumn,
        isSpacerColumn,
        isUtilityColumn,
        pinnedClassName: fixedSide ? getPinnedColumnClassName(fixedSide, uiClassNames, {
          isUtilityColumn
        }) : void 0,
        utilityClassName: isUtilityColumn ? "w-[50px] max-w-[50px] min-w-[50px] px-0" : void 0
      });
    }
    return layouts;
  }, [
    fillColumnId,
    fixedWidthColumnIds,
    layoutMode,
    minimumColumnWidths,
    pinnedColumns,
    uiClassNames,
    visibleLeafColumns
  ]);
  const fillMinWidth = React30.useMemo(() => {
    return visibleLeafColumns.reduce((total, column) => {
      const layout = columnLayouts.get(column.id);
      const configuredMinWidth = minimumColumnWidths.get(column.id);
      const isFlexibleFillColumn = column.id === fillColumnId;
      if (layout?.isUtilityColumn) {
        return total + UTILITY_COLUMN_SIZE;
      }
      if (fixedWidthColumnIds.has(column.id)) {
        return total + column.getSize();
      }
      return total + (configuredMinWidth ?? (isFlexibleFillColumn ? column.getSize() : 0));
    }, 0);
  }, [
    columnLayouts,
    fillColumnId,
    fixedWidthColumnIds,
    minimumColumnWidths,
    visibleLeafColumns
  ]);
  const getColumnLayout = React30.useCallback(
    (columnId) => columnLayouts.get(columnId) ?? EMPTY_COLUMN_LAYOUT,
    [columnLayouts]
  );
  return {
    columnLayouts,
    explicitlySizedColumnIds,
    fillMinWidth,
    getColumnLayout
  };
}
function getColumnLayoutSize(column) {
  return isUtilityColumnId(column.id) ? UTILITY_COLUMN_SIZE : column.getSize();
}
function createDataTableCardView(ui, DataTableRowActions) {
  const uiClassNames = ui.classNames ?? {};
  const { Card: Card2, CardContent: CardContent2, CardHeader: CardHeader2, Checkbox: Checkbox2, Skeleton: Skeleton2 } = ui;
  return function DataTableCardView({
    rows,
    cardRenderer,
    cardGridClassName,
    cardClassName,
    rowActions,
    editableRows,
    renderExpandedRow,
    hasCardTitle,
    rowSelection,
    onRowSelectionChange,
    enableRowSelection,
    editingRowId,
    onEditingRowIdChange,
    getRowClassName,
    onRowClick,
    getRowDraggable,
    onRowDragStart,
    onRowDragEnd,
    isLoading = false,
    loadingRowCount = 5,
    labels
  }) {
    const resolvedCardGridClassName = cardGridClassName ?? "grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),18rem))] justify-start";
    const cardGridClasses = cn(
      "grid min-h-0 w-full gap-4 p-1",
      uiClassNames.cardGrid,
      resolvedCardGridClassName
    );
    const cardItemClasses = (stateClassName) => cn(
      "relative min-w-0 max-w-full gap-0 overflow-hidden bg-transparent p-0",
      uiClassNames.cardItem,
      cardClassName,
      stateClassName
    );
    if (isLoading) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          role: "list",
          "data-dtp-slot": "data-table-card-grid",
          className: cardGridClasses,
          children: Array.from({ length: Math.max(1, loadingRowCount) }, (_, index) => /* @__PURE__ */ jsxs(
            Card2,
            {
              role: "listitem",
              "aria-hidden": "true",
              "data-dtp-slot": "data-table-card-item",
              className: cardItemClasses("min-h-52"),
              children: [
                hasCardTitle ? /* @__PURE__ */ jsxs(CardHeader2, { className: "px-4 pt-4 pb-3", children: [
                  /* @__PURE__ */ jsx(Skeleton2, { className: "h-5 w-40 max-w-[70%]" }),
                  /* @__PURE__ */ jsx(Skeleton2, { className: "h-4 w-24 max-w-[40%]" })
                ] }) : null,
                /* @__PURE__ */ jsxs(
                  CardContent2,
                  {
                    className: cn("space-y-3 pb-4", hasCardTitle ? "" : "pt-4"),
                    children: [
                      /* @__PURE__ */ jsx(Skeleton2, { className: "h-4 w-full" }),
                      /* @__PURE__ */ jsx(Skeleton2, { className: "h-4 w-[82%]" }),
                      /* @__PURE__ */ jsx(Skeleton2, { className: "h-4 w-[68%]" }),
                      /* @__PURE__ */ jsx(Skeleton2, { className: "h-24 w-full rounded-xl" })
                    ]
                  }
                )
              ]
            },
            `loading-card-${index}`
          ))
        }
      );
    }
    return /* @__PURE__ */ jsx(
      "div",
      {
        role: "list",
        "data-dtp-slot": "data-table-card-grid",
        className: cardGridClasses,
        children: rows.map((row) => {
          const rowId = row.id;
          const originalRow = row.original;
          const isSelected = Boolean(rowSelection[rowId]);
          const isEditing = editingRowId === rowId;
          const hasCardActions = rowActions.length > 0 || Boolean(editableRows);
          const showCardGradient = enableRowSelection || hasCardActions || hasCardTitle;
          const showCardOverlayControls = enableRowSelection || hasCardActions;
          const handleCardActivate = () => {
            if (!onRowClick) {
              return;
            }
            void onRowClick({ row: originalRow, rowId });
          };
          return /* @__PURE__ */ jsxs(
            Card2,
            {
              role: "listitem",
              draggable: getRowDraggable?.(originalRow) ?? false,
              "data-dtp-slot": "data-table-card-item",
              "data-state": isSelected ? "selected" : void 0,
              className: cardItemClasses(
                cn(
                  [getRowClassName?.(originalRow)].filter(Boolean).join(" "),
                  "transition transition-colors hover:scale-101 data-[state=selected]:scale-101",
                  uiClassNames.card,
                  isSelected ? uiClassNames.cardSelected : uiClassNames.cardUnselected
                )
              ),
              onDragStart: (event) => {
                onRowDragStart?.({ row: originalRow, rowId, event });
              },
              onDragEnd: (event) => {
                onRowDragEnd?.({ row: originalRow, rowId, event });
              },
              children: [
                showCardGradient ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: cn(
                      "pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b opacity-0 transition-opacity group-hover/card:opacity-100",
                      uiClassNames.cardOverlay ?? "from-transparent via-transparent to-transparent"
                    )
                  }
                ) : null,
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-dtp-slot": "data-table-card-renderer",
                    role: onRowClick ? "button" : void 0,
                    tabIndex: onRowClick ? 0 : void 0,
                    className: cn(
                      "flex min-h-0 max-w-full min-w-0 flex-1 overflow-hidden rounded-[inherit] [&>*]:min-w-0",
                      onRowClick && "cursor-pointer focus-visible:outline-none"
                    ),
                    onClick: (event) => {
                      const target = event.target;
                      if (target?.closest("[data-row-click-ignore='true']")) {
                        return;
                      }
                      handleCardActivate();
                    },
                    onKeyDown: (event) => {
                      const target = event.target;
                      if (target?.closest("[data-row-click-ignore='true']")) {
                        return;
                      }
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleCardActivate();
                      }
                    },
                    children: [
                      cardRenderer({
                        row: originalRow,
                        rowId,
                        isSelected,
                        onSelectedChange: (nextValue) => {
                          onRowSelectionChange(
                            updateRowSelection(rowSelection, rowId, nextValue)
                          );
                        },
                        actions: rowActions,
                        isEditing,
                        startEditing: () => {
                          onEditingRowIdChange(rowId);
                        },
                        cancelEditing: () => {
                          onEditingRowIdChange(null);
                        }
                      }),
                      isEditing || !renderExpandedRow || !row.getIsExpanded() ? null : renderExpandedRow({
                        row: originalRow,
                        rowId,
                        tableRow: row
                      })
                    ]
                  }
                ),
                showCardOverlayControls ? /* @__PURE__ */ jsxs(CardHeader2, { className: "absolute inset-x-0 top-0 z-20 flex flex-row items-center gap-3 space-y-0 px-4 pt-4 pb-8", children: [
                  enableRowSelection ? /* @__PURE__ */ jsx(
                    "div",
                    {
                      "data-row-click-ignore": "true",
                      className: "pointer-events-auto",
                      children: /* @__PURE__ */ jsx(
                        Checkbox2,
                        {
                          checked: isSelected,
                          "aria-label": `Select row ${rowId}`,
                          onCheckedChange: (checked) => {
                            onRowSelectionChange(
                              updateRowSelection(
                                rowSelection,
                                rowId,
                                checked === true
                              )
                            );
                          }
                        }
                      )
                    }
                  ) : null,
                  /* @__PURE__ */ jsx("div", { className: "pointer-events-none min-w-0 flex-1" }),
                  hasCardActions ? /* @__PURE__ */ jsx(
                    "div",
                    {
                      "data-row-click-ignore": "true",
                      className: "pointer-events-auto",
                      children: /* @__PURE__ */ jsx(
                        DataTableRowActions,
                        {
                          row: originalRow,
                          rowActions,
                          editableRows,
                          isEditing,
                          onStartEditing: () => {
                            onEditingRowIdChange(rowId);
                          },
                          onCancelEditing: () => {
                            onEditingRowIdChange(null);
                          },
                          labels
                        }
                      )
                    }
                  ) : null
                ] }) : null
              ]
            },
            rowId
          );
        })
      }
    );
  };
}
function updateRowSelection(rowSelection, rowId, isSelected) {
  if (isSelected) {
    return {
      ...rowSelection,
      [rowId]: true
    };
  }
  if (!rowSelection[rowId]) {
    return rowSelection;
  }
  const nextSelection = { ...rowSelection };
  delete nextSelection[rowId];
  return nextSelection;
}
function createDataTableEmptyState(ui) {
  const uiClassNames = ui.classNames ?? {};
  const {
    Empty: Empty2,
    EmptyContent: EmptyContent2,
    EmptyDescription: EmptyDescription2,
    EmptyHeader: EmptyHeader2,
    EmptyMedia: EmptyMedia2,
    EmptyTitle: EmptyTitle2
  } = ui;
  return function DataTableEmptyState({
    title = "No rows found",
    description = "Adjust your filters or create a new record to populate this table."
  }) {
    return /* @__PURE__ */ jsxs(
      Empty2,
      {
        className: `min-h-60 rounded-2xl ${uiClassNames.emptyState ?? "border bg-transparent"}`,
        children: [
          /* @__PURE__ */ jsxs(EmptyHeader2, { children: [
            /* @__PURE__ */ jsx(EmptyMedia2, { variant: "icon", children: /* @__PURE__ */ jsx(IconInbox, {}) }),
            /* @__PURE__ */ jsx(EmptyTitle2, { children: title }),
            /* @__PURE__ */ jsx(EmptyDescription2, { children: description })
          ] }),
          /* @__PURE__ */ jsx(EmptyContent2, {})
        ]
      }
    );
  };
}
function createDataTablePagination(ui) {
  const uiClassNames = ui.classNames ?? {};
  const {
    Pagination: Pagination2,
    PaginationContent: PaginationContent2,
    PaginationEllipsis: PaginationEllipsis2,
    PaginationFirst: PaginationFirst2,
    PaginationItem: PaginationItem2,
    PaginationLast: PaginationLast2,
    PaginationLink: PaginationLink2,
    PaginationNext: PaginationNext2,
    PaginationPrevious: PaginationPrevious2,
    Select: Select2,
    SelectContent: SelectContent2,
    SelectGroup: SelectGroup2,
    SelectItem: SelectItem2,
    SelectTrigger: SelectTrigger2,
    SelectValue: SelectValue2,
    Tooltip: Tooltip2,
    TooltipContent: TooltipContent2,
    TooltipTrigger: TooltipTrigger2
  } = ui;
  function DataTablePagination({
    pageIndex,
    pageCount,
    pageSize,
    totalRowCount,
    rowsPerPageOptions,
    onPageIndexChange,
    onPageSizeChange,
    labels
  }) {
    const pages = getVisiblePages(pageIndex, Math.max(1, pageCount));
    const canGoPrevious = pageIndex > 0;
    const canGoNext = pageIndex + 1 < pageCount;
    const lastPageIndex = Math.max(0, pageCount - 1);
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-1 items-center gap-3 text-sm ${uiClassNames.mutedText ?? "opacity-70"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "hidden @md/data-table:inline", children: labels.recordsPerPage }),
            /* @__PURE__ */ jsxs(
              Select2,
              {
                value: String(pageSize),
                onValueChange: (value) => {
                  onPageSizeChange(Number(value));
                },
                children: [
                  /* @__PURE__ */ jsx(
                    SelectTrigger2,
                    {
                      className: `w-22 ${uiClassNames.paginationSelectTrigger ?? ""}`,
                      children: /* @__PURE__ */ jsx(SelectValue2, {})
                    }
                  ),
                  /* @__PURE__ */ jsx(SelectContent2, { children: /* @__PURE__ */ jsx(SelectGroup2, { children: rowsPerPageOptions.map((option) => /* @__PURE__ */ jsx(SelectItem2, { value: String(option), children: option }, option)) }) })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center justify-center", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm ${uiClassNames.paginationTotal ?? ""}`,
          "aria-label": labels.totalRecords(totalRowCount ?? 0),
          children: [
            /* @__PURE__ */ jsx(IconDatabase, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "@md/data-table:hidden", children: totalRowCount ?? 0 }),
            /* @__PURE__ */ jsx("span", { className: "hidden @md/data-table:inline", children: labels.totalRecords(totalRowCount ?? 0) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center justify-end gap-4", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `hidden text-sm @md/data-table:inline ${uiClassNames.mutedText ?? "opacity-70"}`,
            children: labels.pageStatus(pageIndex, Math.max(1, pageCount))
          }
        ),
        /* @__PURE__ */ jsx(Pagination2, { className: "mx-0 w-auto justify-end", children: /* @__PURE__ */ jsxs(PaginationContent2, { children: [
          /* @__PURE__ */ jsx(PaginationItem2, { className: "@md/data-table:hidden", children: /* @__PURE__ */ jsxs(Tooltip2, { children: [
            /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsx(
              PaginationFirst2,
              {
                href: "#",
                size: "icon-sm",
                showText: false,
                disabled: !canGoPrevious,
                onClick: (event) => {
                  event.preventDefault();
                  if (canGoPrevious) {
                    onPageIndexChange(0);
                  }
                },
                children: "First"
              }
            ) }),
            /* @__PURE__ */ jsx(TooltipContent2, { children: labels.firstPage })
          ] }) }),
          /* @__PURE__ */ jsx(PaginationItem2, { children: /* @__PURE__ */ jsxs(Tooltip2, { children: [
            /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsx(
              PaginationPrevious2,
              {
                href: "#",
                size: "icon-sm",
                showText: false,
                disabled: !canGoPrevious,
                onClick: (event) => {
                  event.preventDefault();
                  if (canGoPrevious) {
                    onPageIndexChange(pageIndex - 1);
                  }
                },
                children: "Previous"
              }
            ) }),
            /* @__PURE__ */ jsx(TooltipContent2, { children: labels.previousPage })
          ] }) }),
          pages.map((item, index) => /* @__PURE__ */ jsx(
            PaginationItem2,
            {
              className: "hidden @md/data-table:block",
              children: item === "ellipsis" ? /* @__PURE__ */ jsx(PaginationEllipsis2, {}) : /* @__PURE__ */ jsx(
                PaginationLink2,
                {
                  href: "#",
                  isActive: item === pageIndex + 1,
                  size: "icon-sm",
                  onClick: (event) => {
                    event.preventDefault();
                    onPageIndexChange(item - 1);
                  },
                  children: item
                }
              )
            },
            `${item}-${index}`
          )),
          /* @__PURE__ */ jsx(PaginationItem2, { children: /* @__PURE__ */ jsxs(Tooltip2, { children: [
            /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsx(
              PaginationNext2,
              {
                href: "#",
                size: "icon-sm",
                showText: false,
                disabled: !canGoNext,
                onClick: (event) => {
                  event.preventDefault();
                  if (canGoNext) {
                    onPageIndexChange(pageIndex + 1);
                  }
                },
                children: "Next"
              }
            ) }),
            /* @__PURE__ */ jsx(TooltipContent2, { children: labels.nextPage })
          ] }) }),
          /* @__PURE__ */ jsx(PaginationItem2, { className: "@md/data-table:hidden", children: /* @__PURE__ */ jsxs(Tooltip2, { children: [
            /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsx(
              PaginationLast2,
              {
                href: "#",
                size: "icon-sm",
                showText: false,
                disabled: !canGoNext,
                onClick: (event) => {
                  event.preventDefault();
                  if (canGoNext) {
                    onPageIndexChange(lastPageIndex);
                  }
                },
                children: "Last"
              }
            ) }),
            /* @__PURE__ */ jsx(TooltipContent2, { children: labels.lastPage })
          ] }) })
        ] }) })
      ] })
    ] });
  }
  function DataTableFooter(props) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `rounded-md border px-2 py-1 ${uiClassNames.footer ?? ""}`,
        children: /* @__PURE__ */ jsx(DataTablePagination, { ...props })
      }
    );
  }
  return {
    DataTableFooter,
    DataTablePagination
  };
}
function getVisiblePages(currentPageIndex, pageCount) {
  const currentPage = currentPageIndex + 1;
  const pages = /* @__PURE__ */ new Set([1, pageCount]);
  for (let page = Math.max(1, currentPage - 2); page <= Math.min(pageCount, currentPage + 2); page += 1) {
    pages.add(page);
  }
  const orderedPages = Array.from(pages).sort((left, right) => left - right);
  const items = [];
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
function createDataTableRowActions(ui) {
  const {
    Button: Button2,
    DropdownMenu: DropdownMenu2,
    DropdownMenuContent: DropdownMenuContent2,
    DropdownMenuGroup: DropdownMenuGroup2,
    DropdownMenuItem: DropdownMenuItem2,
    DropdownMenuSeparator: DropdownMenuSeparator2,
    DropdownMenuTrigger: DropdownMenuTrigger2,
    Tooltip: Tooltip2,
    TooltipContent: TooltipContent2,
    TooltipTrigger: TooltipTrigger2
  } = ui;
  return function DataTableRowActions({
    row,
    rowActions,
    editableRows,
    isEditing,
    onStartEditing,
    onCancelEditing,
    labels
  }) {
    const actions = rowActions.filter((action) => canUseRowAction(action, row));
    const stopRowClickPropagation = React30.useCallback(
      (event) => {
        event.stopPropagation();
      },
      []
    );
    if (isEditing) {
      return /* @__PURE__ */ jsxs(Tooltip2, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
          Button2,
          {
            type: "button",
            variant: "ghost",
            size: "icon-sm",
            onPointerDown: stopRowClickPropagation,
            onClick: onCancelEditing,
            children: [
              /* @__PURE__ */ jsx(IconX, {}),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.cancelEdit })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(TooltipContent2, { children: labels.cancelEdit })
      ] });
    }
    const allowEdit = canEditRow(editableRows, row);
    if (!actions.length && !allowEdit) {
      return null;
    }
    return /* @__PURE__ */ jsxs(DropdownMenu2, { children: [
      /* @__PURE__ */ jsxs(Tooltip2, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsx(DropdownMenuTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
          Button2,
          {
            type: "button",
            variant: "ghost",
            size: "icon-sm",
            onPointerDown: stopRowClickPropagation,
            onClick: stopRowClickPropagation,
            children: [
              /* @__PURE__ */ jsx(IconDots, {}),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.rowActions })
            ]
          }
        ) }) }),
        /* @__PURE__ */ jsx(TooltipContent2, { children: labels.rowActions })
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenuContent2, { align: "end", className: "w-52", children: [
        allowEdit ? /* @__PURE__ */ jsx(DropdownMenuGroup2, { children: /* @__PURE__ */ jsxs(
          DropdownMenuItem2,
          {
            onClick: (event) => {
              event.stopPropagation();
              onStartEditing();
            },
            children: [
              /* @__PURE__ */ jsx(IconEdit, { "data-icon": "inline-start" }),
              labels.editRow
            ]
          }
        ) }) : null,
        allowEdit && actions.length ? /* @__PURE__ */ jsx(DropdownMenuSeparator2, {}) : null,
        actions.length ? /* @__PURE__ */ jsx(DropdownMenuGroup2, { children: actions.map((action) => {
          const Icon2 = action.icon;
          return /* @__PURE__ */ jsxs(
            DropdownMenuItem2,
            {
              disabled: action.disabled?.(row),
              variant: action.variant === "destructive" ? "destructive" : void 0,
              onClick: (event) => {
                event.stopPropagation();
                void action.onClick(row);
              },
              children: [
                Icon2 ? /* @__PURE__ */ jsx(Icon2, { "data-icon": "inline-start" }) : null,
                resolveRowActionLabel(action.label, row)
              ]
            },
            action.key
          );
        }) }) : null
      ] })
    ] });
  };
}
function createDataTableToolbar(ui) {
  const uiClassNames = ui.classNames ?? {};
  const {
    Button: Button2,
    ButtonGroup: ButtonGroup2,
    DropdownMenu: DropdownMenu2,
    DropdownMenuCheckboxItem: DropdownMenuCheckboxItem2,
    DropdownMenuContent: DropdownMenuContent2,
    DropdownMenuGroup: DropdownMenuGroup2,
    DropdownMenuItem: DropdownMenuItem2,
    DropdownMenuLabel: DropdownMenuLabel2,
    DropdownMenuSeparator: DropdownMenuSeparator2,
    DropdownMenuTrigger: DropdownMenuTrigger2,
    InputGroup: InputGroup2,
    InputGroupAddon: InputGroupAddon2,
    InputGroupInput: InputGroupInput3,
    Tooltip: Tooltip2,
    TooltipContent: TooltipContent2,
    TooltipTrigger: TooltipTrigger2
  } = ui;
  return function DataTableToolbar({
    title,
    description,
    toolbarQueryValue,
    toolbarQueryPlaceholder,
    onToolbarQueryValueChange,
    customToolbar,
    compactToolbar,
    viewMode,
    onViewModeChange,
    enableViewToggle,
    toolbarActions,
    selectionActions,
    selectedRows,
    showHiddenRows,
    hiddenRowsLabel,
    onShowHiddenRowsChange,
    allRows,
    columnVisibilityOptions,
    onColumnVisibilityChange,
    enableColumnPinning,
    onColumnPinningChange,
    columnFilters,
    onColumnFilterChange,
    onClearColumnFilters,
    density,
    onDensityChange,
    enableDensityToggle,
    labels,
    toolbarVisibility,
    openFileDialog
  }) {
    const compactSearchInputRef = React30.useRef(null);
    const [isCompactSearchVisible, setIsCompactSearchVisible] = React30.useState(false);
    const compactToolbarIconButtonClassName = uiClassNames.toolbarCompactIconButton ?? "";
    const primaryActions = toolbarActions.filter(
      (action) => (action.placement ?? "primary") === "primary"
    );
    const trailingActions = toolbarActions.filter(
      (action) => action.placement === "trailing"
    );
    const showTitle = toolbarVisibility?.title ?? true;
    const showSearch = toolbarVisibility?.search ?? true;
    const showActions = toolbarVisibility?.actions ?? true;
    const showTrailingActions = toolbarVisibility?.trailingActions ?? true;
    const showOptions = toolbarVisibility?.options ?? true;
    const showViewToggle = toolbarVisibility?.viewToggle ?? true;
    const showCustomToolbar = toolbarVisibility?.customToolbar ?? true;
    const hasVisibleTitle = showTitle && Boolean(title || description);
    const hasVisibleSearch = showSearch;
    const hasVisiblePrimaryActions = showActions && primaryActions.length > 0;
    const hasVisibleSelectionActions = selectedRows.length > 0 && selectionActions.length > 0;
    const hasVisibleOptions = showOptions && (columnVisibilityOptions.some((column) => column.canHide) || Boolean(onShowHiddenRowsChange && hiddenRowsLabel) || enableColumnPinning || enableDensityToggle);
    const hasVisibleViewToggle = showViewToggle && enableViewToggle && Boolean(onViewModeChange);
    const hasVisibleTrailingActions = showTrailingActions && trailingActions.length > 0;
    const hasVisibleCustomToolbar = showCustomToolbar && Boolean(customToolbar);
    const hasVisibleCompactToolbar = showCustomToolbar && Boolean(compactToolbar ?? customToolbar);
    const selectedRowCountLabel = labels.selectedRows(selectedRows.length);
    React30.useEffect(() => {
      if (!isCompactSearchVisible) {
        return;
      }
      compactSearchInputRef.current?.focus();
    }, [isCompactSearchVisible]);
    if (!hasVisibleTitle && !hasVisibleSearch && !hasVisiblePrimaryActions && !hasVisibleSelectionActions && !hasVisibleOptions && !hasVisibleViewToggle && !hasVisibleTrailingActions && !hasVisibleCustomToolbar && !hasVisibleCompactToolbar) {
      return null;
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 pb-0", children: [
      showTitle && (title || description) ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        title ? /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: title }) : null,
        description ? /* @__PURE__ */ jsx(
          "p",
          {
            className: `max-w-3xl text-sm ${uiClassNames.mutedText ?? "opacity-70"}`,
            children: description
          }
        ) : null
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-dtp-slot": "data-table-toolbar-controls",
            className: "flex items-center gap-2 overflow-x-auto px-1 @md/data-table:gap-3 @md/data-table:overflow-visible",
            children: [
              showSearch ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "hidden min-w-0 grow max-w-md @md/data-table:block", children: /* @__PURE__ */ jsxs(InputGroup2, { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx(
                    InputGroupInput3,
                    {
                      value: toolbarQueryValue,
                      onChange: (event) => {
                        onToolbarQueryValueChange(event.target.value);
                      },
                      placeholder: toolbarQueryPlaceholder
                    }
                  ),
                  /* @__PURE__ */ jsx(InputGroupAddon2, { align: "inline-start", "aria-hidden": "true", children: /* @__PURE__ */ jsx(IconSearch, {}) }),
                  toolbarQueryValue ? /* @__PURE__ */ jsx(InputGroupAddon2, { align: "inline-end", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: `inline-flex size-5 items-center justify-center rounded-md transition-colors focus-visible:outline-none ${uiClassNames.toolbarIconButton ?? "opacity-70 hover:opacity-100"}`,
                      onClick: () => {
                        onToolbarQueryValueChange("");
                      },
                      "aria-label": labels.clearSearch,
                      title: labels.clearSearch,
                      children: /* @__PURE__ */ jsx(IconX, {})
                    }
                  ) }) : null
                ] }) }),
                /* @__PURE__ */ jsxs(Tooltip2, { children: [
                  /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button2,
                    {
                      type: "button",
                      variant: isCompactSearchVisible || toolbarQueryValue ? "secondary" : "outline",
                      size: "icon-sm",
                      "aria-label": labels.searchTable,
                      "aria-pressed": isCompactSearchVisible,
                      className: `shrink-0 @md/data-table:hidden ${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`,
                      onClick: () => {
                        setIsCompactSearchVisible((current) => !current);
                      },
                      children: [
                        /* @__PURE__ */ jsx(IconSearch, {}),
                        /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.searchTable })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx(TooltipContent2, { children: labels.searchTable })
                ] })
              ] }) : null,
              showActions ? /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-2", children: primaryActions.map((action) => {
                const collapsesToIcon = !action.iconOnly && Boolean(action.icon);
                const button = /* @__PURE__ */ jsxs(
                  Button2,
                  {
                    type: "button",
                    className: collapsesToIcon ? `size-7 shrink-0 px-0 @md/data-table:h-8 @md/data-table:w-fit @md/data-table:px-2.5 ${compactToolbarIconButtonClassName}` : action.iconOnly ? `size-7 shrink-0 @md/data-table:size-8 ${compactToolbarIconButtonClassName}` : "size-7 shrink-0 @md/data-table:h-8 @md/data-table:w-fit",
                    variant: action.variant ?? "outline",
                    size: action.iconOnly ? "icon" : "default",
                    onClick: () => {
                      void action.onClick({
                        rows: allRows,
                        openFileDialog
                      });
                    },
                    disabled: action.disabled,
                    "aria-label": action.label,
                    title: action.iconOnly ? void 0 : action.label,
                    children: [
                      action.icon ? /* @__PURE__ */ jsx(action.icon, {}) : null,
                      action.iconOnly ? /* @__PURE__ */ jsx("span", { className: "sr-only", children: action.label }) : collapsesToIcon ? /* @__PURE__ */ jsx("span", { className: "hidden @md/data-table:inline", children: action.label }) : /* @__PURE__ */ jsx("span", { children: action.label })
                    ]
                  },
                  action.key
                );
                return action.iconOnly ? /* @__PURE__ */ jsxs(Tooltip2, { children: [
                  /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: button }),
                  /* @__PURE__ */ jsx(TooltipContent2, { children: action.label })
                ] }, action.key) : button;
              }) }) : null,
              hasVisibleCompactToolbar ? /* @__PURE__ */ jsx(
                "div",
                {
                  "data-dtp-slot": "data-table-toolbar-compact-custom",
                  className: "flex shrink-0 items-center gap-2 @lg/data-table:hidden",
                  children: compactToolbar ?? customToolbar
                }
              ) : null,
              /* @__PURE__ */ jsx("div", { className: "block grow @md/data-table:hidden" }),
              /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
                selectedRows.length ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `hidden text-sm @md/data-table:block ${uiClassNames.mutedText ?? "opacity-70"}`,
                    children: selectedRowCountLabel
                  }
                ) : null,
                selectedRows.length ? selectionActions.map((action) => {
                  const Icon2 = action.icon;
                  const disabled = typeof action.disabled === "function" ? action.disabled(selectedRows) : action.disabled;
                  return /* @__PURE__ */ jsxs(Tooltip2, { children: [
                    /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
                      Button2,
                      {
                        type: "button",
                        variant: action.variant ?? "secondary",
                        size: "icon-sm",
                        className: compactToolbarIconButtonClassName,
                        disabled,
                        onClick: () => {
                          void action.onClick({ rows: selectedRows });
                        },
                        "aria-label": action.label,
                        children: [
                          Icon2 ? /* @__PURE__ */ jsx(Icon2, {}) : null,
                          /* @__PURE__ */ jsx("span", { className: "sr-only", children: action.label })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsx(TooltipContent2, { children: action.label })
                  ] }, action.key);
                }) : null,
                hasVisibleOptions ? /* @__PURE__ */ jsxs(DropdownMenu2, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button2,
                    {
                      type: "button",
                      variant: "outline",
                      size: "icon-sm",
                      "aria-label": labels.tableOptions,
                      className: `${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`,
                      title: labels.tableOptions,
                      children: [
                        /* @__PURE__ */ jsx(IconAdjustmentsHorizontal, {}),
                        /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.tableOptions })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent2, { align: "end", className: "w-56", children: [
                    /* @__PURE__ */ jsx(DropdownMenuLabel2, { children: labels.tableOptions }),
                    /* @__PURE__ */ jsx(DropdownMenuGroup2, { children: onShowHiddenRowsChange && hiddenRowsLabel ? /* @__PURE__ */ jsx(
                      DropdownMenuCheckboxItem2,
                      {
                        checked: showHiddenRows,
                        onCheckedChange: (checked) => {
                          onShowHiddenRowsChange(checked === true);
                        },
                        children: labels.showHiddenRows(hiddenRowsLabel)
                      }
                    ) : null }),
                    enableDensityToggle ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(DropdownMenuSeparator2, {}),
                      /* @__PURE__ */ jsx(DropdownMenuLabel2, { children: labels.density }),
                      /* @__PURE__ */ jsx(DropdownMenuGroup2, { children: [
                        ["compact", labels.compactDensity],
                        ["comfortable", labels.comfortableDensity],
                        ["spacious", labels.spaciousDensity]
                      ].map(([nextDensity, label]) => /* @__PURE__ */ jsx(
                        DropdownMenuCheckboxItem2,
                        {
                          checked: density === nextDensity,
                          onCheckedChange: () => {
                            onDensityChange(nextDensity);
                          },
                          children: label
                        },
                        nextDensity
                      )) })
                    ] }) : null,
                    columnVisibilityOptions.some((column) => column.canHide) ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(DropdownMenuSeparator2, {}),
                      /* @__PURE__ */ jsx(DropdownMenuLabel2, { children: labels.columns }),
                      /* @__PURE__ */ jsx(DropdownMenuGroup2, { children: columnVisibilityOptions.filter((column) => column.canHide).map((column) => /* @__PURE__ */ jsx(
                        DropdownMenuCheckboxItem2,
                        {
                          checked: column.visible,
                          onCheckedChange: (checked) => {
                            onColumnVisibilityChange?.(
                              column.id,
                              checked === true
                            );
                          },
                          children: column.label
                        },
                        column.id
                      )) })
                    ] }) : null,
                    enableColumnPinning ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(DropdownMenuSeparator2, {}),
                      /* @__PURE__ */ jsxs(DropdownMenuLabel2, { children: [
                        labels.pinLeft,
                        " / ",
                        labels.pinRight
                      ] }),
                      /* @__PURE__ */ jsx(DropdownMenuGroup2, { children: columnVisibilityOptions.map((column) => /* @__PURE__ */ jsxs(
                        DropdownMenuItem2,
                        {
                          onSelect: (event) => {
                            event.preventDefault();
                          },
                          children: [
                            /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: column.label }),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                className: "px-1 text-xs",
                                "aria-label": `${labels.pinLeft}: ${column.label}`,
                                onClick: (event) => {
                                  event.stopPropagation();
                                  onColumnPinningChange(column.id, "left");
                                },
                                children: "L"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                className: "px-1 text-xs",
                                "aria-label": `${labels.pinRight}: ${column.label}`,
                                onClick: (event) => {
                                  event.stopPropagation();
                                  onColumnPinningChange(column.id, "right");
                                },
                                children: "R"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                className: "px-1 text-xs",
                                "aria-label": `${labels.unpin}: ${column.label}`,
                                onClick: (event) => {
                                  event.stopPropagation();
                                  onColumnPinningChange(column.id, false);
                                },
                                children: "-"
                              }
                            )
                          ]
                        },
                        `pin-${column.id}`
                      )) })
                    ] }) : null
                  ] })
                ] }) : null,
                showViewToggle && enableViewToggle && onViewModeChange ? /* @__PURE__ */ jsxs(ButtonGroup2, { children: [
                  /* @__PURE__ */ jsxs(Tooltip2, { children: [
                    /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
                      Button2,
                      {
                        type: "button",
                        variant: viewMode === "table" ? "default" : "outline",
                        "aria-pressed": viewMode === "table",
                        className: viewMode === "table" ? compactToolbarIconButtonClassName : `${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`,
                        size: "icon-sm",
                        onClick: () => {
                          onViewModeChange("table");
                        },
                        children: [
                          /* @__PURE__ */ jsx(IconList, {}),
                          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Switch to table view" })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsx(TooltipContent2, { children: "Table view" })
                  ] }),
                  /* @__PURE__ */ jsxs(Tooltip2, { children: [
                    /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ jsxs(
                      Button2,
                      {
                        type: "button",
                        variant: viewMode === "card" ? "default" : "outline",
                        "aria-pressed": viewMode === "card",
                        className: viewMode === "table" ? `${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}` : compactToolbarIconButtonClassName,
                        size: "icon-sm",
                        onClick: () => {
                          onViewModeChange("card");
                        },
                        children: [
                          /* @__PURE__ */ jsx(IconLayoutGrid, {}),
                          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Switch to card view" })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsx(TooltipContent2, { children: "Card view" })
                  ] })
                ] }) : null,
                showTrailingActions ? trailingActions.map((action) => {
                  const collapsesToIcon = !action.iconOnly && Boolean(action.icon);
                  const button = /* @__PURE__ */ jsxs(
                    Button2,
                    {
                      type: "button",
                      variant: action.variant ?? "outline",
                      size: action.iconOnly ? "icon-sm" : "default",
                      onClick: () => {
                        void action.onClick({
                          rows: allRows,
                          openFileDialog
                        });
                      },
                      disabled: action.disabled,
                      "aria-label": action.label,
                      title: action.iconOnly ? void 0 : action.label,
                      className: `size-7 shrink-0 ${action.iconOnly ? "" : `${collapsesToIcon ? "px-0 @md/data-table:px-2.5" : ""} @md/data-table:h-8 @md/data-table:w-fit`} ${action.iconOnly || collapsesToIcon ? compactToolbarIconButtonClassName : ""} ${uiClassNames.toolbarInputButton ?? ""}`,
                      children: [
                        action.icon ? /* @__PURE__ */ jsx(
                          action.icon,
                          {
                            "data-icon": action.iconOnly ? void 0 : "inline-start"
                          }
                        ) : null,
                        action.iconOnly ? /* @__PURE__ */ jsx("span", { className: "sr-only", children: action.label }) : collapsesToIcon ? /* @__PURE__ */ jsx("span", { className: "hidden @md/data-table:inline", children: action.label }) : /* @__PURE__ */ jsx("span", { children: action.label })
                      ]
                    },
                    action.key
                  );
                  return action.iconOnly ? /* @__PURE__ */ jsxs(Tooltip2, { children: [
                    /* @__PURE__ */ jsx(TooltipTrigger2, { asChild: true, children: button }),
                    /* @__PURE__ */ jsx(TooltipContent2, { children: action.label })
                  ] }, action.key) : button;
                }) : null
              ] })
            ]
          }
        ),
        showSearch && isCompactSearchVisible ? /* @__PURE__ */ jsx(
          "div",
          {
            "data-dtp-slot": "data-table-toolbar-compact-search",
            className: "min-w-0 @md/data-table:hidden",
            children: /* @__PURE__ */ jsxs(InputGroup2, { children: [
              /* @__PURE__ */ jsx(
                InputGroupInput3,
                {
                  ref: compactSearchInputRef,
                  value: toolbarQueryValue,
                  onChange: (event) => {
                    onToolbarQueryValueChange(event.target.value);
                  },
                  placeholder: toolbarQueryPlaceholder
                }
              ),
              /* @__PURE__ */ jsx(InputGroupAddon2, { align: "inline-start", "aria-hidden": "true", children: /* @__PURE__ */ jsx(IconSearch, {}) }),
              toolbarQueryValue ? /* @__PURE__ */ jsx(InputGroupAddon2, { align: "inline-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `inline-flex size-5 items-center justify-center rounded-md transition-colors focus-visible:outline-none ${uiClassNames.toolbarIconButton ?? "opacity-70 hover:opacity-100"}`,
                  onClick: () => {
                    onToolbarQueryValueChange("");
                  },
                  "aria-label": labels.clearSearch,
                  title: labels.clearSearch,
                  children: /* @__PURE__ */ jsx(IconX, {})
                }
              ) }) : null
            ] })
          }
        ) : null,
        columnFilters.length ? /* @__PURE__ */ jsxs(
          "div",
          {
            "data-dtp-slot": "data-table-toolbar-filters",
            className: "flex min-w-0 flex-wrap items-center gap-2",
            children: [
              columnFilters.map((filter) => /* @__PURE__ */ jsx(
                ToolbarColumnFilterControl,
                {
                  filter,
                  labels,
                  onColumnFilterChange
                },
                filter.id
              )),
              columnFilters.some(
                (filter) => hasColumnFilterValue(filter.value)
              ) ? /* @__PURE__ */ jsx(
                Button2,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: onClearColumnFilters,
                  children: labels.clearFilters
                }
              ) : null
            ]
          }
        ) : null
      ] }),
      showCustomToolbar && customToolbar ? /* @__PURE__ */ jsx(
        "div",
        {
          "data-dtp-slot": "data-table-toolbar-desktop-custom",
          className: "hidden flex-row items-center gap-3 @lg/data-table:flex",
          children: customToolbar
        }
      ) : null
    ] });
  };
  function ToolbarColumnFilterControl({
    filter,
    labels,
    onColumnFilterChange
  }) {
    if (filter.type === "text") {
      return /* @__PURE__ */ jsxs(InputGroup2, { className: "min-w-48 max-w-64", children: [
        /* @__PURE__ */ jsx(
          InputGroupInput3,
          {
            value: typeof filter.value === "string" ? filter.value : "",
            onChange: (event) => {
              onColumnFilterChange(filter.id, event.target.value);
            },
            placeholder: filter.placeholder ?? filter.label,
            "aria-label": `${labels.filters}: ${filter.label}`
          }
        ),
        /* @__PURE__ */ jsx(InputGroupAddon2, { align: "inline-start", "aria-hidden": "true", children: /* @__PURE__ */ jsx(IconSearch, {}) })
      ] });
    }
    const selectedValues = Array.isArray(filter.value) ? filter.value.map(String) : typeof filter.value === "string" && filter.value ? [filter.value] : [];
    const selectedLabel = selectedValues.length === 0 ? filter.label : `${filter.label}: ${selectedValues.length === 1 ? filter.options.find(
      (option) => option.value === selectedValues[0]
    )?.label ?? selectedValues[0] : selectedValues.length}`;
    return /* @__PURE__ */ jsxs(DropdownMenu2, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger2, { asChild: true, children: /* @__PURE__ */ jsx(Button2, { type: "button", variant: "outline", size: "sm", children: selectedLabel }) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent2, { align: "start", className: "w-56", children: [
        /* @__PURE__ */ jsx(DropdownMenuLabel2, { children: filter.label }),
        /* @__PURE__ */ jsxs(DropdownMenuGroup2, { children: [
          filter.type === "select" ? /* @__PURE__ */ jsx(
            DropdownMenuItem2,
            {
              onClick: () => {
                onColumnFilterChange(filter.id, "");
              },
              children: "All"
            }
          ) : null,
          filter.options.map((option) => /* @__PURE__ */ jsx(
            DropdownMenuCheckboxItem2,
            {
              checked: selectedValues.includes(option.value),
              onCheckedChange: (checked) => {
                if (filter.type === "select") {
                  onColumnFilterChange(
                    filter.id,
                    checked === true ? option.value : ""
                  );
                  return;
                }
                const nextValues = new Set(selectedValues);
                if (checked === true) {
                  nextValues.add(option.value);
                } else {
                  nextValues.delete(option.value);
                }
                onColumnFilterChange(filter.id, Array.from(nextValues));
              },
              children: option.label
            },
            option.value
          ))
        ] })
      ] })
    ] });
  }
}
function hasColumnFilterValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== void 0 && value !== null && value !== "";
}

// src/core/data-table/data-table-labels.ts
var DATA_TABLE_DEFAULT_LABELS = {
  searchPlaceholder: "Search rows...",
  searchTable: "Search table",
  clearSearch: "Clear search",
  noRowsTitle: "No rows yet",
  noRowsDescription: "Create a record or refresh this view once data exists.",
  noMatchingRowsTitle: "No matching rows",
  noMatchingRowsDescription: "Try a different search term or clear filters.",
  tableOptions: "Show table options",
  columns: "Columns",
  filters: "Filters",
  clearFilters: "Clear filters",
  selectedRows: (count) => `${count} record${count === 1 ? "" : "s"} selected`,
  showHiddenRows: (label) => `Show ${label}`,
  recordsPerPage: "Records per page",
  totalRecords: (count) => `Total records: ${count}`,
  pageStatus: (pageIndex, pageCount) => `Page ${pageIndex + 1} of ${pageCount}`,
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  actions: "Actions",
  rowActions: "Row actions",
  editRow: "Edit row",
  saveEdit: "Save",
  cancelEdit: "Cancel editing",
  expandRow: "Expand row",
  collapseRow: "Collapse row",
  exportCsv: "Export CSV",
  density: "Density",
  compactDensity: "Compact",
  comfortableDensity: "Comfortable",
  spaciousDensity: "Spacious",
  pinLeft: "Pin left",
  pinRight: "Pin right",
  unpin: "Unpin"
};
function resolveDataTableLabels(labels) {
  return {
    ...DATA_TABLE_DEFAULT_LABELS,
    ...labels
  };
}
function useDataTableToolbarFeatures({
  columns,
  currentColumnFilters,
  currentColumnPinning,
  effectiveColumnVisibility,
  enableColumnFilters,
  handleColumnFiltersChange,
  handleColumnPinningChange,
  labels,
  table,
  toolbarActions,
  visibleData,
  csvExport
}) {
  const columnVisibilityOptions = React30.useMemo(() => {
    return columns.map((column, index) => {
      const id = getColumnId(column, index);
      const header = column.header;
      const accessorKey = getAccessorKey(column);
      const label = typeof header === "string" ? header : accessorKey ? startCase(accessorKey) : startCase(id);
      const pinned = currentColumnPinning.left?.includes(id) === true ? "left" : currentColumnPinning.right?.includes(id) === true ? "right" : false;
      return {
        id,
        label,
        visible: effectiveColumnVisibility[id] !== false,
        canHide: column.enableHiding !== false,
        pinned
      };
    });
  }, [columns, currentColumnPinning, effectiveColumnVisibility]);
  const toolbarColumnFilters = React30.useMemo(() => {
    if (enableColumnFilters === false) {
      return [];
    }
    return columns.flatMap((column, index) => {
      const filter = column.meta?.filter;
      if (!filter) {
        return [];
      }
      const id = getColumnId(column, index);
      const header = column.header;
      const accessorKey = getAccessorKey(column);
      const label = filter.label ?? (typeof header === "string" ? header : accessorKey ? startCase(accessorKey) : startCase(id));
      const state = currentColumnFilters.find((item) => item.id === id);
      const rawOptions = typeof filter.options === "function" ? filter.options({ rows: visibleData }) : filter.options ?? [];
      return [
        {
          id,
          label,
          type: filter.type,
          value: state?.value,
          placeholder: filter.placeholder,
          options: normalizeColumnFilterOptions(rawOptions)
        }
      ];
    });
  }, [columns, currentColumnFilters, enableColumnFilters, visibleData]);
  const handleToolbarColumnFilterChange = React30.useCallback(
    (columnId, value) => {
      handleColumnFiltersChange((current) => {
        const next = current.filter((filter) => filter.id !== columnId);
        if (hasFilterValue(value)) {
          next.push({ id: columnId, value });
        }
        return next;
      });
    },
    [handleColumnFiltersChange]
  );
  const handleClearColumnFilters = React30.useCallback(() => {
    handleColumnFiltersChange([]);
  }, [handleColumnFiltersChange]);
  const handleToolbarColumnPinningChange = React30.useCallback(
    (columnId, side) => {
      handleColumnPinningChange((current) => {
        const left = (current.left ?? []).filter((id) => id !== columnId);
        const right = (current.right ?? []).filter((id) => id !== columnId);
        if (side === "left") {
          left.push(columnId);
        }
        if (side === "right") {
          right.push(columnId);
        }
        return { left, right };
      });
    },
    [handleColumnPinningChange]
  );
  const handleCsvExport = React30.useCallback(() => {
    if (!csvExport) {
      return;
    }
    void exportDataTableCsv({
      csvExport,
      table});
  }, [csvExport, labels, table]);
  const effectiveToolbarActions = React30.useMemo(() => {
    if (!csvExport) {
      return toolbarActions ?? [];
    }
    return [
      ...toolbarActions ?? [],
      {
        key: "__csv_export__",
        label: labels.exportCsv,
        icon: IconDownload,
        placement: "trailing",
        onClick: handleCsvExport
      }
    ];
  }, [csvExport, handleCsvExport, labels.exportCsv, toolbarActions]);
  return {
    columnVisibilityOptions,
    effectiveToolbarActions,
    handleClearColumnFilters,
    handleToolbarColumnFilterChange,
    handleToolbarColumnPinningChange,
    toolbarColumnFilters
  };
}
function createDataTable(ui) {
  const uiClassNames = ui.classNames ?? {};
  const {
    rootClassName,
    Button: Button2,
    Checkbox: Checkbox2,
    Input: Input3,
    ScrollArea: ScrollArea2,
    ScrollBar: ScrollBar2,
    Skeleton: Skeleton2,
    Table: Table2,
    TableBody: TableBody2,
    TableCell: TableCell2,
    TableFooter: TableFooter2 = "tfoot",
    TableHead: TableHead2,
    TableHeader: TableHeader2,
    TableRow: TableRow2,
    Tooltip: Tooltip2,
    TooltipContent: TooltipContent2,
    TooltipProvider: TooltipProvider2 = React30.Fragment,
    TooltipTrigger: TooltipTrigger2
  } = ui;
  const DataTableEmptyState = createDataTableEmptyState(ui);
  const DataTableRowActions = createDataTableRowActions(ui);
  const { DataTableFooter } = createDataTablePagination(ui);
  const DataTableToolbar = createDataTableToolbar(ui);
  const DataTableCardView = createDataTableCardView(ui, DataTableRowActions);
  const defaultColumn = {
    minSize: 80,
    size: 180,
    maxSize: 720
  };
  return function DataTable({
    columns,
    data,
    getRowId,
    children,
    title,
    description,
    toolbarQueryValue,
    onToolbarQueryValueChange,
    toolbarQueryPlaceholder,
    toolbarQueryDebounceMs,
    manualFiltering = false,
    enableToolbarQueryFiltering = true,
    globalFilterFn,
    columnFilters,
    onColumnFiltersChange,
    enableColumnFilters,
    customToolbar,
    compactToolbar,
    rowsPerPageOptions = [10, 20, 50, 100],
    totalRowCount,
    sorting,
    onSortingChange,
    manualSorting = false,
    pageIndex,
    pageSize,
    onPageIndexChange,
    onPageSizeChange,
    pageCount,
    manualPagination = false,
    rowSelection,
    onRowSelectionChange,
    enableRowSelection = false,
    expanded,
    onExpandedChange,
    getRowCanExpand,
    renderExpandedRow,
    columnOrder,
    onColumnOrderChange,
    enableColumnReordering = false,
    columnPinning,
    onColumnPinningChange,
    enableColumnPinning = false,
    toolbarActions = [],
    selectionActions = [],
    rowActions = [],
    csvExport,
    density,
    onDensityChange,
    enableDensityToggle = false,
    columnPrefsKey,
    labels,
    summaryRows = [],
    cardRenderer,
    cardGridClassName,
    cardClassName,
    viewMode,
    onViewModeChange,
    enableViewToggle = false,
    emptyState,
    isLoading = false,
    loadingRowCount,
    getRowLoadingState,
    hiddenRows,
    showHiddenRows,
    onShowHiddenRowsChange,
    infiniteScroll,
    editableRows,
    columnVisibility,
    onColumnVisibilityChange,
    enableColumnResizing = false,
    columnResizeMode = "onChange",
    layoutMode = "fill",
    stickyHeader = true,
    showFooter = true,
    showToolbar = true,
    dir = "ltr",
    flexGrow = true,
    toolbarVisibility,
    className,
    tableClassName,
    tableContainerClassName,
    getRowClassName,
    onRowClick,
    dragAndDrop,
    fileUpload,
    virtualization
  }) {
    const containerRef = React30.useRef(null);
    const fileInputRef = React30.useRef(null);
    const tableScrollContainerRef = React30.useRef(null);
    const draggedColumnIdRef = React30.useRef(null);
    const tableRef = React30.useRef(null);
    const lastSelectedRowIdRef = React30.useRef(null);
    const resolvedLabels = React30.useMemo(
      () => resolveDataTableLabels(labels),
      [labels]
    );
    const {
      currentColumnFilters,
      currentColumnOrder,
      currentColumnPinning,
      currentColumnSizing,
      currentDensity,
      currentExpanded,
      currentPagination,
      currentRowSelection,
      currentShowHiddenRows,
      currentSorting,
      currentViewMode,
      effectiveColumnVisibility,
      globalFilterValue,
      handleDensityChange,
      handleShowHiddenRowsChange,
      handleViewModeChange,
      localSearchValue,
      resolvedLoadingRowCount,
      resolvedToolbarQueryPlaceholder,
      selectedRows,
      setCurrentColumnFilters,
      setCurrentColumnOrder,
      setCurrentColumnPinning,
      setCurrentColumnVisibility,
      setCurrentExpanded,
      setCurrentRowSelection,
      setCurrentSorting,
      setLocalColumnSizing,
      setLocalPagination,
      setLocalSearchValue,
      shouldRenderInitialLoading,
      tableData,
      tableGetRowId,
      toolbarFilteredData,
      visibleData
    } = useDataTableState({
      columnFilters,
      columnOrder,
      columnPinning,
      columnPrefsKey,
      columnVisibility,
      columns,
      containerRef,
      data,
      density,
      enableRowSelection,
      enableToolbarQueryFiltering,
      expanded,
      getRowId,
      hiddenRows,
      isLoading,
      loadingRowCount,
      manualFiltering,
      onColumnFiltersChange,
      onColumnOrderChange,
      onColumnPinningChange,
      onColumnVisibilityChange,
      onDensityChange,
      onExpandedChange,
      onPageIndexChange,
      onRowSelectionChange,
      onShowHiddenRowsChange,
      onSortingChange,
      onToolbarQueryValueChange,
      onViewModeChange,
      pageIndex,
      pageSize,
      resolvedLabels,
      rowSelection,
      rowsPerPageOptions,
      selectionActions,
      showHiddenRows,
      sorting,
      toolbarQueryDebounceMs,
      toolbarQueryPlaceholder,
      toolbarQueryValue,
      viewMode
    });
    const {
      cancelEditing,
      draftValues,
      editingRowId,
      isSavingEdit,
      saveEdit,
      setDraftValues,
      setEditingRowId,
      startEditingRow
    } = useRowEditing({
      columns,
      editableRows
    });
    const { viewportElement: tableScrollElement, viewportHeight } = useDataTableScrollViewport(tableScrollContainerRef, currentViewMode);
    const openFileDialog = React30.useCallback(() => {
      if (fileUpload?.disabled) {
        return;
      }
      fileInputRef.current?.click();
    }, [fileUpload?.disabled]);
    const handleSelectedFiles = React30.useCallback(
      async (files) => {
        await fileUpload?.onFilesSelected(files);
      },
      [fileUpload]
    );
    const tableColumns = useDataTableColumns({
      Button: Button2,
      Checkbox: Checkbox2,
      DataTableRowActions,
      Tooltip: Tooltip2,
      TooltipContent: TooltipContent2,
      TooltipTrigger: TooltipTrigger2,
      cancelEditing,
      columns,
      editableRows,
      editingRowId,
      enableRowSelection,
      getRowCanExpand,
      isSavingEdit,
      labels: resolvedLabels,
      lastSelectedRowIdRef,
      renderExpandedRow,
      rowActions,
      saveEdit,
      startEditingRow,
      tableRef
    });
    const {
      effectivePageCount,
      footerTotalRowCount,
      handleFooterPageIndexChange,
      handleFooterPageSizeChange,
      renderedRows,
      reorderColumn,
      rowsToRender,
      sentinelRef,
      table,
      virtualPaddingBottom,
      virtualPaddingTop,
      visibleLeafColumns
    } = useDataTableInstance({
      autoResetPageIndex: false,
      columnResizeMode,
      currentColumnFilters,
      currentColumnOrder,
      currentColumnPinning,
      currentColumnSizing,
      currentExpanded,
      currentPagination,
      currentRowSelection,
      currentSorting,
      currentViewMode,
      defaultColumn,
      effectiveColumnVisibility,
      enableColumnResizing,
      enableRowSelection,
      getRowCanExpand,
      globalFilterFn,
      globalFilterValue,
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnOrderChange: setCurrentColumnOrder,
      handleColumnPinningChange: setCurrentColumnPinning,
      handleColumnVisibilityChange: setCurrentColumnVisibility,
      handleExpandedChange: setCurrentExpanded,
      infiniteScroll,
      manualFiltering,
      manualPagination,
      manualSorting,
      onPageIndexChange,
      onPageSizeChange,
      pageCount,
      pageIndex,
      pageSize,
      renderExpandedRow,
      setCurrentRowSelection,
      setCurrentSorting,
      setLocalColumnSizing,
      setLocalPagination,
      shouldRenderInitialLoading,
      tableColumns,
      tableData,
      tableGetRowId,
      tableRef,
      tableScrollElement,
      toolbarFilteredData,
      totalRowCount,
      virtualization,
      viewportHeight
    });
    const columnSizing = currentColumnSizing;
    const columnLayout = useColumnLayout({
      columns,
      columnSizing,
      editableRows: Boolean(editableRows),
      enableRowSelection,
      hasRowActions: rowActions.length > 0,
      hasRowExpansion: Boolean(renderExpandedRow),
      layoutMode,
      uiClassNames,
      visibleLeafColumns
    });
    const { explicitlySizedColumnIds, fillMinWidth, getColumnLayout } = columnLayout;
    const explicitCustomCellColumnIds = React30.useMemo(() => {
      return new Set(
        columns.flatMap((column, index) => {
          return Object.prototype.hasOwnProperty.call(column, "cell") && typeof column.cell === "function" ? [getColumnId(column, index)] : [];
        })
      );
    }, [columns]);
    const visibleLeafColumnCount = visibleLeafColumns.length;
    const bodyRowComponents = React30.useMemo(
      () => ({
        Checkbox: Checkbox2,
        Input: Input3,
        Skeleton: Skeleton2,
        TableCell: TableCell2,
        TableRow: TableRow2
      }),
      []
    );
    const hasCardTitle = React30.useMemo(
      () => columns.some((column) => column.meta?.cardTitle),
      [columns]
    );
    const primeColumnForResize = React30.useCallback(
      (columnId, currentSize) => {
        if (explicitlySizedColumnIds.has(columnId) || Object.prototype.hasOwnProperty.call(
          table.getState().columnSizing,
          columnId
        )) {
          return;
        }
        flushSync(() => {
          table.setColumnSizing((current) => ({
            ...current,
            [columnId]: currentSize
          }));
        });
      },
      [explicitlySizedColumnIds, table]
    );
    const resetColumnSize = React30.useCallback(
      (columnId) => {
        if (explicitlySizedColumnIds.has(columnId)) {
          table.getColumn(columnId)?.resetSize();
          return;
        }
        table.setColumnSizing((current) => {
          if (!Object.prototype.hasOwnProperty.call(current, columnId)) {
            return current;
          }
          const next = { ...current };
          delete next[columnId];
          return next;
        });
      },
      [explicitlySizedColumnIds, table]
    );
    const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);
    const emptyNode = typeof emptyState === "function" ? emptyState({
      rows: filteredData,
      toolbarQueryValue: localSearchValue
    }) : emptyState;
    const {
      columnVisibilityOptions,
      effectiveToolbarActions,
      handleClearColumnFilters,
      handleToolbarColumnFilterChange,
      handleToolbarColumnPinningChange,
      toolbarColumnFilters
    } = useDataTableToolbarFeatures({
      columns,
      currentColumnFilters,
      currentColumnPinning,
      csvExport,
      effectiveColumnVisibility,
      enableColumnFilters,
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnPinningChange: setCurrentColumnPinning,
      labels: resolvedLabels,
      table,
      toolbarActions,
      visibleData
    });
    return /* @__PURE__ */ jsx(TooltipProvider2, { children: /* @__PURE__ */ jsxs(
      "div",
      {
        ref: containerRef,
        "data-dtp-slot": "data-table-root",
        "data-density": currentDensity,
        dir,
        className: cn(
          "@container/data-table data-table-container-query flex flex-col",
          flexGrow ? "h-full min-h-0 flex-1" : "grow",
          rootClassName
        ),
        onDragEnter: dragAndDrop?.onDragEnter,
        onDragOver: dragAndDrop?.onDragOver,
        onDragLeave: dragAndDrop?.onDragLeave,
        onDrop: dragAndDrop?.onDrop,
        children: [
          fileUpload ? /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              className: "hidden",
              type: "file",
              accept: fileUpload.accept,
              multiple: fileUpload.multiple ?? true,
              disabled: fileUpload.disabled,
              onChange: (event) => {
                const files = event.currentTarget.files;
                if (files?.length) {
                  void handleSelectedFiles(files);
                }
                event.currentTarget.value = "";
              }
            }
          ) : null,
          /* @__PURE__ */ jsx(
            "div",
            {
              "data-dtp-slot": "data-table-layout",
              className: cn(
                "flex w-full flex-col",
                flexGrow ? "min-h-0 flex-1" : "grow"
              ),
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-dtp-slot": "data-table-main",
                  className: cn(
                    "flex w-full flex-col gap-4",
                    flexGrow ? "min-h-0 flex-1" : "grow",
                    className
                  ),
                  children: [
                    showToolbar ? /* @__PURE__ */ jsx(
                      DataTableToolbarSection,
                      {
                        allRows: filteredData,
                        columnFilters: toolbarColumnFilters,
                        columnVisibilityOptions,
                        compactToolbar,
                        customToolbar,
                        DataTableToolbar,
                        density: currentDensity,
                        description,
                        effectiveToolbarActions,
                        enableColumnPinning,
                        enableDensityToggle,
                        enableViewToggle: enableViewToggle && Boolean(cardRenderer),
                        hiddenRowsLabel: hiddenRows?.label,
                        labels: resolvedLabels,
                        onClearColumnFilters: handleClearColumnFilters,
                        onColumnFilterChange: handleToolbarColumnFilterChange,
                        onColumnPinningChange: handleToolbarColumnPinningChange,
                        onDensityChange: handleDensityChange,
                        onShowHiddenRowsChange: handleShowHiddenRowsChange,
                        onToolbarQueryValueChange: setLocalSearchValue,
                        onViewModeChange: handleViewModeChange,
                        openFileDialog: fileUpload ? openFileDialog : void 0,
                        selectedRows,
                        selectionActions,
                        showHiddenRows: currentShowHiddenRows,
                        table,
                        title,
                        toolbarQueryPlaceholder: resolvedToolbarQueryPlaceholder,
                        toolbarQueryValue: localSearchValue,
                        toolbarVisibility,
                        viewMode: currentViewMode
                      }
                    ) : null,
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        "data-dtp-slot": "data-table-content",
                        className: cn(flexGrow ? "flex min-h-0 flex-1 flex-col" : ""),
                        children: currentViewMode === "card" && cardRenderer ? /* @__PURE__ */ jsx(
                          DataTableCardPanel,
                          {
                            cardClassName,
                            cardGridClassName,
                            cardRenderer,
                            currentRowSelection,
                            DataTableCardView,
                            DataTableEmptyState,
                            dragAndDrop,
                            editableRows,
                            editingRowId,
                            emptyNode,
                            enableRowSelection,
                            flexGrow,
                            getRowClassName,
                            hasCardTitle,
                            infiniteScroll,
                            localSearchValue,
                            onRowClick,
                            renderedRows,
                            renderExpandedRow,
                            resolvedLabels,
                            resolvedLoadingRowCount,
                            rowActions,
                            ScrollArea: ScrollArea2,
                            sentinelRef,
                            setCurrentRowSelection,
                            setEditingRowId,
                            shouldRenderInitialLoading,
                            tableContainerClassName,
                            uiClassNames,
                            virtualization
                          }
                        ) : /* @__PURE__ */ jsx(
                          DataTableTablePanel,
                          {
                            bodyRowComponents,
                            columnLayouts: columnLayout.columnLayouts,
                            currentDensity,
                            currentSorting,
                            DataTableEmptyState,
                            dragAndDrop,
                            draggedColumnIdRef,
                            draftValues,
                            editingRowId,
                            emptyNode,
                            enableColumnReordering,
                            enableColumnResizing,
                            explicitCustomCellColumnIds,
                            fillMinWidth,
                            flexGrow,
                            getColumnLayout,
                            getRowClassName,
                            getRowLoadingState,
                            infiniteScroll,
                            layoutMode,
                            localSearchValue,
                            onRowClick,
                            primeColumnForResize,
                            renderedRows,
                            renderExpandedRow,
                            reorderColumn,
                            resetColumnSize,
                            resolvedLabels,
                            rowsToRender,
                            ScrollArea: ScrollArea2,
                            ScrollBar: ScrollBar2,
                            sentinelRef,
                            setDraftValues,
                            shouldRenderInitialLoading,
                            stickyHeader,
                            summaryRows,
                            table,
                            tableClassName,
                            tableContainerClassName,
                            Table: Table2,
                            TableBody: TableBody2,
                            TableCell: TableCell2,
                            TableFooter: TableFooter2,
                            TableHead: TableHead2,
                            TableHeader: TableHeader2,
                            TableRow: TableRow2,
                            tableScrollContainerRef,
                            uiClassNames,
                            virtualPaddingBottom,
                            virtualPaddingTop,
                            visibleLeafColumnCount,
                            visibleLeafColumns
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      DataTableFooterSection,
                      {
                        currentPagination,
                        DataTableFooter,
                        effectivePageCount,
                        footerTotalRowCount,
                        handleFooterPageIndexChange,
                        handleFooterPageSizeChange,
                        labels: resolvedLabels,
                        rowsPerPageOptions,
                        showFooter: showFooter && !infiniteScroll?.enabled,
                        children
                      }
                    )
                  ]
                }
              )
            }
          )
        ]
      }
    ) });
  };
}

export { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, Checkbox, DataTableBodyRow, DataTableCardPanel, DataTableFooterSection, DataTableHeaderCell, DataTableTablePanel, DataTableToolbarSection, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Input, InputGroup, InputGroupAddon, InputGroupInput, Pagination, PaginationFirst, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious, ScrollArea, ScrollBar, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, Separator, Skeleton, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TooltipContent, cn, createDataTable, primitiveUiKit, useColumnLayout, useControllableState, useDataTableColumns, useDataTableInstance, useDataTableState, useRowEditing };
//# sourceMappingURL=chunk-2NZEMRL6.js.map
//# sourceMappingURL=chunk-2NZEMRL6.js.map