import { Kbd, Table } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import classes from "./ShortcutsView.module.css";
import { useTranslation } from "react-i18next";

const elements = [
  { name: "shortcutLabel.openSettings", shortcuts: ["Q"] },
  { name: "shortcutLabel.searchLibrary", shortcuts: ["Ctrl", "K"] },
];

export const ShortcutsView = () => {
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
    <Table highlightOnHover striped="even">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t("action")}</Table.Th>
          <Table.Th className={classes.shortcutColumn}>
            {t("shortcut")}
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
