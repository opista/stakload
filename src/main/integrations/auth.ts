import { Library } from "@contracts/database/games";
import { BrowserWindow, session } from "electron";

import { LegendaryService } from "./epic-games-store/legendary/legendary.service";

const service = new LegendaryService();

export const authenticateLibraryIntegration = async (library: Library, parent: BrowserWindow) => {
  const integrationSession = session.fromPartition("epic-games-auth"); // Isolated session for safety

  const integrationWindow = new BrowserWindow({
    alwaysOnTop: true,
    autoHideMenuBar: true,
    center: true,
    closable: true,
    fullscreen: false,
    fullscreenable: false,
    height: 520,
    modal: false,
    movable: true,
    parent,
    resizable: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      session: integrationSession,
    },
    width: 350,
  });

  await integrationSession.clearStorageData({ storages: ["cookies"] });

  const networkRequestHandler = async (_event, url) => {
    if (url.startsWith("https://www.epicgames.com/id/api/redirect")) {
      const bodyText = await integrationWindow.webContents.executeJavaScript("document.body.innerText");
      const parsed = JSON.parse(bodyText);

      const { authorizationCode } = parsed;

      console.log(parsed);

      const x = await service.login(authorizationCode);

      console.log({ x });

      // const token = await getAuthToken(authorizationCode);
      // // const assets = await getAssets(token);
      // const test = await getLibraryItems(token);
      // // const catalogItem = await getCatalogItem(assets[1].namespace, assets[1].catalogItemId, token);

      // writeFileSync("library.json", JSON.stringify(test, null, "\t"));
      // parent.webContents.send(EPIC_GAMES_INTEGRATION_RESULT, { success: !!parsed.authorizationCode });
      // integrationWindow.webContents.off("did-navigate", networkRequestHandler);
      integrationWindow.close();
    }
  };

  // Intercept the network request
  integrationWindow.webContents.on("did-navigate", networkRequestHandler);

  // Load the Epic Games login page
  integrationWindow.loadURL(
    "https://www.epicgames.com/id/login?redirectUrl=https%3A//www.epicgames.com/id/api/redirect%3FclientId%3D34a02cf8f4414e29b15921876da36f9a%26responseType%3Dcode",
  );

  integrationWindow.show();
};
