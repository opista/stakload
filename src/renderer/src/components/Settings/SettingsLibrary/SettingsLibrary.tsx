import { useSteamIntegration } from "@hooks/integrations/use-steam-integration";
import { Button, Divider, Flex, PasswordInput, TextInput, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useLibrarySettingsStore } from "@store/library-settings.store";
import { IconSquareRoundedCheckFilled, IconSquareRoundedXFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";
import { SettingsStatusIndicator } from "../SettingsStatusIndicator/SettingsStatusIndicator";
import { SettingsTitle } from "../SettingsTitle/SettingsTitle";
import classes from "./SettingsLibrary.module.css";

const GeneralSettings = ({ id }: { id: string }) => {
  const { setSyncOnStartup, syncOnStartup } = useLibrarySettingsStore(
    useShallow((state) => ({
      setSyncOnStartup: state.setSyncOnStartup,
      syncOnStartup: state.syncOnStartup,
    })),
  );
  const { t } = useTranslation();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    window.api.getGamesLastSyncedAt().then(setLastSync);
  }, []);

  /**
   * TODO - this should trigger libraries to
   * re-fetch games and add any new ones to
   * the DB. After this, we should then trigger
   * a sync (enrich with data from igdb)
   */
  const onSyncClick = async () => {
    await window.api.syncGames();
    modals.close(id);
  };

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("librarySettings.general")}
      </Title>
      <div className={classes.buttonContainer}>
        <div>
          <label className={classes.label}>{t("librarySettings.syncLibrary")} </label>
          <span className={classes.date}>
            {t("librarySettings.lastSync", {
              val: lastSync,
              formatParams: {
                val: { dateStyle: "short", timeStyle: "short" },
              },
            })}
          </span>
        </div>
        <Button color="red" onClick={onSyncClick} size="xs">
          {t("librarySettings.syncLibrary")}
        </Button>
      </div>
      <SettingsCheckbox
        checked={syncOnStartup}
        label={t("librarySettings.syncOnStartup")}
        labelInfo={t("librarySettings.syncOnStartupInfo")}
        onCheckboxChange={setSyncOnStartup}
      />
    </>
  );
};

/**
 * TODO - To be honest this is a total mess.
 * I wonder if this can be cleaned up and re-used
 * for each integration with a few props
 */
const SteamSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [steamId, setSteamId] = useState<string>("");
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [webApiKey, setWebApiKey] = useState<string>("");
  const [isIntegrationValid, setIsIntegrationValid] = useState<boolean | null>(null);
  const { steamIntegration, setSteamIntegration } = useSteamIntegration();
  const { t } = useTranslation();

  const onSave = async () => {
    setIsLoading(true);
    setSteamIntegration({ steamId, webApiKey });
    setIsIntegrationValid(null);
    setIsUpdated(true);
    setIsLoading(false);
  };

  const onClickTestIntegration = async () => {
    setIsUpdated(false);
    setIsLoading(true);
    setIsIntegrationValid(null);
    const isValid = await window.api.testLibraryIntegration(steamId, webApiKey);
    setIsIntegrationValid(isValid);
    setIsLoading(false);
  };

  const onSteamIdChange = (value: string) => {
    setIsIntegrationValid(null);
    setSteamId(value);
  };

  const onWebApiKeyChange = (value: string) => {
    setIsIntegrationValid(null);
    setWebApiKey(value);
  };

  useEffect(() => {
    if (steamIntegration) {
      setSteamId(steamIntegration.steamId);
      setWebApiKey(steamIntegration.webApiKey);
    }
  }, [steamIntegration]);

  const Subtitle = (
    <Trans
      components={{
        SteamAccountLink: <a href="https://store.steampowered.com/account/" rel="noreferrer" target="_blank" />,
        SteamApiKeyLink: <a href="https://steamcommunity.com/dev/apikey" rel="noreferrer" target="_blank" />,
      }}
      i18nKey="steam.integrationGuide"
      t={t}
    ></Trans>
  );

  /**
   * Use some kind of form lib to handle dirty
   * changes/disable save if form updates
   */
  return (
    <>
      <SettingsTitle subtitle={Subtitle} title="Steam" />

      <TextInput
        classNames={{ input: classes.input, label: classes.inputLabel, root: classes.inputRoot }}
        disabled={isLoading}
        label={t("steam.id")}
        onChange={(event) => onSteamIdChange(event.target.value)}
        placeholder={t("steam.id")}
        size="xs"
        value={steamId}
      />
      <PasswordInput
        classNames={{ input: classes.input, label: classes.inputLabel, root: classes.inputRoot }}
        disabled={isLoading}
        label={t("steam.webApiKey")}
        onChange={(event) => onWebApiKeyChange(event.target.value)}
        placeholder={t("steam.webApiKey")}
        size="xs"
        value={webApiKey}
      />

      <Flex justify="flex-end">
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedCheckFilled}
          iconProps={{ className: classes.check }}
          mounted={isUpdated}
          text={t("integration.detailsSaved")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedCheckFilled}
          iconProps={{ className: classes.check }}
          mounted={isIntegrationValid === true}
          text={t("integration.success")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedXFilled}
          iconProps={{ className: classes.cross }}
          mounted={isIntegrationValid === false}
          text={t("integration.failure")}
        />
        <Flex gap="xs">
          <Button
            disabled={!steamId || !webApiKey}
            loading={isLoading}
            onClick={onClickTestIntegration}
            size="xs"
            variant="light"
          >
            {t("integration.test")}
          </Button>
          <Button disabled={isLoading || !isIntegrationValid} onClick={onSave} size="xs">
            {t("integration.save")}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const EpicGamesSettings = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isIntegrationValid, setIsIntegrationValid] = useState<boolean | null>(null);

  useEffect(() => {
    const removeListener = window.api.onEpicGamesAuthentication((_event, { success }) => {
      setIsLoading(false);
      setIsIntegrationValid(success);
      console.log("result", success);
    });
    return () => removeListener();
  }, []);

  const onAuthenticate = () => {
    setIsIntegrationValid(null);
    window.api.authenticateIntegration("epic-game-store");
  };

  return (
    <>
      <SettingsTitle subtitle={t("librarySettings.authSecurity", { library: "Epic Games" })} title="Epic Games" />

      <Flex justify="flex-end">
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedCheckFilled}
          iconProps={{ className: classes.check }}
          mounted={isIntegrationValid === true}
          text={t("integration.success")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedXFilled}
          iconProps={{ className: classes.cross }}
          mounted={isIntegrationValid === false}
          text={t("integration.failure")}
        />
        <Flex gap="xs">
          <Button loading={isLoading} onClick={onAuthenticate} size="xs" variant="light">
            {t("integration.authenticate")}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

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
  return (
    <>
      <GeneralSettings id={id} />
      <Divider className={classes.divider} />
      <SteamSettings />
      <Divider className={classes.divider} />
      <EpicGamesSettings />
      <Divider className={classes.divider} />
    </>
  );
};
