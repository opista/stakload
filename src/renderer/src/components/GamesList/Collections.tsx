import { CollectionStoreModel } from "@contracts/database/collections";
import { useCollectionsQuery } from "@hooks/use-collections-query";
import { Stack } from "@mantine/core";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";

import { CollectionButton } from "./CollectionButton";

const FOCUS_KEY = "COLLECTION_BUTTONS";

export const Collections = () => {
  const { ref, focusKey } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    focusBoundaryDirections: ["up", "down"],
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: true,
    focusKey: FOCUS_KEY,
    preferredChildFocusKey: undefined,
    onArrowPress: () => true,
  });

  const { data: collections = [] } = useCollectionsQuery<CollectionStoreModel[]>(() => window.api.getCollections());

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
