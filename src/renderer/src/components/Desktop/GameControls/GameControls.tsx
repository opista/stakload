import { GameStoreModel } from "@contracts/database/games";
import { Button } from "@mantine/core";
import { IconDownload, IconPlayerPlayFilled } from "@tabler/icons-react";

export const GameControls = ({ game }: { game: GameStoreModel }) => {
  return (
    <div className="flex items-center gap-2">
      {game.isInstalled && (
        <>
          <Button
            color="green"
            disabled={!game.isInstalled}
            leftSection={<IconPlayerPlayFilled size={16} />}
            onClick={() => window.ipc.game.launchGame(game._id)}
          >
            Launch
          </Button>
          <Button color="red" disabled={!game.isInstalled} onClick={() => window.ipc.game.uninstallGame(game._id)}>
            Uninstall
          </Button>
        </>
      )}
      {!game.isInstalled && (
        <Button
          disabled={game.isInstalled}
          leftSection={<IconDownload size={16} />}
          onClick={() => window.ipc.game.installGame(game._id)}
        >
          Install
        </Button>
      )}
    </div>
  );
};
