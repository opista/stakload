import { ActionIcon } from "@components/ui/action-icon";
import { IconMinus, IconSquare, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const WindowControls = () => {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<NodeJS.Platform | null>(null);

  useEffect(() => {
    void window.ipc.system.getPlatform().then(setPlatform);
  }, []);

  const handleMinimize = () => window.ipc.window.minimize();
  const handleMaximize = () => window.ipc.window.maximize();
  const handleClose = () => window.ipc.window.close();

  return (
    <div className="flex items-center gap-2 [app-region:no-drag]">
      {platform && platform !== "darwin" && (
        <div className="flex">
          <ActionIcon
            aria-label={t("windowControls.minimize")}
            className="h-auto w-auto px-4 py-2 rounded-none"
            onClick={handleMinimize}
            variant="subtle"
          >
            <IconMinus size={16} />
          </ActionIcon>
          <ActionIcon
            aria-label={t("windowControls.maximize")}
            className="h-auto w-auto px-4 py-2 rounded-none"
            onClick={handleMaximize}
            variant="subtle"
          >
            <IconSquare size={16} />
          </ActionIcon>
          <ActionIcon
            aria-label={t("windowControls.close")}
            className="h-auto w-auto px-4 py-2 rounded-none hover:bg-red-600 active:bg-red-700"
            onClick={handleClose}
            variant="subtle"
          >
            <IconX size={16} />
          </ActionIcon>
        </div>
      )}
    </div>
  );
};
