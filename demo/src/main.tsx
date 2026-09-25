import * as React from "react";
import { createRoot } from "react-dom/client";
const Gallery = React.lazy(() =>
  import("./Gallery").then((module) => ({ default: module.Gallery })),
);
const DemoApp = React.lazy(() =>
  import("./DemoApp").then((module) => ({ default: module.DemoApp })),
);
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Demo root element was not found.");
}

createRoot(root).render(
  <React.StrictMode>
    <React.Suspense fallback={<p role="status">Loading examples…</p>}>
      {new URLSearchParams(window.location.search).has("gallery") ? (
        <Gallery />
      ) : (
        <DemoApp />
      )}
    </React.Suspense>
  </React.StrictMode>,
);
