import { GameStoreModel } from "@stakload/contracts/database/games";

export interface LaunchResult {
  error?: string;
  success: boolean;
}

export interface LibraryClientService {
  install(game: GameStoreModel): Promise<void>;
  launch(game: GameStoreModel): Promise<void>;
  uninstall(game: GameStoreModel): Promise<void>;
}
