export type Library = "steam";
export type Platform = "linux" | "mac" | "windows";

/**
 * TODO these are duplicates, we should consolidate
 * once we have moved the API into this repo
 */

export enum AgeRatingText {
  Eighteen = "EIGHTEEN",
  Seven = "SEVEN",
  Sixteen = "SIXTEEN",
  Three = "THREE",
  Twelve = "TWELVE",
}

export type LikeAgeRatingText = `${AgeRatingText}`;

export type Media = {
  height: number;
  url: string;
  width: number;
};

export type IdAndName = {
  id: string;
  igdbId: number;
  name: string;
};

type MultiplayerMode = {
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

export type Website = {
  id: string;
  igdbId: number;
  url: string;
  website: LikeWebsiteCategoryText;
};

export enum WebsiteCategoryText {
  Android = "ANDROID",
  Discord = "DISCORD",
  EpicGames = "EPIC_GAMES",
  Facebook = "FACEBOOK",
  Gog = "GOG",
  Instagram = "INSTAGRAM",
  Ipad = "IPAD",
  Iphone = "IPHONE",
  Itch = "ITCH",
  Official = "OFFICIAL",
  Reddit = "REDDIT",
  Steam = "STEAM",
  Twitch = "TWITCH",
  Twitter = "TWITTER",
  Wikia = "WIKIA",
  Wikipedia = "WIKIPEDIA",
  Youtube = "YOUTUBE",
}

export type LikeWebsiteCategoryText = `${WebsiteCategoryText}`;

export type GameStoreModel = {
  _id: string;
  // TODO this should be an id and name for filtering
  ageRating?: LikeAgeRatingText;
  artworks?: Media[];
  backgroundImage?: string;
  cover?: string;
  deletedAt?: Date;
  description?: string;
  developers?: IdAndName[];
  firstReleaseDate?: string;
  gameId: string;
  gameModes?: IdAndName[];
  genres?: IdAndName[];
  icon?: string;
  igdbId?: number;
  lastPlayedAt?: Date;
  // TODO this should be an id and name for filtering
  library: Library;
  listImage?: string;
  metadataSyncedAt?: Date;
  multiplayerModes?: MultiplayerMode[];
  name: string;
  // TODO Hmmm, what should we do here?
  platform?: Platform[];
  platforms?: IdAndName[];
  playerPerspectives?: IdAndName[];
  publishers?: IdAndName[];
  screenshots?: string[];
  sortableName?: string;
  storyline?: string;
  summary?: string;
  // TODO - bin this?
  type?: "app" | "game";
  videos?: string[];
  websites?: Website[];
};

export type InitialGameStoreModel = Pick<GameStoreModel, "gameId" | "icon" | "library" | "name" | "sortableName">;

export type GameFilters = {
  ageRatings?: string[];
  developers?: string[];
  gameModes?: string[];
  genres?: string[];
  platforms?: string[];
  playerPerspectives?: string[];
  publishers?: string[];
};
