import { Loader, Text, Box, Divider } from "@mantine/core";
import classes from "./GameSync.module.css";
import { useTranslation } from "react-i18next";
import { useGameSync } from "@hooks/use-game-sync";

export const GameSync = () => {
  const { t } = useTranslation();
  const { processing, total } = useGameSync();

  if (!total) {
    return null;
  }

  return (
    <>
      <Box className={classes.container}>
        <Loader className={classes.loader} size={24} type="bars" />
        <div>
          <Text size="sm">{t("sync.syncing")}</Text>
          <Text size="xs">
            {t("sync.updatingLibrary", {
              processing,
              total,
            })}
          </Text>
        </div>
      </Box>
      <Divider orientation="vertical" size="xs" />
    </>
  );
};
