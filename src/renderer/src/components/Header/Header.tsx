import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { BatteryIndicator } from "@components/BatteryIndicator/BatteryIndicator";
import { Clock } from "@components/Clock/Clock";
import { Logo } from "@components/Logo/Logo";
import { NetworkIndicator } from "@components/NetworkIndicator/NetworkIndicator";
import { PowerControl } from "@components/Power/PowerControl/PowerControl";
import { SettingsControl } from "@components/Settings/SettingsControl/SettingsControl";
import { Divider, Group } from "@mantine/core";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { GameSync } from "../GameSync/GameSync";
import classes from "./Header.module.css";

type HeaderProps = {
  leftPaneWidth: number;
  onToggleLeftPane?: () => void;
  showLeftPane: boolean;
};

export const Header = ({ leftPaneWidth, onToggleLeftPane, showLeftPane }: HeaderProps) => {
  const { displayBattery, displayBatteryPercent, displayNetwork, displayTime, displaySeconds } =
    useInterfaceSettingsStore(
      useShallow((state) => ({
        displayBattery: state.displayBattery,
        displayBatteryPercent: state.displayBatteryPercent,
        displayNetwork: state.displayNetwork,
        displayTime: state.displayTime,
        displaySeconds: state.displaySeconds,
      })),
    );
  const { t } = useTranslation();

  return (
    <Group className={classes.container} justify="space-between" wrap="nowrap">
      <Group className={classes.leftContainer} justify="space-between" maw={leftPaneWidth}>
        <Logo />
        <ActionIcon
          aria-label={t("toggleLeftPane")}
          icon={showLeftPane ? IconLayoutSidebarLeftCollapse : IconLayoutSidebarLeftExpand}
          onClick={onToggleLeftPane}
        />
      </Group>

      <Group className={classes.rightContainer} gap="md">
        <GameSync />
        {displayTime && (
          <>
            <Divider orientation="vertical" size="xs" />
            <Clock showSeconds={displaySeconds} />
          </>
        )}
        {displayBattery && (
          <>
            <Divider orientation="vertical" size="xs" />
            <BatteryIndicator showPercentage={displayBatteryPercent} />
          </>
        )}
        {displayNetwork && (
          <>
            <Divider orientation="vertical" size="xs" />
            <NetworkIndicator />
          </>
        )}
        <Divider orientation="vertical" size="xs" />
        <Group gap="xs">
          <SettingsControl />
          <PowerControl />
        </Group>
      </Group>
    </Group>
  );
};
