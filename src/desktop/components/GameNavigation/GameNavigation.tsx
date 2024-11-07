import { Button } from "@mantine/core";
import { GameStoreModel } from "../../../database/schema/game.schema";
import classes from "./GameNavigation.module.css";
type GameNavigationProps = {
  games: GameStoreModel[];
};

export const GameNavigation = ({ games }: GameNavigationProps) => {
  return games.map((game) => (
    <Button
      classNames={{
        root: "my-root-class",
        label: "my-label-class",
        inner: classes.inner,
      }}
      className={classes.button}
      key={game._id}
      justify="flex-start"
      fullWidth
      variant="subtle"
      color="gray"
      radius="md"
    >
      {game.name}
    </Button>
  ));
};
