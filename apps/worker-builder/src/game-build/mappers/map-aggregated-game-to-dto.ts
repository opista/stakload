import type { GameDto, InvolvedCompanyDto, ReferenceItemDto } from "../../models/dto/game.dto";

export type RawAggregatedGameDto = Omit<GameDto, "developers" | "firstReleaseDate" | "publishers"> & {
  firstReleaseDate: number | string | null;
};

const parseFirstReleaseDate = (value: number | string | null): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const deriveCompanyReferences = (
  involvedCompanies: InvolvedCompanyDto[],
  role: "developer" | "publisher",
): ReferenceItemDto[] => {
  const referencesById = new Map<number, ReferenceItemDto>();

  for (const involvedCompany of involvedCompanies) {
    if (!involvedCompany[role]) {
      continue;
    }

    if (!referencesById.has(involvedCompany.company.id)) {
      referencesById.set(involvedCompany.company.id, involvedCompany.company);
    }
  }

  return Array.from(referencesById.values()).sort((left, right) => left.id - right.id);
};

export const mapAggregatedGameToDto = (rawGame: RawAggregatedGameDto | string): GameDto => {
  let parsedGame: RawAggregatedGameDto;

  if (typeof rawGame === "string") {
    try {
      parsedGame = JSON.parse(rawGame) as RawAggregatedGameDto;
    } catch (error) {
      throw new Error("Failed to parse aggregated game payload from Postgres", {
        cause: error,
      });
    }
  } else {
    parsedGame = rawGame;
  }

  const { involvedCompanies = [], ...gameWithoutInvolvedCompanies } = parsedGame;

  return {
    ...gameWithoutInvolvedCompanies,
    ageRatings:
      gameWithoutInvolvedCompanies.ageRatings?.map((ageRating) => ({
        ...ageRating,
        categoryId: ageRating.categoryId ?? null,
        contentDescriptionIds: ageRating.contentDescriptionIds ?? [],
        organisationId: ageRating.organisationId ?? null,
      })) ?? [],
    alternativeNames: gameWithoutInvolvedCompanies.alternativeNames ?? [],
    bundles: gameWithoutInvolvedCompanies.bundles ?? [],
    checksum: gameWithoutInvolvedCompanies.checksum ?? null,
    collections: gameWithoutInvolvedCompanies.collections ?? [],
    createdAt: gameWithoutInvolvedCompanies.createdAt ?? null,
    developers: deriveCompanyReferences(involvedCompanies, "developer"),
    externalGames: gameWithoutInvolvedCompanies.externalGames ?? [],
    firstReleaseDate: parseFirstReleaseDate(parsedGame.firstReleaseDate),
    franchise: gameWithoutInvolvedCompanies.franchise ?? null,
    franchises: gameWithoutInvolvedCompanies.franchises ?? [],
    gameEngines: gameWithoutInvolvedCompanies.gameEngines ?? [],
    involvedCompanies,
    languageSupports: gameWithoutInvolvedCompanies.languageSupports ?? [],
    multiplayerModes: gameWithoutInvolvedCompanies.multiplayerModes ?? [],
    parentGame: gameWithoutInvolvedCompanies.parentGame ?? null,
    publishers: deriveCompanyReferences(involvedCompanies, "publisher"),
    similarGames: gameWithoutInvolvedCompanies.similarGames ?? [],
    sourceUpdatedAt: gameWithoutInvolvedCompanies.sourceUpdatedAt ?? null,
    updatedAt: gameWithoutInvolvedCompanies.updatedAt ?? null,
    versionParent: gameWithoutInvolvedCompanies.versionParent ?? null,
    versionTitle: gameWithoutInvolvedCompanies.versionTitle ?? null,
    websites: gameWithoutInvolvedCompanies.websites ?? [],
  };
};
