import { CollectionCreateModal } from "@components/CollectionCreateModal/CollectionCreateModal";
import { FilterControl } from "@components/Desktop/FilterControl/FilterControl";
import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameFilters } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { Group, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { IconCategory } from "@tabler/icons-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const LibraryView = () => {
  const createCollection = useCollectionStore(useShallow((state) => state.createCollection));
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const [openedCreate, { close: closeCreate, open: openCreate }] = useDisclosure(false);
  const [filters, setFilters] = useState<GameFilters>({});
  const { data: games = [] } = useGamesQuery(() => fetchFilteredGames(filters), [filters]);

  const onCreate = async (name: string, icon?: string) => {
    if (!filters) return;
    await createCollection({ filters, icon, name });
    closeCreate();
  };

  return (
    <>
      <Stack h="100%" w="100%">
        <SectionHeading direction="column" gap="md">
          <Group>
            <IconCategory size={40} />
            <Title order={1}>Library</Title>
          </Group>
          <FilterControl onChange={setFilters} onCreate={openCreate} />
        </SectionHeading>
        <GamesGrid games={games} />
      </Stack>
      <CollectionCreateModal onClose={() => closeCreate()} onConfirm={onCreate} opened={openedCreate} />
    </>
  );
};
