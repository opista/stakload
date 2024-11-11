import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "allotment/dist/style.css";
import "./styles/styles.css";

import "./i18n";

import { app, events, init, window as neuWindow } from "@neutralinojs/lib";

import { App } from "./App";
import * as React from "react";
import { createRoot } from "react-dom/client";

init();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function onWindowClose() {
  app.exit();
}

events.on("windowClose", onWindowClose);

neuWindow.focus();
