export interface OwnedGame {
  app_name: string;
  app_title: string;
  metadata: OwnedGameMetadata;
}

export interface OwnedGameMetadata {
  namespace: string;
}
