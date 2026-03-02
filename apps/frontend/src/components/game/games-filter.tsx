import { IconAdjustmentsAlt } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { MultiSelect } from "@components/ui/multi-select";
import { Popover } from "@components/ui/popover";
import { useGameStore } from "@store/game.store";

import { GameFilters, Library } from "../../ipc.types";

type GamesFilterProps = {
  disabled?: boolean;
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
};

const libraryFilters: { label: string; value: Library }[] = [
  { label: "Battle.net", value: "battle-net" },
  { label: "Epic Game Store", value: "epic-game-store" },
  { label: "GOG", value: "gog" },
  { label: "Steam", value: "steam" },
];

export const GamesFilter = ({ disabled, filters, onChange }: GamesFilterProps) => {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

  const { gameFilters } = useGameStore(useShallow((state) => ({ gameFilters: state.gameFilters })));

  const onFilterChange = (key: keyof GameFilters) => (value: string[] | boolean | null) =>
    onChange({
      ...filters,
      [key]: value,
    });

  return (
    <Popover
      opened={opened}
      onOpenedChange={setOpened}
      position="bottom-start"
      offset={16}
      content={
        <div className="flex w-[500px] flex-col gap-6 p-2">
          <h3 className="text-xl font-black text-white">{t("filters.title")}</h3>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <Checkbox
                label={t("filters.isInstalled")}
                checked={filters.isInstalled || false}
                onChange={(checked) => onFilterChange("isInstalled")(checked || null)}
              />
            </div>

            <div className="col-span-6 flex flex-col gap-4">
              <MultiSelect
                label={t("filters.libraries")}
                data={libraryFilters}
                value={filters.libraries}
                onChange={onFilterChange("libraries")}
                clearable
              />
              <MultiSelect
                label={t("filters.developers")}
                data={gameFilters?.["developers"] || []}
                value={filters.developers}
                onChange={onFilterChange("developers")}
                clearable
              />
              <MultiSelect
                label={t("filters.publishers")}
                data={gameFilters?.["publishers"] || []}
                value={filters.publishers}
                onChange={onFilterChange("publishers")}
                clearable
              />
              <MultiSelect
                label={t("filters.playerPerspectives")}
                data={gameFilters?.["playerPerspectives"] || []}
                value={filters.playerPerspectives}
                onChange={onFilterChange("playerPerspectives")}
                clearable
              />
            </div>

            <div className="col-span-6 flex flex-col gap-4">
              <MultiSelect
                label={t("filters.platforms")}
                data={gameFilters?.platforms || []}
                value={filters.platforms}
                onChange={onFilterChange("platforms")}
                clearable
              />
              <MultiSelect
                label={t("filters.ageRatings")}
                data={gameFilters.ageRatings || []}
                value={filters.ageRatings}
                onChange={onFilterChange("ageRatings")}
                clearable
              />
              <MultiSelect
                label={t("filters.gameModes")}
                data={gameFilters?.["gameModes"] || []}
                value={filters.gameModes}
                onChange={onFilterChange("gameModes")}
                clearable
              />
              <MultiSelect
                label={t("filters.genres")}
                data={gameFilters?.["genres"] || []}
                value={filters.genres}
                onChange={onFilterChange("genres")}
                clearable
              />
            </div>
          </div>
        </div>
      }
    >
      <Button disabled={disabled} onClick={() => setOpened((o) => !o)} size="sm">
        <IconAdjustmentsAlt size={16} stroke={1.5} />
        <span>Filters</span>
      </Button>
    </Popover>
  );
};
