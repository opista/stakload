import { Library } from "@contracts/database/games";
import { Button, Divider, Flex, PasswordInput, TextInput, Title } from "@mantine/core";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import { IconSquareRoundedCheckFilled, IconSquareRoundedXFilled } from "@tabler/icons-react";
import { useEffect, useReducer, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { SettingsCheckbox } from "../../components/Desktop/Settings/SettingsCheckbox/SettingsCheckbox";
import { SettingsStatusIndicator } from "../../components/Desktop/Settings/SettingsStatusIndicator/SettingsStatusIndicator";
import { SettingsTitle } from "../../components/Desktop/Settings/SettingsTitle/SettingsTitle";

import classes from "./SettingsIntegrationsView.module.css";

type ValidationState = {
  [key in Library]: boolean | null;
};

type ValidationAction = { library: Library; success: boolean; type: "SET_VALIDATION" } | { type: "RESET" };

const initialValidationState: ValidationState = {
  "battle-net": null,
  "epic-game-store": null,
  gog: null,
  steam: null,
};

const validationReducer = (state: ValidationState, action: ValidationAction): ValidationState => {
  switch (action.type) {
    case "SET_VALIDATION":
      return {
        ...initialValidationState,
        [action.library]: action.success,
      };
    case "RESET":
      return initialValidationState;
    default:
      return state;
  }
};

const GeneralSettings = () => {
  const { setSyncOnStartup, syncOnStartup } = useIntegrationSettingsStore(
    useShallow((state) => ({
      setSyncOnStartup: state.setSyncOnStartup,
      syncOnStartup: state.syncOnStartup,
    })),
  );
  const { t } = useTranslation();

  const onSyncClick = async () => window.api.syncGames();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("settings.library.general")}
      </Title>
      <div className={classes.buttonContainer}>
        <div>
          <label className={classes.label}>{t("settings.library.syncLibrary")} </label>
          <span className={classes.date}>
            {t("settings.library.lastSync", {
              formatParams: {
                val: { dateStyle: "short", timeStyle: "short" },
              },
              val: "TODO",
            })}
          </span>
        </div>
        <Button color="red" onClick={onSyncClick} size="xs">
          {t("settings.library.syncLibrary")}
        </Button>
      </div>
      <SettingsCheckbox
        checked={syncOnStartup}
        label={t("settings.library.syncOnStartup")}
        labelInfo={t("settings.library.syncOnStartupInfo")}
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
const SteamSettings = ({ isValid }: { isValid: boolean | null }) => {
  const { hasStoredWebApiKey, steamIntegrationEnabled, storeSteamId, toggleIntegrationEnabled } =
    useIntegrationSettingsStore(
      useShallow((state) => ({
        hasStoredWebApiKey: !!state.steamIntegration?.webApiKey,
        steamIntegrationEnabled: state.integrationsEnabled.steam,
        storeSteamId: state.steamIntegration?.steamId,
        toggleIntegrationEnabled: state.toggleIntegrationEnabled,
      })),
    );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [steamId, setSteamId] = useState<string>(storeSteamId || "");
  const [webApiKey, setWebApiKey] = useState<string>("");
  const { t } = useTranslation();

  const onAuthenticate = () => {
    setIsLoading(true);
    window.api.authenticateIntegration("steam", { steamId, webApiKey });
  };

  const onTest = async () => {
    setIsLoading(true);
    const result = await window.api.testLibraryIntegration("steam");

    console.log("result", result);
    setIsLoading(false);
  };

  const onSteamIdChange = (value: string) => {
    setSteamId(value);
  };

  const onWebApiKeyChange = (value: string) => {
    setWebApiKey(value);
  };

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

      <SettingsCheckbox
        checked={steamIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("steam")}
      />
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
          mounted={isValid === true}
          text={t("common.success")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedXFilled}
          iconProps={{ className: classes.cross }}
          mounted={isValid === false}
          text={t("common.failure")}
        />
        <Flex gap="xs">
          <Button
            disabled={!steamId || (!hasStoredWebApiKey && !webApiKey)}
            loading={isLoading}
            onClick={onTest}
            size="xs"
            variant="light"
          >
            {t("settings.integration.test")}
          </Button>
          <Button disabled={isLoading || isValid === false} onClick={onAuthenticate} size="xs">
            {t("settings.integration.authenticate")}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const EpicGamesSettings = ({ isValid }: { isValid: boolean | null }) => {
  const { epicIntegrationEnabled, toggleIntegrationEnabled } = useIntegrationSettingsStore(
    useShallow((state) => ({
      epicIntegrationEnabled: state.integrationsEnabled["epic-game-store"],
      toggleIntegrationEnabled: state.toggleIntegrationEnabled,
    })),
  );
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAuthenticate = () => {
    setIsLoading(true);
    window.api.authenticateIntegration("epic-game-store");
  };

  const onTest = async () => {
    setIsLoading(true);
    const result = await window.api.testLibraryIntegration("epic-game-store");

    console.log("result", result);
    setIsLoading(false);
  };

  return (
    <>
      <SettingsTitle subtitle={t("settings.library.authSecurity", { library: "Epic Games" })} title="Epic Games" />
      <SettingsCheckbox
        checked={epicIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("epic-game-store")}
      />
      <Flex justify="flex-end">
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedCheckFilled}
          iconProps={{ className: classes.check }}
          mounted={isValid === true}
          text={t("common.success")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedXFilled}
          iconProps={{ className: classes.cross }}
          mounted={isValid === false}
          text={t("common.failure")}
        />
        <Flex gap="xs">
          <Button disabled={isLoading} loading={isLoading} onClick={onTest} size="xs" variant="light">
            {t("settings.integration.test")}
          </Button>

          <Button disabled={isLoading} loading={isLoading} onClick={onAuthenticate} size="xs">
            {t("settings.integration.authenticate")}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const GogSettings = ({ isValid }: { isValid: boolean | null }) => {
  const { gogIntegrationEnabled, toggleIntegrationEnabled } = useIntegrationSettingsStore(
    useShallow((state) => ({
      gogIntegrationEnabled: state.integrationsEnabled.gog,
      toggleIntegrationEnabled: state.toggleIntegrationEnabled,
    })),
  );
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAuthenticate = () => {
    setIsLoading(true);
    window.api.authenticateIntegration("gog");
  };

  const onTest = async () => {
    setIsLoading(true);
    const result = await window.api.testLibraryIntegration("gog");
    console.log("result", result);
    setIsLoading(false);
  };

  return (
    <>
      <SettingsTitle subtitle={t("settings.library.authSecurity", { library: "GOG" })} title="GOG" />
      <SettingsCheckbox
        checked={gogIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("gog")}
      />
      <Flex justify="flex-end">
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedCheckFilled}
          iconProps={{ className: classes.check }}
          mounted={isValid === true}
          text={t("common.success")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedXFilled}
          iconProps={{ className: classes.cross }}
          mounted={isValid === false}
          text={t("common.failure")}
        />
        <Flex gap="xs">
          <Button disabled={isLoading} loading={isLoading} onClick={onTest} size="xs" variant="light">
            {t("settings.integration.test")}
          </Button>

          <Button loading={isLoading} onClick={onAuthenticate} size="xs">
            {t("settings.integration.authenticate")}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const BattleNetSettings = ({ isValid }: { isValid: boolean | null }) => {
  const { battleNetIntegrationEnabled, toggleIntegrationEnabled } = useIntegrationSettingsStore(
    useShallow((state) => ({
      battleNetIntegrationEnabled: state.integrationsEnabled["battle-net"],
      toggleIntegrationEnabled: state.toggleIntegrationEnabled,
    })),
  );
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAuthenticate = () => {
    setIsLoading(true);
    window.api.authenticateIntegration("battle-net");
  };

  const onTest = async () => {
    setIsLoading(true);
    const result = await window.api.testLibraryIntegration("battle-net");
    console.log("result", result);
    setIsLoading(false);
  };

  return (
    <>
      <SettingsTitle subtitle={t("settings.library.authSecurity", { library: "Battle.net" })} title="Battle.net" />
      <SettingsCheckbox
        checked={battleNetIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("battle-net")}
      />
      <Flex justify="flex-end">
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedCheckFilled}
          iconProps={{ className: classes.check }}
          mounted={isValid === true}
          text={t("common.success")}
        />
        <SettingsStatusIndicator
          className={classes.statusIndicator}
          icon={IconSquareRoundedXFilled}
          iconProps={{ className: classes.cross }}
          mounted={isValid === false}
          text={t("common.failure")}
        />
        <Flex gap="xs">
          <Button disabled={isLoading} loading={isLoading} onClick={onTest} size="xs" variant="light">
            {t("settings.integration.test")}
          </Button>

          <Button loading={isLoading} onClick={onAuthenticate} size="xs">
            {t("settings.integration.authenticate")}
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
export const SettingsIntegrationsView = () => {
  const [validationState, dispatch] = useReducer(validationReducer, initialValidationState);

  useEffect(() => {
    const removeListener = window.api.onIntegrationAuthenticationResult((_event: unknown, { library, success }) => {
      dispatch({ library, success, type: "SET_VALIDATION" });
    });
    return () => removeListener();
  }, []);

  return (
    <div className={classes.container}>
      <GeneralSettings />
      <Divider className={classes.divider} />
      <SteamSettings isValid={validationState.steam} />
      <Divider className={classes.divider} />
      <EpicGamesSettings isValid={validationState["epic-game-store"]} />
      <Divider className={classes.divider} />
      <GogSettings isValid={validationState.gog} />
      <Divider className={classes.divider} />
      <BattleNetSettings isValid={validationState["battle-net"]} />
    </div>
  );
};
