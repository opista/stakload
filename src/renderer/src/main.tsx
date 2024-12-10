import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/carousel/styles.css";
import "allotment/dist/style.css";
import "./styles/styles.css";
import "./i18n";

import { DummyComponent } from "@components/DummyComponent/DummyComponent";
import { GameDetails } from "@components/GameDetails/GameDetails";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { App } from "./App";
import { BaseLayout } from "./layouts/BaseLayout/BaseLayout";
import { DesktopLayout } from "./layouts/DesktopLayout/DesktopLayout";
import { GamingLayout } from "./layouts/GamingLayout/GamingLayout";

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
          <Route element={<GamingLayout />} path="gaming">
            <Route index element={<DummyComponent />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
