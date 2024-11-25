import { Button, Divider, Title } from "@mantine/core";
import classes from "./SettingsLibrary.module.css";
import { useTranslation } from "react-i18next";
import { useLibrarySettingsStore } from "@store/library-settings.store";
import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";
import { modals } from "@mantine/modals";
import { useShallow } from "zustand/react/shallow";
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
export const SettingsLibrary = ({ id }: { id: string }) => {
  const { setSyncOnStartup, syncOnStartup } = useLibrarySettingsStore(
    useShallow((state) => ({
      setSyncOnStartup: state.setSyncOnStartup,
      syncOnStartup: state.syncOnStartup,
    })),
  );
  const { t } = useTranslation();

  /**
   * TODO - this should trigger libraries to
   * re-fetch games and add any new ones to
   * the DB. After this, we should then trigger
   * a sync (enrich with data from igdb)
   */
  const onResyncClick = () => {
    console.log("resync!");

    modals.close(id);
  };

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("librarySettings.general")}
      </Title>
      <div className={classes.buttonContainer}>
        <div>
          <label className={classes.label}>{t("librarySettings.resyncLibrary")} </label>
          {/* TODO - This should be the most recent metadataSyncedAt / createdAt in the game library, whichever is highest */}
          <span className={classes.date}>{t("librarySettings.lastSynced", { val: new Date() })}</span>
        </div>
        <Button color="red" onClick={onResyncClick} size="xs">
          {t("librarySettings.resyncLibrary")}
        </Button>
      </div>
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
