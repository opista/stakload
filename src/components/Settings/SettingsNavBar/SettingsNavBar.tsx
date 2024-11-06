import { ScrollArea } from "@mantine/core";
import { IconLibrary, IconDeviceImac, IconUser } from "@tabler/icons-react";
import classes from "./SettingsNavBar.module.css";
import { LinksGroup } from "../../Navigation/NavBarLinksGroup/NavBarLinksGroup";

const settingsMenuItems = [
  { label: "Interface", icon: IconDeviceImac, link: "/interface" },
  {
    label: "Library",
    icon: IconLibrary,
    links: [
      { label: "Battle.net", link: "/library/battle-net" },
      { label: "EA", link: "/library/ea" },
      { label: "Epic Games", link: "/library/epic-games" },
      { label: "Steam", link: "/library/steam" },
      { label: "Ubisoft Connect", link: "/library/ubisoft-connect" },
    ],
  },
  {
    label: "About",
    icon: IconUser,
    link: "/about",
  },
];

export const SettingsNavBar = () => {
  const links = settingsMenuItems.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links}>
        <div>{links}</div>
      </ScrollArea>
    </nav>
  );
};
