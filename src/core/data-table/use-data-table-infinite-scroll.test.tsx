import * as React from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";

let intersectionCallback: IntersectionObserverCallback | undefined;

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe() {}

  disconnect() {}

  unobserve() {}

  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  intersectionCallback = undefined;
});

describe("useDataTableInfiniteScroll", () => {
  it("allows only one load-more request at a time", async () => {
    let resolveLoad: (() => void) | undefined;
    const onLoadMore = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveLoad = resolve;
        }),
    );

    function Harness() {
      const sentinelRef = useDataTableInfiniteScroll({
        enabled: true,
        hasMore: true,
        onLoadMore,
      });

      return <div ref={sentinelRef} />;
    }

    render(<Harness />);

    const entry = { isIntersecting: true } as IntersectionObserverEntry;
    act(() => {
      intersectionCallback?.([entry], {} as IntersectionObserver);
      intersectionCallback?.([entry], {} as IntersectionObserver);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveLoad?.();
      await Promise.resolve();
    });

    act(() => {
      intersectionCallback?.([entry], {} as IntersectionObserver);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("reports rejected load-more requests", async () => {
    const error = new Error("Load failed");
    const onError = vi.fn();

    function Harness() {
      const sentinelRef = useDataTableInfiniteScroll({
        enabled: true,
        hasMore: true,
        onLoadMore: () => Promise.reject(error),
        onError,
      });

      return <div ref={sentinelRef} />;
    }

    render(<Harness />);

    await act(async () => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onError).toHaveBeenCalledWith(error);
  });
});
