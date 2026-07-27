import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useControllableState } from "./use-controllable-state";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useControllableState", () => {
  it("applies sequential uncontrolled updater functions transactionally", () => {
    function Harness() {
      const [value, setValue] = useControllableState({
        value: undefined,
        defaultValue: 0,
      });
      return (
        <button
          type="button"
          onClick={() => {
            setValue((current) => current + 1);
            setValue((current) => current + 1);
          }}
        >
          {value}
        </button>
      );
    }

    render(<Harness />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button").textContent).toBe("2");
  });

  it("resolves sequential controlled updaters from the latest reported value", () => {
    const onChange = vi.fn();

    function Harness() {
      const [, setValue] = useControllableState({
        value: 0,
        defaultValue: 0,
        onChange,
      });
      return (
        <button
          type="button"
          onClick={() => {
            setValue((current) => current + 1);
            setValue((current) => current + 1);
          }}
        >
          Increment
        </button>
      );
    }

    render(<Harness />);
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 2);
  });
});
