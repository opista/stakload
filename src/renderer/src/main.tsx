import "./styles/styles.css";
import "./i18n";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";

import { App } from "./app";
import { DesktopLayout } from "./layouts/desktop-layout/desktop-layout";
import { CollectionView } from "./views/collection-view/collection-view";
import { FavouritesView } from "./views/favourites-view/favourites-view";
import { GameDetailsView } from "./views/game-details-view/game-details-view";
import { HomeView } from "./views/home-view/home-view";
import { LibraryView } from "./views/library-view/library-view";
import { SettingsIntegrationsView } from "./views/settings-integrations-view/settings-integrations-view";
import { SettingsView } from "./views/settings-view/settings-view";

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
            <Route path="settings">
              <Route element={<SettingsView />} index />
              <Route element={<SettingsIntegrationsView />} path="integrations" />
            </Route>
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  </StrictMode>,
);
