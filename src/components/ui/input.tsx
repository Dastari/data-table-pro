import * as React from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { Button } from "./button";
import { cn } from "../../lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  passwordToggle?: boolean;
};

const inputClassName =
  "h-8 w-full min-w-0 rounded-lg border border-border bg-input px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, passwordToggle = false, type, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = React.useState(false);
  const canTogglePassword = passwordToggle && type === "password";

  if (!canTogglePassword) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputClassName, className)}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className={cn(inputClassName, "pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
        className="absolute inset-y-0 right-0 h-full px-2 text-muted-foreground hover:bg-transparent"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setShowPassword((current) => !current)}
      >
        {showPassword ? (
          <IconEyeOff data-icon="inline-start" />
        ) : (
          <IconEye data-icon="inline-start" />
        )}
      </Button>
    </div>
  );
});

Input.displayName = "Input";

export { Input };
