import { Tooltip, UnstyledButton } from "@mantine/core";
import { useNetwork } from "@mantine/hooks";
import { IconProps, IconWifi, IconWifiOff } from "@tabler/icons-react";
import { ParseKeys } from "i18next";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import classes from "./NetworkIndicator.module.css";

type NetworkConfig = {
  icon: FC<IconProps>;
  iconColor?: string;
  label: ParseKeys;
};

const NETWORK_CONFIG_MAP: { [key: string]: NetworkConfig } = {
  offline: {
    icon: IconWifiOff,
    iconColor: "var(--mantine-color-red-8)",
    label: "network.offline",
  },
  online: {
    icon: IconWifi,
    label: "network.online",
  },
} as const;

export const NetworkIndicator = () => {
  const { t } = useTranslation();
  const { online } = useNetwork();

  const config = online ? NETWORK_CONFIG_MAP.online : NETWORK_CONFIG_MAP.offline;
  const { icon: Icon, iconColor, label } = config;

  return (
    <Tooltip events={{ focus: true, hover: true, touch: false }} label={t(label)} withArrow>
      <UnstyledButton className={classes.button}>
        <Icon color={iconColor} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
};
