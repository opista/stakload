import { Group } from "@mantine/core";
import classes from "./Header.module.css";
import SearchControl from "../SearchControl/SearchControl";
import SettingsControl from "../SettingsControl/SettingsControl";
import ColorSchemeControl from "../ColorSchemeControl/ColorSchemeControl";

export default function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>LOGO</Group>

        <Group gap="xs">
          <SearchControl />
          <SettingsControl />
          <ColorSchemeControl />
        </Group>
      </div>
    </header>
  );
}
