import * as React from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { Button } from "./button";
import { inputClassName } from "./input-base";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { cn } from "../../lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  passwordToggle?: boolean;
};

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
    <InputGroup className={className}>
      <InputGroupInput
        ref={ref}
        type={showPassword ? "text" : "password"}
        data-slot="input-group-control"
        className="pr-0"
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="text-muted-foreground hover:bg-transparent"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setShowPassword((current) => !current)}
        >
          {showPassword ? (
            <IconEyeOff data-icon="inline-start" />
          ) : (
            <IconEye data-icon="inline-start" />
          )}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
});

Input.displayName = "Input";

export { Input };
