import { TextInput } from "@components/ui/TextInput";
import * as icons from "@icons/index";
import { filterIcons, IconSearch } from "@icons/index";
import { cn } from "@util/cn";
import { upperFirst } from "lodash-es";
import { ReactNode, useMemo, useState } from "react";
import { CellComponentProps, Grid } from "react-window";

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
    <div style={style} className="flex items-center justify-center p-1">
      <div
        onClick={() => onSelect?.(Icon.displayName)}
        className={cn(
          "flex h-full w-full cursor-pointer items-center justify-center rounded-lg transition-colors",
          selectedIcon === Icon.displayName
            ? "bg-cyan-600 text-white"
            : "text-neutral-400 hover:bg-white/5 hover:text-white",
        )}
        title={iconData.name}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

export const IconSelector = ({ children, onSelect, selectedIcon }: IconSelectorProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = useMemo(() => filterIcons(search) as IconData[], [search]);

  const rowCount = Math.ceil(filteredIcons.length / COLUMN_COUNT);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[1100]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-[1200] mt-2 rounded-[2rem] bg-[#1b2c3b] p-6 shadow-2xl ring-1 ring-white/10">
            <TextInput
              className="mb-4"
              rightSection={<IconSearch className="text-neutral-500" size={16} />}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search icons..."
              value={search}
              autoFocus
            />
            <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
              <Grid
                cellComponent={Cell}
                cellProps={{
                  filteredIcons,
                  onSelect: (name) => {
                    onSelect?.(name);
                    setIsOpen(false);
                    setSearch("");
                  },
                  selectedIcon,
                }}
                columnCount={COLUMN_COUNT}
                columnWidth={ITEM_SIZE}
                overscanCount={7}
                rowCount={rowCount}
                rowHeight={ITEM_SIZE}
                style={{ height: 400, width: COLUMN_COUNT * ITEM_SIZE }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
