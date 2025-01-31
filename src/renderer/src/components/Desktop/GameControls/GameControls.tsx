import { GameStoreModel } from "@contracts/database/games";
import { Button, Group } from "@mantine/core";

export const GameControls = ({ game }: { game: GameStoreModel }) => {
  return (
    <Group>
      <Button disabled={!game.isInstalled} onClick={() => window.api.launchGame(game._id)}>
        Launch
      </Button>
      <Button disabled={game.isInstalled} onClick={() => window.api.installGame(game._id)}>
        Install
      </Button>
      <Button disabled={!game.isInstalled} onClick={() => window.api.uninstallGame(game._id)}>
        Uninstall
      </Button>
    </Group>
  );
};
