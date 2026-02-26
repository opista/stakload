import { SettingsCheckbox } from "@components/layout/desktop/settings/settings-checkbox";
import { SettingsStatusIndicator } from "@components/layout/desktop/settings/settings-status-indicator";
import { SettingsTitle } from "@components/layout/desktop/settings/settings-title";
import { Button } from "@components/ui/button";
import { PasswordInput } from "@components/ui/password-input";
import { TextInput } from "@components/ui/text-input";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import { IconSquareRoundedCheckFilled, IconSquareRoundedXFilled } from "@tabler/icons-react";
import { useEffect, useReducer, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { Library } from "../../ipc.types";

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

  const onSyncClick = () => window.ipc.sync.syncGames();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-black text-white">{t("settings.library.general")}</h3>
      <div className="flex items-center justify-between py-2 border-b border-white/5">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#a0a7a9]">{t("settings.library.syncLibrary")} </label>
          <span className="text-[10px] text-neutral-500 italic">
            {t("settings.library.lastSync", {
              formatParams: {
                val: { dateStyle: "short", timeStyle: "short" },
              },
              val: "TODO",
            })}
          </span>
        </div>
        <Button
          variant="ghost"
          className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
          onClick={onSyncClick}
          size="sm"
        >
          {t("settings.library.syncLibrary")}
        </Button>
      </div>
      <SettingsCheckbox
        checked={syncOnStartup}
        label={t("settings.library.syncOnStartup")}
        labelInfo={t("settings.library.syncOnStartupInfo")}
        onCheckboxChange={setSyncOnStartup}
      />
    </div>
  );
};

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
    void window.ipc.sync.authIntegration("steam", { steamId, webApiKey });
  };

  const onTest = async () => {
    setIsLoading(true);
    await window.ipc.sync.testIntegration("steam");
    setIsLoading(false);
  };

  const Subtitle = (
    <Trans
      components={{
        SteamAccountLink: (
          <a
            className="text-cyan-500 hover:underline"
            href="https://store.steampowered.com/account/"
            rel="noreferrer"
            target="_blank"
          />
        ),
        SteamApiKeyLink: (
          <a
            className="text-cyan-500 hover:underline"
            href="https://steamcommunity.com/dev/apikey"
            rel="noreferrer"
            target="_blank"
          />
        ),
      }}
      i18nKey="steam.integrationGuide"
      t={t}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <SettingsTitle subtitle={Subtitle} title="Steam" />

      <SettingsCheckbox
        checked={steamIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("steam")}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          disabled={isLoading}
          label={t("steam.id")}
          onChange={(event) => setSteamId(event.target.value)}
          placeholder={t("steam.id")}
          value={steamId}
        />
        <PasswordInput
          disabled={isLoading}
          label={t("steam.webApiKey")}
          onChange={(event) => setWebApiKey(event.target.value)}
          placeholder={t("steam.webApiKey")}
          value={webApiKey}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <SettingsStatusIndicator
            icon={IconSquareRoundedCheckFilled}
            iconProps={{ className: "text-green-500" }}
            mounted={isValid === true}
            text={t("common.success")}
          />
          <SettingsStatusIndicator
            icon={IconSquareRoundedXFilled}
            iconProps={{ className: "text-red-500" }}
            mounted={isValid === false}
            text={t("common.failure")}
          />
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!steamId || (!hasStoredWebApiKey && !webApiKey)}
            isLoading={isLoading}
            onClick={onTest}
            size="sm"
            variant="ghost"
          >
            {t("settings.integration.test")}
          </Button>
          <Button disabled={isLoading || isValid === false} onClick={onAuthenticate} size="sm">
            {t("settings.integration.authenticate")}
          </Button>
        </div>
      </div>
    </div>
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
    void window.ipc.sync.authIntegration("epic-game-store");
  };

  const onTest = async () => {
    setIsLoading(true);
    await window.ipc.sync.testIntegration("epic-game-store");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsTitle subtitle={t("settings.library.authSecurity", { library: "Epic Games" })} title="Epic Games" />
      <SettingsCheckbox
        checked={epicIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("epic-game-store")}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <SettingsStatusIndicator
            icon={IconSquareRoundedCheckFilled}
            iconProps={{ className: "text-green-500" }}
            mounted={isValid === true}
            text={t("common.success")}
          />
          <SettingsStatusIndicator
            icon={IconSquareRoundedXFilled}
            iconProps={{ className: "text-red-500" }}
            mounted={isValid === false}
            text={t("common.failure")}
          />
        </div>
        <div className="flex gap-2">
          <Button disabled={isLoading} isLoading={isLoading} onClick={onTest} size="sm" variant="ghost">
            {t("settings.integration.test")}
          </Button>

          <Button disabled={isLoading} isLoading={isLoading} onClick={onAuthenticate} size="sm">
            {t("settings.integration.authenticate")}
          </Button>
        </div>
      </div>
    </div>
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
    void window.ipc.sync.authIntegration("gog");
  };

  const onTest = async () => {
    setIsLoading(true);
    await window.ipc.sync.testIntegration("gog");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsTitle subtitle={t("settings.library.authSecurity", { library: "GOG" })} title="GOG" />
      <SettingsCheckbox
        checked={gogIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("gog")}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <SettingsStatusIndicator
            icon={IconSquareRoundedCheckFilled}
            iconProps={{ className: "text-green-500" }}
            mounted={isValid === true}
            text={t("common.success")}
          />
          <SettingsStatusIndicator
            icon={IconSquareRoundedXFilled}
            iconProps={{ className: "text-red-500" }}
            mounted={isValid === false}
            text={t("common.failure")}
          />
        </div>
        <div className="flex gap-2">
          <Button disabled={isLoading} isLoading={isLoading} onClick={onTest} size="sm" variant="ghost">
            {t("settings.integration.test")}
          </Button>

          <Button isLoading={isLoading} onClick={onAuthenticate} size="sm">
            {t("settings.integration.authenticate")}
          </Button>
        </div>
      </div>
    </div>
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
    void window.ipc.sync.authIntegration("battle-net");
  };

  const onTest = async () => {
    setIsLoading(true);
    await window.ipc.sync.testIntegration("battle-net");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsTitle subtitle={t("settings.library.authSecurity", { library: "Battle.net" })} title="Battle.net" />
      <SettingsCheckbox
        checked={battleNetIntegrationEnabled}
        disabled={isLoading}
        label={t("common.enabled")}
        onCheckboxChange={() => toggleIntegrationEnabled("battle-net")}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <SettingsStatusIndicator
            icon={IconSquareRoundedCheckFilled}
            iconProps={{ className: "text-green-500" }}
            mounted={isValid === true}
            text={t("common.success")}
          />
          <SettingsStatusIndicator
            icon={IconSquareRoundedXFilled}
            iconProps={{ className: "text-red-500" }}
            mounted={isValid === false}
            text={t("common.failure")}
          />
        </div>
        <div className="flex gap-2">
          <Button disabled={isLoading} isLoading={isLoading} onClick={onTest} size="sm" variant="ghost">
            {t("settings.integration.test")}
          </Button>

          <Button isLoading={isLoading} onClick={onAuthenticate} size="sm">
            {t("settings.integration.authenticate")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const IntegrationsView = () => {
  const [validationState, dispatch] = useReducer(validationReducer, initialValidationState);

  useEffect(() => {
    const removeListener = window.api.onIntegrationAuthenticationResult((_event: unknown, { library, success }) => {
      dispatch({ library, success, type: "SET_VALIDATION" });
    });
    return () => removeListener();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12 pr-4">
      <GeneralSettings />
      <hr className="border-white/5" />
      <SteamSettings isValid={validationState.steam} />
      <hr className="border-white/5" />
      <EpicGamesSettings isValid={validationState["epic-game-store"]} />
      <hr className="border-white/5" />
      <GogSettings isValid={validationState.gog} />
      <hr className="border-white/5" />
      <BattleNetSettings isValid={validationState["battle-net"]} />
    </div>
  );
};
