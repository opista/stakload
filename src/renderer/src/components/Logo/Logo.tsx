import { Box, MantineSize, Text } from "@mantine/core";
import clsx from "clsx";
import { memo } from "react";

import classes from "./Logo.module.css";

type LogoProps = {
  size?: MantineSize;
  useGradient?: boolean;
};

const Logo = memo(({ size = "xl", useGradient = true }: LogoProps) => (
  <Box className={classes.container}>
    <Text className={clsx(classes.logo, useGradient && classes.gradient)} size={size}>
      Trulaunch
    </Text>
  </Box>
));

Logo.displayName = "Logo";

export default Logo;
