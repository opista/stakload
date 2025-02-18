import { GameFilters, Library, LikeAgeRatingText } from "@contracts/database/games";
import { useGameStore } from "@store/game.store";
import { ParseKeys } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

const ageRatingFilters: { label: ParseKeys; value: LikeAgeRatingText }[] = [
  {
    label: "ageRating.THREE",
    value: "THREE",
  },
  {
    label: "ageRating.SEVEN",
    value: "SEVEN",
  },
  {
    label: "ageRating.TWELVE",
    value: "TWELVE",
  },
  {
    label: "ageRating.SIXTEEN",
    value: "SIXTEEN",
  },
  {
    label: "ageRating.EIGHTEEN",
    value: "EIGHTEEN",
  },
];

const libraryFilters: { label: string; value: Library }[] = [
  {
    label: "Epic Game Store",
    value: "epic-game-store",
  },
  {
    label: "GOG",
    value: "gog",
  },
  {
    label: "Steam",
    value: "steam",
  },
];

export const useLibraryFilters = (currentFilters?: GameFilters) => {
  const { gameFilters } = useGameStore(
    useShallow((state) => ({
      gameFilters: state.gameFilters,
    })),
  );
  const { t } = useTranslation();

  const formattedFilters = useMemo(() => {
    if (!currentFilters) return [];

    return Object.entries(currentFilters).flatMap<{ key: keyof GameFilters; label: string; value: string }>(
      ([key, value]) => {
        switch (key) {
          case "ageRatings":
            return (value as string[])
              ?.map((value) => {
                const match = ageRatingFilters.find((filter) => filter.value === value);

                if (!match) return null;

                return {
                  key,
                  label: t(match.label),
                  value: match.value,
                };
              })
              .filter(Boolean);
          case "isInstalled":
            return value ? [{ key, label: t("filters.isInstalled"), value: true }] : [];
          case "libraries":
            return (value as string[])
              ?.map((value) => {
                const match = libraryFilters.find((filter) => filter.value === value);

                if (!match) return null;

                return {
                  key,
                  label: match.label,
                  value: match.value,
                };
              })
              .filter(Boolean);
          case "developers":
          case "gameModes":
          case "genres":
          case "platforms":
          case "playerPerspectives":
          case "publishers":
            return (value as string[])
              ?.map((value) => {
                const match = gameFilters?.[key]?.find((filter) => filter.value === value);

                if (!match) return null;

                return {
                  key,
                  label: match.label,
                  value: match.value,
                };
              })
              .filter(Boolean);
          default:
            return [];
        }
      },
    );
  }, [currentFilters, gameFilters]);

  return {
    formattedFilters,
  };
};
