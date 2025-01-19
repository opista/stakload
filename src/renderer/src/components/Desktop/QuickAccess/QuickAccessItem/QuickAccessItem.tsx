import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { Flex, Text } from "@mantine/core";
import { NavLink } from "react-router";

import classes from "./QuickAccessItem.module.css";

type QuickAccessItemProps = {
  game: GameListModel;
};

export const QuickAccessItem = ({ game }: QuickAccessItemProps) => (
  <NavLink className={classes.link} to={`/desktop/games/${game._id}`}>
    <Flex className={classes.container}>
      <GameCover className={classes.gameCover} game={game} hoverEffect={false} showGameTitle={false} />
      <Text lineClamp={1} size="xs">
        {game.name}
      </Text>
    </Flex>
  </NavLink>
);
