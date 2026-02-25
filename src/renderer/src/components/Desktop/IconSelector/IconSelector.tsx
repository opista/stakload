import * as icons from "@icons/index";
import { filterIcons, IconSearch } from "@icons/index";
import { Card, Popover, TextInput } from "@mantine/core";
import { upperFirst } from "lodash-es";
import { ReactNode, useMemo, useState } from "react";
import { CellComponentProps, Grid } from "react-window";

import classes from "./IconSelector.module.css";

type IconSelectorProps = {
  children: ReactNode;
  onSelect?: (iconName: string) => void;
  selectedIcon?: string;
};

const COLUMN_COUNT = 6;
const ITEM_SIZE = 60;

type IconData = { name: string; category?: string; tags?: string[] };

type CellProps = {
  filteredIcons: IconData[];
  onSelect?: (iconName: string) => void;
  selectedIcon?: string;
};

const Cell = ({
  columnIndex,
  filteredIcons,
  onSelect,
  rowIndex,
  selectedIcon,
  style,
}: CellComponentProps<CellProps>) => {
  const index = rowIndex * COLUMN_COUNT + columnIndex;
  if (index >= filteredIcons.length) return null;

  const iconData = filteredIcons[index];
  const iconKey = ["icon", ...iconData.name.split("-")].map(upperFirst).join("");
  const Icon = icons[iconKey];

  return (
    <div style={style}>
      <Card
        onClick={() => onSelect?.(Icon.displayName)}
        padding="xs"
        style={{
          alignItems: "center",
          backgroundColor: selectedIcon === Icon.displayName ? "var(--mantine-primary-color-filled-hover)" : undefined,
          cursor: "pointer",
          display: "flex",
          height: ITEM_SIZE,
          justifyContent: "center",
          width: ITEM_SIZE,
        }}
        title={iconData.name}
      >
        <Icon size={24} />
      </Card>
    </div>
  );
};

export const IconSelector = ({ children, onSelect, selectedIcon }: IconSelectorProps) => {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => filterIcons(search) as IconData[], [search]);

  const rowCount = Math.ceil(filteredIcons.length / COLUMN_COUNT);

  return (
    <Popover
      arrowPosition="center"
      closeOnEscape
      onClose={() => setSearch("")}
      position="bottom-start"
      shadow="md"
      trapFocus
      withArrow
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <TextInput
          className={classes.input}
          leftSection={<IconSearch size={16} />}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search icons"
          value={search}
        />
        <Grid
          cellComponent={Cell}
          cellProps={{ filteredIcons, onSelect, selectedIcon }}
          columnCount={COLUMN_COUNT}
          columnWidth={ITEM_SIZE}
          overscanCount={7}
          rowCount={rowCount}
          rowHeight={ITEM_SIZE}
          style={{ height: 400, width: COLUMN_COUNT * ITEM_SIZE + 6 }}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
