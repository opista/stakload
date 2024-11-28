import { useGameSync } from "@hooks/use-game-sync";
import { Group, Loader, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const GameSync = () => {
  const { processed, total } = useGameSync();
  const { t } = useTranslation();

  if (!total) {
    return null;
  }

  return (
    <Group align="center">
      <Loader size={24} />
      <div>
        <Text size="sm">{t("sync.syncingLibrary")}</Text>
        <Text size="xs">
          {t("sync.updating", {
            processed,
            total,
          })}
        </Text>
      </div>
    </Group>
  );
};
