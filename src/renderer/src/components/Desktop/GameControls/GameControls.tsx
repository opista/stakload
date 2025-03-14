import { GameStoreModel } from "@contracts/database/games";
import { Button, Group } from "@mantine/core";
import { IconDownload, IconPlayerPlayFilled } from "@tabler/icons-react";

export const GameControls = ({ game }: { game: GameStoreModel }) => {
  return (
    <Group>
      {game.isInstalled && (
        <>
          <Button
            color="green"
            disabled={!game.isInstalled}
            leftSection={<IconPlayerPlayFilled size={16} />}
            onClick={() => window.api.launchGame(game._id)}
          >
            Launch
          </Button>
          <Button color="red" disabled={!game.isInstalled} onClick={() => window.api.uninstallGame(game._id)}>
            Uninstall
          </Button>
        </>
      )}
      {!game.isInstalled && (
        <Button
          disabled={game.isInstalled}
          leftSection={<IconDownload size={16} />}
          onClick={() => window.api.installGame(game._id)}
        >
          Install
        </Button>
      )}
    </Group>
  );
};
