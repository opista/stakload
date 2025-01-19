import { AppShell, Flex } from "@mantine/core";

import { PowerButton } from "../Power/PowerButton/PowerButton";
import { SearchInput } from "../SearchInput/SearchInput";
import classes from "./Header.module.css";

export const Header = () => (
  <AppShell.Header className={classes.header}>
    <Flex className={classes.container} direction="column">
      <Flex justify="space-between">
        <SearchInput className={classes.search} />
        <PowerButton />
      </Flex>
    </Flex>
  </AppShell.Header>
);
