import { Tooltip } from "@mantine/core";
import { useNetwork } from "@mantine/hooks";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const NetworkIndicator = () => {
  const { t } = useTranslation();
  const { online } = useNetwork();

  if (online) {
    return (
      <Tooltip label={t("network.online")}>
        <IconWifi stroke={1.5} />
      </Tooltip>
    );
  } else {
    return (
      <Tooltip label={t("network.offline")}>
        <IconWifiOff color="red" stroke={1.5} />
      </Tooltip>
    );
  }
};
