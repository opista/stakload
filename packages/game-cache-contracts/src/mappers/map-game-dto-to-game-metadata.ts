import type { GameMetadata, GameMetadataSource, WebsiteMetadata } from "../models/game-metadata";
import type { GameDto, ImageDto, ReferenceItemDto } from "../models/game.dto";

const IGDB_IMAGE_BASE_URL = "https://images.igdb.com/igdb/image/upload";
const KNOWN_WEBSITE_TYPES = new Set([
  "android",
  "bluesky",
  "discord",
  "epicgames",
  "facebook",
  "gog",
  "instagram",
  "ipad",
  "iphone",
  "itch",
  "official",
  "reddit",
  "steam",
  "twitch",
  "twitter",
  "wikia",
  "wikipedia",
  "youtube",
]);

const mapSortableName = (name: string) => {
  const articleRegex = /^(the|a|an)\s+/i;
  const match = name.match(articleRegex);

  if (match) {
    return `${name.replace(articleRegex, "").trim()}, ${match[1]}`;
  }

  return name;
};

const mapReference = ({ id, name }: ReferenceItemDto) => ({
  id: String(id),
  igdbId: id,
  name,
});

const mapImageUrl = (image: ImageDto | null | undefined, size: string): string | undefined =>
  image?.imageId ? `${IGDB_IMAGE_BASE_URL}/${size}/${image.imageId}.webp` : undefined;

const mapMedia = (image: ImageDto) => {
  const url = mapImageUrl(image, "t_1080p");
  if (!url) return null;

  return {
    height: image.height ?? 0,
    url,
    width: image.width ?? 0,
  };
};

const mapFirstReleaseDate = (firstReleaseDate: number | null): string | undefined => {
  if (firstReleaseDate === null) return undefined;

  try {
    const date = new Date(firstReleaseDate * 1000);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  } catch {
    return undefined;
  }
};

const mapWebsiteType = (name: string | null | undefined): string | null => {
  if (!name) return null;
  const normalised = name.toLowerCase().replace(/[\s_-]+/g, "");
  return KNOWN_WEBSITE_TYPES.has(normalised) ? normalised : null;
};

const mapWebsites = (game: GameDto): WebsiteMetadata[] =>
  game.websites.flatMap((website) => {
    const websiteType = mapWebsiteType(website.websiteType?.name);
    if (!websiteType) return [];

    return [
      {
        id: String(website.id),
        igdbId: website.id,
        url: website.url,
        websiteType,
      },
    ];
  });

export const mapGameDtoToGameMetadata = (
  game: GameDto,
  source: GameMetadataSource,
  externalGameId: string,
): GameMetadata => ({
  ageRatings: game.ageRatings.map((ageRating) => ({
    descriptions: ageRating.descriptions,
    id: String(ageRating.id),
    name: ageRating.name ?? "",
    organization: ageRating.organisation ?? "",
  })),
  artworks: game.artworks.flatMap((artwork) => {
    const media = mapMedia(artwork);
    return media ? [media] : [];
  }),
  cover: mapImageUrl(game.cover, "t_cover_big"),
  developers: game.developers.map(mapReference),
  externalGameId,
  firstReleaseDate: mapFirstReleaseDate(game.firstReleaseDate),
  gameModes: game.gameModes.map(mapReference),
  genres: game.genres.map(mapReference),
  igdbId: game.id,
  multiplayerModes: game.multiplayerModes.map((mode) => ({
    campaignCoop: mode.campaignCoop ?? false,
    dropIn: mode.dropIn ?? false,
    id: String(mode.id),
    igdbId: mode.id,
    lanCoop: mode.lanCoop ?? false,
    offlineCoop: mode.offlineCoop ?? false,
    offlineCoopMax: mode.offlineCoopMax ?? 0,
    offlineMax: mode.offlineMax ?? 0,
    onlineCoop: mode.onlineCoop ?? false,
    onlineCoopMax: mode.onlineCoopMax ?? 0,
    onlineMax: mode.onlineMax ?? 0,
    platform: mode.platform ?? 0,
    splitscreen: mode.splitScreen ?? false,
    splitscreenOnline: mode.splitScreenOnline ?? false,
  })),
  name: game.name,
  platforms: game.platforms.map(mapReference),
  playerPerspectives: game.playerPerspectives.map(mapReference),
  publishers: game.publishers.map(mapReference),
  screenshots: game.screenshots.flatMap((screenshot) => {
    const url = mapImageUrl(screenshot, "t_1080p");
    return url ? [url] : [];
  }),
  sortableName: mapSortableName(game.name),
  source,
  storyline: game.storyline ?? undefined,
  summary: game.summary ?? undefined,
  videos: game.videos.flatMap((video) => (video.videoId ? [video.videoId] : [])),
  websites: mapWebsites(game),
});
