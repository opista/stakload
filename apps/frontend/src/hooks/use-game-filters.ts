import { ParseKeys } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { GameFilters, Library } from "@stakload/contracts/database/games";
import { useGameStore } from "@store/game.store";

const ageRatingFilters: { label: ParseKeys; value: string }[] = [
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
    label: "Battle.net",
    value: "battle-net",
  },
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

    return Object.entries(currentFilters).flatMap<{
      key: keyof GameFilters;
      label: string;
      value: string | boolean;
    }>(([key, value]) => {
      switch (key) {
        case "ageRatings":
          return ((value as string[]) || []).flatMap((v) => {
            const match = ageRatingFilters.find((filter) => filter.value === v);

            if (!match) return [];

            return [
              {
                key,
                label: t(match.label),
                value: match.value,
              },
            ];
          });
        case "isInstalled":
          return value ? [{ key, label: t("filters.isInstalled"), value: true }] : [];
        case "libraries":
          return ((value as string[]) || []).flatMap((v) => {
            const match = libraryFilters.find((filter) => filter.value === v);

            if (!match) return [];

            return [
              {
                key,
                label: match.label,
                value: match.value,
              },
            ];
          });
        case "developers":
        case "gameModes":
        case "genres":
        case "platforms":
        case "playerPerspectives":
        case "publishers":
          return ((value as string[]) || []).flatMap((v) => {
            const match = gameFilters?.[key]?.find((filter) => filter.value === v);

            if (!match) return [];

            return [
              {
                key,
                label: match.label,
                value: match.value,
              },
            ];
          });
        default:
          return [];
      }
    });
  }, [currentFilters, gameFilters]);

  return {
    formattedFilters,
  };
};
