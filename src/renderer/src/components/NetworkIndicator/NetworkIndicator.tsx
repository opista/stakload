import { Tooltip, UnstyledButton } from "@mantine/core";
import { useNetwork } from "@mantine/hooks";
import { Icon, IconWifi, IconWifiOff } from "@tabler/icons-react";
import { ParseKeys } from "i18next";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import classes from "./NetworkIndicator.module.css";

type NetworkConfig = {
  Icon: Icon;
  iconColor?: string;
  label: ParseKeys;
};

const NETWORK_CONFIG_MAP: { [key: string]: NetworkConfig } = {
  offline: {
    Icon: IconWifiOff,
    iconColor: "var(--mantine-color-red-8)",
    label: "network.offline",
  },
  online: {
    Icon: IconWifi,
    label: "network.online",
  },
} as const;

const NetworkIndicator = memo(() => {
  const { t } = useTranslation();
  const { online } = useNetwork();

  const config = online ? NETWORK_CONFIG_MAP.online : NETWORK_CONFIG_MAP.offline;
  const { label, Icon, iconColor } = config;

  return (
    <Tooltip events={{ focus: true, hover: true, touch: false }} label={t(label)} withArrow>
      <UnstyledButton className={classes.button}>
        <Icon color={iconColor} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
});

NetworkIndicator.displayName = "NetworkIndicator";

export default NetworkIndicator;
