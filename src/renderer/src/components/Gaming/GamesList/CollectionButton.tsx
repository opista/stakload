import { CollectionStoreModel } from "@contracts/database/collections";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconDeviceGamepad } from "@tabler/icons-react";
import clsx from "clsx";

import classes from "./CollectionButton.module.css";

type CollectionButtonProps = {
  collection: CollectionStoreModel;
  onFocus?: () => void;
  onSelect?: () => void;
};

export const CollectionButton = ({ collection, onFocus, onSelect }: CollectionButtonProps) => {
  const { focused, ref } = useFocusable({
    focusKey: collection.name,
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
      label={collection.name}
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
        <IconDeviceGamepad size="70%" />
      </ActionIcon>
    </Tooltip>
  );
};
