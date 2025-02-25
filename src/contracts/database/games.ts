// These should map to the IGDB library names
// TODO - With the addition of battle-net, this now doesn't. I don't know what
// the impact of this will be
export type Library = "battle-net" | "epic-game-store" | "gog" | "steam";

export type EpicLibraryMeta = {
  appName: string;
  namespace: string;
};

export type LibraryMeta = EpicLibraryMeta;

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
  archivedAt?: Date;
  artworks?: Media[];
  cover?: string;
  createdAt: Date;
  description?: string;
  developers?: IdAndName[];
  firstReleaseDate?: string;
  gameId?: string;
  gameModes?: IdAndName[];
  genres?: IdAndName[];
  igdbId?: number;
  installationDetails?: GameInstallationDetails;
  isFavourite?: boolean;
  isInstalled?: boolean;
  isQuickLaunch?: boolean;
  lastPlayedAt?: Date;
  library: Library;
  libraryMeta?: LibraryMeta;
  metadataSyncedAt?: Date;
  multiplayerModes?: MultiplayerMode[];
  name: string;
  platforms?: IdAndName[];
  playerPerspectives?: IdAndName[];
  publishers?: IdAndName[];
  screenshots?: string[];
  sortableName?: string;
  storyline?: string;
  summary?: string;
  videos?: string[];
  websites?: Website[];
};

export type DateRange =
  | "ONE_DAY"
  | "ONE_WEEK"
  | "ONE_MONTH"
  | "ONE_YEAR"
  | "TODAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "THIS_YEAR"
  | "CUSTOM";

export type DateFilter = {
  dateRange: DateRange;
  endDate?: Date;
  startDate?: Date;
};

export type GameFilters = {
  ageRatings?: string[];
  createdAt?: DateFilter;
  developers?: string[];
  gameModes?: string[];
  genres?: string[];
  isFavourite?: boolean;
  isInstalled?: boolean;
  isQuickLaunch?: boolean;
  libraries?: string[];
  platforms?: string[];
  playerPerspectives?: string[];
  publishers?: string[];
};

export type GameListModel = Pick<GameStoreModel, "_id" | "cover" | "isInstalled" | "library" | "name">;

export type FeaturedGameModel = Pick<GameStoreModel, "_id" | "genres" | "name" | "screenshots" | "summary">;

export type GameInstallationDetails = {
  installLocation: string;
  installedAt: Date;
};
