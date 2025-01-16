import { GamesFilter } from "@components/GamesFilter/GamesFilter";
import { Select, SelectProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
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
      rightSection={<GamesFilter />}
      rightSectionPointerEvents="all"
      searchable
      size="md"
    />
  );
};
