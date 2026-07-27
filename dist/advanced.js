export { DataTableBodyRow, DataTableCardPanel, DataTableFooterSection, DataTableHeaderCell, DataTableTablePanel, DataTableToolbarSection, createDataTable, primitiveUiKit, useColumnLayout, useControllableState, useDataTableColumns, useDataTableInstance, useDataTableState, useRowEditing } from './chunk-XSIQ7POC.js';
import * as React from 'react';

function useStableCallback(callback) {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  return React.useCallback((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}

export { useStableCallback };
//# sourceMappingURL=advanced.js.map
//# sourceMappingURL=advanced.js.map