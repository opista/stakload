import { Library } from "@contracts/database/games";
import { BrowserWindow, session } from "electron";
import { Service } from "typedi";

import { GogService } from "../integrations/gog/gog.service";
import { WindowService } from "../window/window.service";

const CLIENT_ID = "46899977096215655";
const CLIENT_SECRET = "9d85c43b1482497dbbce61f6e4aa173a433796eeae2ca8c5f6129f2dc4de46d9";
const REDIRECT_URI = "https://embed.gog.com/on_login_success?origin=client";

type LoadWindowOptions = {
  height: number;
  networkRequestHandler: (
    window: BrowserWindow,
    event,
    url: string,
    httpResponseCode: number,
    httpStatusText: string,
  ) => void;
  sessionId: string;
  url: string;
  width: number;
};

@Service()
export class IntegrationService {
  constructor(
    private readonly gogService: GogService,
    private readonly windowService: WindowService,
  ) {}

  async loadWindow({ height, networkRequestHandler, sessionId, url, width }: LoadWindowOptions) {
    const integrationSession = session.fromPartition(sessionId);
    await integrationSession.clearStorageData({ storages: ["cookies"] });

    const integrationWindow = new BrowserWindow({
      alwaysOnTop: true,
      autoHideMenuBar: true,
      center: true,
      closable: true,
      fullscreen: false,
      fullscreenable: false,
      height,
      modal: false,
      movable: true,
      parent: this.windowService.getBrowserWindow(),
      resizable: false,
      show: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        session: integrationSession,
      },
      width,
    });

    integrationWindow.webContents.on("did-navigate", (...args) => networkRequestHandler(integrationWindow, ...args));

    integrationWindow.loadURL(url);
    integrationWindow.show();
  }

  async authenticate(library: Library) {
    const networkRequestHandler = async (window, _event, url) => {
      if (url.includes("on_login_success")) {
        const code = new URL(url).searchParams.get("code");

        console.log(url);

        if (code) {
          try {
            const tokenResponse = await this.gogService.getAuthToken(code);
            console.log({ tokenResponse });
            const games = await this.gogService.getOwnedGames();

            console.log("GOG Games:", games);

            window.close();
          } catch (error) {
            console.error("GOG auth error:", error);
          }
        }
      }
    };

    await this.loadWindow({
      height: 430,
      networkRequestHandler,
      sessionId: "gog-auth",
      url: `https://auth.gog.com/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&layout=client2`,
      width: 410,
    });
  }
}
