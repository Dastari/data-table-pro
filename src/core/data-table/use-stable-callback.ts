import * as React from "react";

export function useStableCallback<TArgs extends Array<unknown>, TResult>(
  callback: ((...args: TArgs) => TResult) | undefined,
) {
  const callbackRef = React.useRef(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return React.useCallback((...args: TArgs) => {
    return callbackRef.current?.(...args);
  }, []);
}
