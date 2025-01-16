import { ActionIcon, Select, SelectProps } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import classes from "./SearchInput.module.css";

export const SearchInput = ({ className, disabled }: SelectProps) => {
  const { t } = useTranslation();

  return (
    <Select
      className={className}
      classNames={{ input: classes.input, section: classes.section }}
      data={["React", "Angular", "Vue"]}
      disabled={disabled}
      leftSection={<IconSearch size={16} />}
      leftSectionPointerEvents="none"
      limit={5}
      placeholder={t("search")}
      rightSection={
        <ActionIcon className={classes.filtersButton}>
          <IconAdjustmentsHorizontal size={20} stroke={1} />
        </ActionIcon>
      }
      rightSectionPointerEvents="all"
      searchable
      size="md"
    />
  );
};
