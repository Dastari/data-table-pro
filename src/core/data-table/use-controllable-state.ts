import * as React from "react";
import type { Updater } from "@tanstack/react-table";

export function useControllableState<T>({
  defaultValue,
  onChange,
  value,
}: {
  defaultValue: T | (() => T);
  onChange?: (value: T) => void;
  value: T | undefined;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;
  const currentValueRef = React.useRef(currentValue);

  React.useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const setValue = React.useCallback(
    (updater: Updater<T>) => {
      const nextValue =
        typeof updater === "function"
          ? (updater as (current: T) => T)(currentValueRef.current)
          : updater;
      currentValueRef.current = nextValue;

      onChange?.(nextValue);

      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }
    },
    [onChange, value],
  );

  return [currentValue, setValue] as const;
}
