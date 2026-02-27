import { Injectable } from "@nestjs/common";

import { WindowService } from "../../../window/window.service";
import { Logger } from "../../../logging/logging.service";

import { BattleNetGame, GameAccounts } from "./types";

const BATTLE_NET_API_URL = "https://account.battle.net";
const BATTLE_NET_API_STATUS_URL = "https://account.battle.net/api/";
const BATTLE_NET_REFRESH_URL = "https://account.battle.net:443/oauth2/authorization/account-settings";
const SESSION_ID = "persist:battle-net-auth";

@Injectable()
export class BattleNetApiService {
  constructor(
    private readonly logger: Logger,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async authenticate(): Promise<boolean> {
    this.logger.log("Starting Battle.net authentication flow");
    try {
      const window = await this.windowService.createChildWindow({
        height: 730,
        networkRequestHandler: (win, _event, url) => {
          if (url.includes("/overview")) {
            win.close();
          }
        },
        sessionId: SESSION_ID,
        url: `${BATTLE_NET_API_URL}/login`,
        width: 400,
      });

      window.show();

      await new Promise<void>((resolve) => {
        window.on("closed", () => resolve());
      });

      return await this.isAuthenticated();
    } catch (error) {
      this.logger.error("Failed to authenticate with Battle.net", error);
      return false;
    }
  }

  async getOwnedGames(): Promise<BattleNetGame[]> {
    const isAuthenticated = await this.isAuthenticated();
    if (!isAuthenticated) {
      throw new Error("Failed to establish Battle.net session");
    }

    try {
      const window = await this.windowService.createChildWindow({
        clearCookies: false,
        height: 1,
        sessionId: SESSION_ID,
        url: BATTLE_NET_REFRESH_URL,
        width: 1,
      });

      await window.loadURL(`${BATTLE_NET_API_URL}/api/games-and-subs`);

      const content: string = await window.webContents.executeJavaScript("document.body.textContent");

      window.close();

      try {
        const data: GameAccounts = JSON.parse(content);

        return data.gameAccounts;
      } catch (error) {
        this.logger.error("Failed to parse Battle.net games response", error);
        return [];
      }
    } catch (error) {
      this.logger.error("Failed to fetch Battle.net games", error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const window = await this.windowService.createChildWindow({
        clearCookies: false,
        height: 1,
        sessionId: SESSION_ID,
        url: BATTLE_NET_REFRESH_URL,
        width: 1,
      });

      await window.loadURL(BATTLE_NET_API_STATUS_URL);
      const content: string = await window.webContents.executeJavaScript("document.body.textContent");
      window.close();

      try {
        const status = JSON.parse(content);
        return status.authenticated === true;
      } catch {
        return false;
      }
    } catch (error) {
      this.logger.error("Failed to check Battle.net authentication status", error);
      return false;
    }
  }
}
