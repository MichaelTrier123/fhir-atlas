import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@xyflow/react/dist/style.css";
import "./styles/index.css";
import { StateProvider } from "./app/state";
import App from "./app/App";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <StateProvider>
        <App />
      </StateProvider>
    </HashRouter>
  </React.StrictMode>,
);
