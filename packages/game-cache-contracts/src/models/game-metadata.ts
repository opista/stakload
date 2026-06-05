export const GAME_METADATA_SOURCE_IDS = {
  "epic-game-store": 26,
  gog: 5,
  steam: 1,
} as const;

export type GameMetadataSource = keyof typeof GAME_METADATA_SOURCE_IDS;

export type AgeRatingMetadata = {
  descriptions: string[];
  id: string;
  name: string;
  organization: string;
};

export type IdAndNameMetadata = {
  id: string;
  igdbId: number;
  name: string;
};

export type MediaMetadata = {
  height: number;
  url: string;
  width: number;
};

export type MultiplayerModeMetadata = {
  campaignCoop: boolean;
  dropIn: boolean;
  id: string;
  igdbId: number;
  lanCoop: boolean;
  offlineCoop: boolean;
  offlineCoopMax: number;
  offlineMax: number;
  onlineCoop: boolean;
  onlineCoopMax: number;
  onlineMax: number;
  platform: number;
  splitscreen: boolean;
  splitscreenOnline: boolean;
};

export type WebsiteMetadata = {
  id: string;
  igdbId: number;
  url: string;
  websiteType: string;
};

export type GameMetadata = {
  ageRatings?: AgeRatingMetadata[];
  artworks?: MediaMetadata[];
  cover?: string;
  developers?: IdAndNameMetadata[];
  externalGameId: string;
  firstReleaseDate?: string;
  gameModes?: IdAndNameMetadata[];
  genres?: IdAndNameMetadata[];
  igdbId: number;
  multiplayerModes?: MultiplayerModeMetadata[];
  name: string;
  platforms?: IdAndNameMetadata[];
  playerPerspectives?: IdAndNameMetadata[];
  publishers?: IdAndNameMetadata[];
  screenshots?: string[];
  sortableName: string;
  source: GameMetadataSource;
  storyline?: string;
  summary?: string;
  videos?: string[];
  websites?: WebsiteMetadata[];
};

export const isGameMetadataSource = (value: string): value is GameMetadataSource =>
  Object.prototype.hasOwnProperty.call(GAME_METADATA_SOURCE_IDS, value);
