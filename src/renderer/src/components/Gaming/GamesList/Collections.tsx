import { Stack } from "@mantine/core";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

import { CollectionButton } from "./CollectionButton";

const FOCUS_KEY = "COLLECTION_BUTTONS";

export const Collections = () => {
  const { ref, focusKey } = useFocusable({
    autoRestoreFocus: true,
    focusBoundaryDirections: ["up", "down"],
    focusKey: FOCUS_KEY,
    focusable: true,
    isFocusBoundary: true,
    onArrowPress: () => true,
    preferredChildFocusKey: undefined,
    saveLastFocusedChild: false,
    trackChildren: true,
  });

  const collections = useGameStore(useShallow((state) => state.collections));

  return (
    <FocusContext.Provider value={focusKey}>
      <Stack gap="md" ref={ref}>
        {collections.map((collection) => (
          <CollectionButton collection={collection} key={collection.name} />
        ))}
      </Stack>
    </FocusContext.Provider>
  );
};
