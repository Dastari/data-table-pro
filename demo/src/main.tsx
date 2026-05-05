import * as React from "react";
import { createRoot } from "react-dom/client";
import { DemoApp } from "./DemoApp";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Demo root element was not found.");
}

createRoot(root).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>,
);
