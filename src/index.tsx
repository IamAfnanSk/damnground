import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

import { loadWASM } from "onigasm";

(async () => {
  await loadWASM("/assets/onigasm.wasm");

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
})();
