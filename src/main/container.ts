import "reflect-metadata";

import { Conf } from "electron-conf/main";
import { Container, Token } from "typedi";

import { CollectionController } from "./collection/collection.controller";
import { GameController } from "./game/game.controller";
import { SyncController } from "./sync/sync.controller";
import { SystemController } from "./system/system.controller";
import { WindowController } from "./window/window.controller";

const conf = new Conf();

conf.registerRendererListener();
Container.set("conf", conf);

const controllers = [CollectionController, GameController, SyncController, SystemController, WindowController];

controllers.forEach((controller) => {
  Container.get(controller as Token<typeof controller>);
});

export { Container };
