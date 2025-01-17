import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/carousel/styles.css";
import "allotment/dist/style.css";
import "./styles/styles.css";
import "./i18n";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { App } from "./App";
import { BaseLayout } from "./layouts/BaseLayout/BaseLayout";
import { DesktopLayout } from "./layouts/DesktopLayout/DesktopLayout";
import { GamingLayout } from "./layouts/GamingLayout/GamingLayout";
import { CollectionView } from "./views/CollectionView/CollectionView";
import { GameDetailsView } from "./views/GameDetailsView/GameDetailsView";
import { HomeView } from "./views/HomeView/HomeView";
import { LibraryView } from "./views/LibraryView/LibraryView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route element={<BaseLayout />} path="/" />
          <Route element={<DesktopLayout />} path="desktop">
            <Route element={<HomeView />} index />
            <Route path="games">
              <Route element={<LibraryView />} index />
              <Route element={<GameDetailsView />} path=":id" />
            </Route>
            <Route path="collections">
              <Route element={<CollectionView />} path=":id" />
            </Route>
          </Route>
          <Route element={<GamingLayout />} path="gaming" />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
