import * as React from "react";
import { DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS } from "../types";

const BREAKPOINT_WIDTHS = Object.values(DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS)
  .slice()
  .sort((first, second) => first - second);

export function useDataTableContainerWidth(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const widthRef = React.useRef(0);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateWidth = (inlineSize = element.clientWidth) => {
      const nextWidth = quantizeDataTableContainerWidth(inlineSize);
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

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      updateWidth(entry ? getResizeObserverInlineSize(entry) : undefined);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return width;
}

export function quantizeDataTableContainerWidth(width: number) {
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

function getResizeObserverInlineSize(entry: ResizeObserverEntry) {
  const contentBoxSize: unknown = entry.contentBoxSize;
  const size: unknown = Array.isArray(contentBoxSize)
    ? contentBoxSize[0]
    : contentBoxSize;
  const inlineSize = getInlineSize(size);

  return inlineSize ?? entry.contentRect.width;
}

function getInlineSize(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const inlineSize = (value as { inlineSize?: unknown }).inlineSize;
  return typeof inlineSize === "number" ? inlineSize : undefined;
}
