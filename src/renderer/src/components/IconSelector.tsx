import { Card, CSSProperties } from "@mantine/core";
import { FixedSizeGrid } from "react-window";

import { IconBrandEpicGames, IconBrandGog, IconBrandSteam, IconBrandXbox, IconDeviceGamepad } from "../icons";

type IconSelectorProps = {
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
};

const icons = [IconBrandSteam, IconBrandEpicGames, IconBrandXbox, IconBrandGog, IconDeviceGamepad];

const IconSelector = ({ onSelect, selectedIcon }: IconSelectorProps) => {
  const COLUMN_COUNT = 3;
  const ITEM_SIZE = 60;
  const ROW_COUNT = Math.ceil(icons.length / COLUMN_COUNT);

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: CSSProperties }) => {
    const index = rowIndex * COLUMN_COUNT + columnIndex;
    if (index >= icons.length) return null;

    const Icon = icons[index];

    return (
      <div style={style}>
        <Card
          onClick={() => onSelect(Icon.displayName!)}
          padding="xs"
          shadow="sm"
          style={{
            alignItems: "center",
            backgroundColor: selectedIcon === Icon.displayName ? "var(--mantine-color-blue-1)" : undefined,
            cursor: "pointer",
            display: "flex",
            height: ITEM_SIZE,
            justifyContent: "center",
            width: ITEM_SIZE,
          }}
        >
          <Icon size={24} />
        </Card>
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={COLUMN_COUNT}
      columnWidth={ITEM_SIZE}
      height={400}
      rowCount={ROW_COUNT}
      rowHeight={ITEM_SIZE}
      width={400}
    >
      {Cell}
    </FixedSizeGrid>
  );
};

export default IconSelector;
