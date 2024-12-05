export type Library = "steam";
export type Platform = "linux" | "mac" | "windows";

enum AgeRatingText {
  Three = "THREE",
  Seven = "SEVEN",
  Twelve = "TWELVE",
  Sixteen = "SIXTEEN",
  Eighteen = "EIGHTEEN",
}

type LikeAgeRatingText = `${AgeRatingText}`;

type IdAndName = {
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

type Website = {
  id: string;
  igdbId: number;
  url: string;
  website: LikeWebsiteCategoryText;
};

enum WebsiteCategoryText {
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

type LikeWebsiteCategoryText = `${WebsiteCategoryText}`;

export type GameStoreModel = {
  _id: string;
  ageRating?: LikeAgeRatingText;
  artworks?: string[];
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
  library: Library;
  listImage?: string;
  metadataSyncedAt?: Date;
  multiplayerModes?: MultiplayerMode[];
  name: string;
  platform?: Platform[];
  platforms?: IdAndName[];
  playerPerspectives?: IdAndName[];
  publishers?: IdAndName[];
  screenshots?: string[];
  storyline?: string;
  summary?: string;
  type?: "app" | "game";
  videos?: string[];
  websites?: Website[];
};

export type InitialGameStoreModel = Pick<GameStoreModel, "gameId" | "icon" | "library" | "name">;
