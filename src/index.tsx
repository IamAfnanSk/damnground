import React from "react";

import "./index.scss";

import App from "./App";

import { loadWASM } from "onigasm";

import { createRoot } from "react-dom/client";

(async () => {
  await loadWASM("/assets/onigasm.wasm");

  const container = document.getElementById("root");
  const root = createRoot(container!);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
