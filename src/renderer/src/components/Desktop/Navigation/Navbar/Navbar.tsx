import { NavbarLink } from "@components/Desktop/Navigation/NavbarLink/NavbarLink";
import { QuickAccessList } from "@components/Desktop/QuickAccess/QuickAccessList/QuickAccessList";
import Logo from "@components/Logo/Logo";
import { AppShell, Card, Flex, ScrollArea, Stack } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconBooks, IconCategory, IconDeviceGamepad, IconHome } from "@tabler/icons-react";
import { useShallow } from "zustand/react/shallow";

import classes from "./Navbar.module.css";

export const Navbar = () => {
  const collections = useGameStore(useShallow((state) => state.collections));

  return (
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
              {collections.map((collection) => (
                <NavbarLink
                  href={`/desktop/collections/${collection._id}`}
                  icon={IconDeviceGamepad}
                  key={collection._id}
                  label={collection.name}
                />
              ))}
            </NavbarLink>
          </Stack>

          <QuickAccessList className={classes.quickAccess} />
        </ScrollArea>
      </Card>
    </AppShell.Navbar>
  );
};
