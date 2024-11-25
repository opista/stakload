import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "allotment/dist/style.css";
import "./styles/styles.css";

import "./i18n";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { DesktopLayout } from "./layouts/DesktopLayout/DesktopLayout";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameDetails } from "@components/GameDetails/GameDetails";
import { BaseLayout } from "./layouts/BaseLayout/BaseLayout";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route element={<BaseLayout />} path="/" />
          <Route element={<DesktopLayout />} path="desktop">
            <Route index element={<GamesGrid />} />
            <Route element={<GameDetails />} path=":id"></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
