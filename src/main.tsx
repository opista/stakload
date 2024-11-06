import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";

import { app, events, init, window as neuWindow } from "@neutralinojs/lib";

import { App } from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

import "./i18n";

init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function onWindowClose() {
  app.exit();
}

events.on("windowClose", onWindowClose);

neuWindow.focus();
