import { IconMoon, IconSun } from "@tabler/icons-react";
import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";

export default function ColorSchemeControl() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const nextMode = `${computedColorScheme === "dark" ? "Light" : "Dark"} mode`;

  return (
    <Tooltip label={nextMode}>
      <ActionIcon
        variant="default"
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        size="lg"
        radius="md"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === "light" ? (
          <IconMoon style={{ width: "22px", height: "22px" }} stroke={1.5} />
        ) : (
          <IconSun style={{ width: "22px", height: "22px" }} stroke={1.5} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
