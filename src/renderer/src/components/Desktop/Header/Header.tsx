import { AppShell, Flex } from "@mantine/core";

import { PowerButton } from "../Power/PowerButton/PowerButton";
import { SearchInput } from "../SearchInput/SearchInput";
import { SettingsButton } from "../Settings/SettingsButton/SettingsButton";
import classes from "./Header.module.css";

export const Header = () => (
  <AppShell.Header className={classes.header}>
    <Flex className={classes.container} direction="column">
      <Flex justify="space-between">
        <SearchInput className={classes.search} />
        <Flex className={classes.actions}>
          <SettingsButton />
          <PowerButton />
        </Flex>
      </Flex>
    </Flex>
  </AppShell.Header>
);
