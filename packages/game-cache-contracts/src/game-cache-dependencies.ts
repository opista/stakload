import { buildGameDependencySetKey } from "./cache-keys";
import type { GameDto } from "./models/game.dto";
import type { GameCacheReferenceKind } from "./reference-kinds";

const ZERO_VALUE_REFERENCE_KINDS = new Set<GameCacheReferenceKind>(["gameStatus", "gameType"]);
const isValidReferenceId = (referenceKind: GameCacheReferenceKind, id: unknown): id is number =>
  typeof id === "number" &&
  Number.isInteger(id) &&
  (id > 0 || (id === 0 && ZERO_VALUE_REFERENCE_KINDS.has(referenceKind)));

const addDependencyKeysFromIds = (
  dependencyKeys: Set<string>,
  referenceKind: GameCacheReferenceKind,
  ids: Array<number | null | undefined> | null | undefined,
): void => {
  if (!ids) return;

  for (const id of ids) {
    if (!isValidReferenceId(referenceKind, id)) continue;
    dependencyKeys.add(buildGameDependencySetKey(referenceKind, id));
  }
};

const addDependencyKeysFromItems = (
  dependencyKeys: Set<string>,
  referenceKind: GameCacheReferenceKind,
  items: Array<{ id: number } | null | undefined> | null | undefined,
): void => {
  if (!items) return;

  for (const item of items) {
    const id = item?.id;
    if (!isValidReferenceId(referenceKind, id)) continue;
    dependencyKeys.add(buildGameDependencySetKey(referenceKind, id));
  }
};

export const buildGameCacheDependencyKeys = (game: GameDto): string[] => {
  const dependencyKeys = new Set<string>();
  const ageRatings: Array<GameDto["ageRatings"][number] | null | undefined> = game.ageRatings ?? [];
  const externalGames: Array<GameDto["externalGames"][number] | null | undefined> = game.externalGames ?? [];
  const franchises: Array<GameDto["franchises"][number] | null | undefined> = game.franchises ?? [];
  const involvedCompanies: Array<GameDto["involvedCompanies"][number] | null | undefined> =
    game.involvedCompanies ?? [];
  const languageSupports: Array<GameDto["languageSupports"][number] | null | undefined> = game.languageSupports ?? [];
  const websites: Array<GameDto["websites"][number] | null | undefined> = game.websites ?? [];
  const franchiseItems = [...(game.franchise ? [game.franchise] : []), ...franchises];

  const referenceFields: Array<{
    items: Array<{ id: number } | null | undefined>;
    referenceKind: GameCacheReferenceKind;
  }> = [
    { items: game.genres, referenceKind: "genre" },
    { items: game.platforms, referenceKind: "platform" },
    { items: game.themes, referenceKind: "theme" },
    { items: game.gameModes, referenceKind: "gameMode" },
    { items: game.keywords, referenceKind: "keyword" },
    { items: game.playerPerspectives, referenceKind: "playerPerspective" },
    { items: game.alternativeNames, referenceKind: "alternativeName" },
    { items: game.artworks, referenceKind: "artwork" },
    { items: game.bundles, referenceKind: "bundleGame" },
    { items: game.collections, referenceKind: "collection" },
    { items: externalGames, referenceKind: "externalGame" },
    { items: franchiseItems, referenceKind: "franchise" },
    { items: game.gameEngines, referenceKind: "gameEngine" },
    { items: ageRatings, referenceKind: "ageRating" },
    { items: languageSupports, referenceKind: "languageSupport" },
    { items: game.multiplayerModes, referenceKind: "multiplayerMode" },
    { items: involvedCompanies, referenceKind: "involvedCompany" },
    { items: game.screenshots, referenceKind: "screenshot" },
    { items: game.similarGames, referenceKind: "similarGame" },
    { items: game.videos, referenceKind: "gameVideo" },
    { items: websites, referenceKind: "website" },
    { items: game.parentGame ? [game.parentGame] : [], referenceKind: "parentGame" },
    { items: game.versionParent ? [game.versionParent] : [], referenceKind: "versionParent" },
    { items: game.gameStatus ? [game.gameStatus] : [], referenceKind: "gameStatus" },
    { items: game.gameType ? [game.gameType] : [], referenceKind: "gameType" },
    { items: game.cover ? [game.cover] : [], referenceKind: "cover" },
  ];

  for (const { items, referenceKind } of referenceFields) {
    addDependencyKeysFromItems(dependencyKeys, referenceKind, items);
  }

  addDependencyKeysFromItems(dependencyKeys, "company", [
    ...(game.developers ?? []),
    ...(game.publishers ?? []),
    ...involvedCompanies.map((involvedCompany) => involvedCompany?.company),
  ]);

  addDependencyKeysFromIds(
    dependencyKeys,
    "ageRatingCategory",
    ageRatings.map((ageRating) => ageRating?.categoryId),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "ageRatingOrganisation",
    ageRatings.map((ageRating) => ageRating?.organisationId),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "ageRatingContentDescription",
    ageRatings.flatMap((ageRating) => ageRating?.contentDescriptionIds ?? []),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "externalGameSource",
    externalGames.map((externalGame) => externalGame?.externalGameSource),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "gameReleaseFormat",
    externalGames.map((externalGame) => externalGame?.gameReleaseFormat),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "platform",
    externalGames.map((externalGame) => externalGame?.platform),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "language",
    languageSupports.map((languageSupport) => languageSupport?.language),
  );
  addDependencyKeysFromIds(
    dependencyKeys,
    "languageSupportType",
    languageSupports.map((languageSupport) => languageSupport?.languageSupportType),
  );
  addDependencyKeysFromItems(
    dependencyKeys,
    "websiteType",
    websites.map((website) => website?.websiteType),
  );

  return Array.from(dependencyKeys);
};
