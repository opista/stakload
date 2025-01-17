import { useGameSync } from "@hooks/use-game-sync";
import { Group, Loader, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const GameSync = () => {
  const { processing, status, total } = useGameSync();
  const { t } = useTranslation();

  if (!["inserted", "processing"].includes(status)) {
    return null;
  }

  return (
    <Group align="center">
      <Loader size={24} />
      <div>
        <Text size="sm">{t("gameSync.syncingLibrary")}</Text>
        <Text size="xs">
          {t("gameSync.updating", {
            processing,
            total,
          })}
        </Text>
      </div>
    </Group>
  );
};
