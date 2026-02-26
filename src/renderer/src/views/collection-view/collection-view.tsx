import { GamesGrid } from "@components/game/games-grid";
import { CollectionTitle } from "@components/layout/desktop/collection-title";
import { FilterControl } from "@components/layout/desktop/filter-control";
import { SectionHeading } from "@components/layout/desktop/section-heading";
import { ActionIcon } from "@components/ui/action-icon";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import { GameFilters } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

export const CollectionView = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const { collection, deleteCollection } = useCollectionStore(
    useShallow((state) => ({
      collection: state.collections.find((c) => c._id === id),
      deleteCollection: state.deleteCollection,
    })),
  );
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));

  const [filters, setFilters] = useState<GameFilters>({ ...collection?.filters });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: games = [] } = useGamesQuery(() => fetchFilteredGames(filters), [filters]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
    setFilters({ ...collection?.filters });
  }, [id, collection?.filters]);

  if (!collection) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h3 className="text-2xl font-black text-neutral-500">{t("collection.notFound")}</h3>
      </div>
    );
  }

  const onDeleteConfirm = async () => {
    await deleteCollection(collection._id);
    navigate("/library");
  };

  return (
    <>
      <div className="flex h-full w-full flex-col gap-4 overflow-hidden" ref={containerRef}>
        <SectionHeading className="flex-col !items-stretch gap-4">
          <div className="flex items-center justify-between">
            <CollectionTitle collection={collection} />
            <div className="flex items-center gap-2">
              <ActionIcon
                aria-label={t("settingsButton.title")}
                onClick={() => setShowDeleteModal(true)}
                title={"delete"}
                variant="subtle"
              >
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </div>
          </div>
          <FilterControl collection={collection} onChange={setFilters} />
        </SectionHeading>
        <GamesGrid games={games} />
      </div>

      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Delete ${collection.name}`}
        size="sm"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium leading-relaxed text-neutral-300">
            Are you sure you want to delete this collection? This action is irreversible.
          </p>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowDeleteModal(false)} variant="default">
              Cancel
            </Button>
            <Button onClick={onDeleteConfirm} variant="danger">
              Delete Collection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

