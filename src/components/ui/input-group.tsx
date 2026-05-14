import * as React from "react";

import { cn } from "../../lib/utils";
import { inputClassName } from "./input-base";

type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";

function InputGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="input-group"
      className={cn(
        "group/input-group flex w-full min-w-0 items-stretch rounded-lg border transition-colors outline-none focus-within:outline-none has-[>[data-slot=input-group-addon][data-align=block-start]]:flex-col has-[>[data-slot=input-group-addon][data-align=block-end]]:flex-col has-[>[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[>[data-slot=input-group-control]:disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function InputGroupInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      data-slot="input-group-control"
      type={props.type}
      className={cn(
        inputClassName,
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
});

type InputGroupAddonProps = React.ComponentProps<"div"> & {
  align?: InputGroupAddonAlign;
};

function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex shrink-0 items-center gap-1.5 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        align === "inline-start" && "order-first pl-2.5 pr-1",
        align === "inline-end" && "order-last pl-1 pr-2.5",
        align === "block-start" &&
          "order-first w-full justify-between border-b px-2.5 py-1.5 text-sm",
        align === "block-end" &&
          "order-last w-full justify-between border-t px-2.5 py-1.5 text-sm",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("whitespace-nowrap text-sm", className)}
      {...props}
    />
  );
}

InputGroupInput.displayName = "InputGroupInput";

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText };
