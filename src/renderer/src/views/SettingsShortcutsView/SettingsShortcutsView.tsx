import { Kbd, Table } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

import classes from "./SettingsShortcutsView.module.css";

type ShortcutKey =
  | "settingsShortcuts.openSettings"
  | "settingsShortcuts.quitApplication"
  | "settingsShortcuts.searchLibrary";

const elements: { name: ShortcutKey; shortcuts: string[] }[] = [
  { name: "settingsShortcuts.openSettings", shortcuts: ["S"] },
  { name: "settingsShortcuts.quitApplication", shortcuts: ["Q"] },
  { name: "settingsShortcuts.searchLibrary", shortcuts: ["Ctrl", "K"] },
];

export const SettingsShortcutsView = () => {
  const { t } = useTranslation();
  const rows = elements.map(({ name, shortcuts }) => (
    <Table.Tr key={name}>
      <Table.Td>{t(name)}</Table.Td>
      <Table.Td className={classes.shortcutColumn}>
        {shortcuts.map((key, index) => (
          <Fragment key={index}>
            <Kbd>{key}</Kbd>
            {index < shortcuts.length - 1 && <span> + </span>}
          </Fragment>
        ))}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={classes.container}>
      <Table highlightOnHover striped="even">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("settingsShortcuts.action")}</Table.Th>
            <Table.Th className={classes.shortcutColumn}>{t("settingsShortcuts.shortcut")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};
