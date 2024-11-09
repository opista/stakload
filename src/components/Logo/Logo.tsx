import { MantineSize, Text } from "@mantine/core";
import classes from "./Logo.module.css";

type LogoProps = {
  size?: MantineSize;
  useGradient?: boolean;
};

export const Logo = ({ size = "xl", useGradient = true }: LogoProps = {}) => (
  <Text
    className={classes.logo}
    gradient={{ from: "grape", to: "blue", deg: 156 }}
    size={size}
    variant={useGradient ? "gradient" : "text"}
  >
    Trulaunch
  </Text>
);
