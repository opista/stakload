import { ActionIcon, Tooltip } from "@mantine/core";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconProps } from "@tabler/icons-react";
import clsx from "clsx";
import { FC } from "react";

import classes from "./CollectionButton.module.css";

type CollectionButtonProps = {
  icon: FC<IconProps>;
  name: string;
  onFocus?: () => void;
  onSelect?: () => void;
};

export const CollectionButton = ({ icon: Icon, name, onFocus, onSelect }: CollectionButtonProps) => {
  const { focused, ref } = useFocusable({
    focusKey: name,
    focusable: true,
    onEnterPress: onSelect,
    onFocus: () => {
      console.log("focus collection button");
      onFocus?.();
    },
  });

  return (
    <Tooltip
      className={classes.tooltip}
      color="gray"
      label={name}
      offset={0}
      opened={focused}
      position="right"
      transitionProps={{ duration: 300, transition: "fade-right" }}
    >
      <ActionIcon
        className={clsx(classes.button, { [classes.focused]: focused })}
        radius="lg"
        ref={ref}
        size={60}
        variant="default"
      >
        <Icon size="70%" />
      </ActionIcon>
    </Tooltip>
  );
};
