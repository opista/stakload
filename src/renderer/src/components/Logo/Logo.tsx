import { Box, MantineSize, Text } from "@mantine/core";
import { memo } from "react";

import classes from "./Logo.module.css";

type LogoProps = {
  size?: MantineSize;
  useGradient?: boolean;
};

const DEFAULT_GRADIENT = { from: "grape", to: "blue", deg: 156 };

const Logo = memo(({ size = "xl", useGradient = true }: LogoProps) => (
  <Box className={classes.container}>
    <Text className={classes.logo} gradient={DEFAULT_GRADIENT} size={size} variant={useGradient ? "gradient" : "text"}>
      Trulaunch
    </Text>
  </Box>
));

Logo.displayName = "Logo";

export default Logo;
