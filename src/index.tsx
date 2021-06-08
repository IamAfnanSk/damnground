import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

import { loadWASM } from "onigasm";

(async () => {
  await loadWASM("https://cdn.jsdelivr.net/npm/onigasm@2.2.5/lib/onigasm.wasm");

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
})();
