import Logo from "@components/Logo/Logo";
import { NavbarLink } from "@components/NavbarLink/NavbarLink";
import { QuickAccess } from "@components/QuickAccess/QuickAccess";
import { AppShell, Card, Flex, ScrollArea, Stack } from "@mantine/core";
import { IconBooks, IconBrandSteam, IconCategory, IconFriends, IconHome } from "@tabler/icons-react";

import { IconEpicGames } from "../../icons/IconEpicGames";
import classes from "./Navbar.module.css";

export const Navbar = () => (
  <AppShell.Navbar className={classes.navbar}>
    <Card className={classes.card}>
      <Flex className={classes.logoContainer}>
        <Logo />
      </Flex>
      <ScrollArea>
        <Stack gap="xs">
          <NavbarLink href="/desktop" icon={IconHome} label="Home" />
          <NavbarLink href="/desktop/games" icon={IconCategory} label="Library" />
          <NavbarLink icon={IconBooks} label="Collections">
            <NavbarLink href="/desktop/collections/steam-games" icon={IconBrandSteam} label="Steam games" />
            <NavbarLink href="/desktop/collections/epic-games" icon={IconEpicGames} label="Epic games" />
            <NavbarLink href="/desktop/collections/steam-games" icon={IconFriends} label="Split-screen co-op" />
          </NavbarLink>
        </Stack>

        <QuickAccess className={classes.quickAccess} />
      </ScrollArea>
    </Card>
  </AppShell.Navbar>
);
