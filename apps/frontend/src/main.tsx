import "./styles/styles.css";
import "./i18n";

import { installDemoGlobals } from "@platform/install-demo-globals";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";

import { App } from "./app";
import { DesktopLayout } from "./layouts/desktop-layout";
import { CollectionView } from "./views/collection-view/collection-view";
import { FavouritesView } from "./views/favourites-view/favourites-view";
import { GameDetailsView } from "./views/game-details-view/game-details-view";
import { HomeView } from "./views/home-view/home-view";
import { IntegrationsView } from "./views/integrations-view/integrations-view";
import { LibraryView } from "./views/library-view/library-view";

installDemoGlobals();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryRouter>
      <Routes>
        <Route element={<App />}>
          <Route element={<DesktopLayout />} path="/">
            <Route element={<HomeView />} index />
            <Route path="library">
              <Route element={<LibraryView />} index />
              <Route element={<GameDetailsView />} path=":id" />
            </Route>
            <Route element={<FavouritesView />} index path="favourites" />
            <Route path="collections">
              <Route element={<CollectionView />} path=":id" />
            </Route>
            <Route path="integrations">
              <Route element={<IntegrationsView />} index />
            </Route>
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  </StrictMode>,
);
