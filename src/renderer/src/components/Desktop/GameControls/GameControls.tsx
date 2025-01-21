import { GameStoreModel } from "@contracts/database/games";
import { Button, Group } from "@mantine/core";

export const GameControls = ({ game }: { game: GameStoreModel }) => {
  return (
    <Group>
      <a href={`steam://run/${game.gameId}`}>Launch</a>
      <Button>Uninstall</Button>
    </Group>
  );
};
