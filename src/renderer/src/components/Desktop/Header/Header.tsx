import { AppShell } from "@mantine/core";

import { WindowControls } from "../WindowControls/WindowControls";

import classes from "./Header.module.css";

export const Header = () => (
  <AppShell.Header className={classes.header}>
    <WindowControls />
  </AppShell.Header>
);
