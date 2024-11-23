import { Divider, Title } from "@mantine/core";
import classes from "./SettingsLibrary.module.css";
import { useTranslation } from "react-i18next";
import { useLibrarySettingsStore } from "@store/library-settings-store";
import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";

/**
 * TODO - Should have a section per
 * integration. We'll start with Steam which
 * requires a user ID and API key. We can add
 * a link directly to the API key here:
 * https://steamcommunity.com/dev/apikey
 * We should ask user for explicit confirmation
 * when saving these details, and then store them
 * using electron-conf
 *
 */
export const SettingsLibrary = () => {
  const { setSyncOnStartup, syncOnStartup } = useLibrarySettingsStore();
  const { t } = useTranslation();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("librarySettings.general")}
      </Title>
      <SettingsCheckbox
        checked={syncOnStartup}
        label={t("librarySettings.syncOnStartup")}
        labelInfo={t("librarySettings.syncOnStartupInfo")}
        onCheckboxChange={setSyncOnStartup}
      />
      <Divider className={classes.divider} />
    </>
  );
};
