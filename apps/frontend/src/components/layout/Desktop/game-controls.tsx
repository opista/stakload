import { Button } from "@components/ui/button";
import { GameStoreModel } from "@stakload/contracts/database/games";
import { IconDownload, IconPlayerPlayFilled } from "@tabler/icons-react";

export const GameControls = ({ game }: { game: GameStoreModel }) => {
  return (
    <div className="flex items-center gap-2">
      {game.isInstalled && (
        <>
          <Button leftIcon={IconPlayerPlayFilled} onClick={() => window.ipc.game.launchGame(game._id)}>
            Launch
          </Button>
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
            onClick={() => window.ipc.game.uninstallGame(game._id)}
          >
            Uninstall
          </Button>
        </>
      )}
      {!game.isInstalled && (
        <Button leftIcon={IconDownload} onClick={() => window.ipc.game.installGame(game._id)}>
          Install
        </Button>
      )}
    </div>
  );
};
