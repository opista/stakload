import { GameStoreModel } from "@stakload/contracts/database/games";

export interface LibraryClientService {
  install(game: GameStoreModel): Promise<void>;
  launch(game: GameStoreModel): Promise<void>;
  uninstall(game: GameStoreModel): Promise<void>;
}
