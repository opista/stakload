import { Stack } from "@mantine/core";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useCollectionStore } from "@store/collection.store";
import { IconDeviceGamepad, IconProps } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import { FC, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { CollectionButton } from "./CollectionButton";

const FOCUS_KEY = "COLLECTION_BUTTONS";

export const Collections = () => {
  const { focusKey, ref } = useFocusable({
    autoRestoreFocus: true,
    focusable: true,
    focusBoundaryDirections: ["up", "down"],
    focusKey: FOCUS_KEY,
    isFocusBoundary: true,
    onArrowPress: () => true,
    preferredChildFocusKey: undefined,
    saveLastFocusedChild: false,
    trackChildren: true,
  });

  const collections = useCollectionStore(useShallow((state) => state.collections));

  const iconCache = useMemo(() => {
    const cache = new Map<string, FC<IconProps>>();

    collections.forEach((collection) => {
      if (collection.icon && !cache.has(collection.icon)) {
        cache.set(collection.icon, importDynamicIcon(collection.icon) || IconDeviceGamepad);
      }
    });

    return cache;
  }, [collections]);

  return (
    <FocusContext.Provider value={focusKey}>
      <Stack gap="md" ref={ref}>
        {collections.map((collection) => (
          <CollectionButton
            icon={collection.icon ? iconCache.get(collection.icon) || IconDeviceGamepad : IconDeviceGamepad}
            key={collection.name}
            name={collection.name}
          />
        ))}
      </Stack>
    </FocusContext.Provider>
  );
};
