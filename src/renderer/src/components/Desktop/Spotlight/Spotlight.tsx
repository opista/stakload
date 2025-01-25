import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { Spotlight as MantineSpotlight, SpotlightActionData } from "@mantine/spotlight";
import { useGameStore } from "@store/game.store";
import { IconSearch } from "@tabler/icons-react";
import { mapLibraryIcon } from "@util/map-library-icon";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./Spotlight.module.css";

const LibraryIcon = ({ game }: { game: GameListModel }) => {
  const { icon: Icon } = mapLibraryIcon(game.library);
  return <Icon size={20} />;
};

export const Spotlight = () => {
  const games = useGameStore(useShallow((state) => state.gamesList));
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions: SpotlightActionData[] =
    games?.map((game) => ({
      id: game._id,
      label: game.name,
      leftSection: (
        <GameCover
          className={classes.gameCover}
          game={game}
          hoverEffect={false}
          showGameTitle={false}
          showLibraryIcon={false}
        />
      ),
      onClick: () => navigate(`/desktop/library/${game._id}`),
      rightSection: <LibraryIcon game={game} />,
    })) || [];

  return (
    <MantineSpotlight
      actions={actions}
      limit={7}
      nothingFound={t("spotlight.noResultsFound")}
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 3,
        radius: "xl",
      }}
      searchProps={{
        leftSection: <IconSearch stroke={1.5} />,
        placeholder: t("common.search"),
      }}
    />
  );
};
