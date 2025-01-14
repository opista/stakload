import { ActionIcon } from "@mantine/core";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconProps } from "@tabler/icons-react";
import clsx from "clsx";
import { FC } from "react";

import classes from "./HeaderButton.module.css";

type HeaderButtonProps = {
  icon: FC<IconProps>;
  onFocus?: () => void;
  onSelect?: () => void;
};

export const HeaderButton = ({ icon: Icon, onFocus, onSelect }: HeaderButtonProps) => {
  const { focused, ref } = useFocusable({
    focusable: true,
    focusKey: `HEADER-BUTTON-${Icon.displayName}`,
    onEnterPress: onSelect,
    onFocus: () => {
      console.log("focus", Icon.displayName);
      onFocus?.();
    },
  });

  return (
    <ActionIcon className={clsx(classes.button, { [classes.focused]: focused })} ref={ref} size={42} variant="default">
      <Icon size={24} />
    </ActionIcon>
  );
};
