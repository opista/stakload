import {
  CompleteSyncMessage,
  ErrorSyncMessage,
  GameSyncAction,
  LibrarySyncMessage,
  MetadataSyncMessage,
} from "@contracts/sync";
import { useGameSync } from "@hooks/use-game-sync-status";
import { Group, Loader, Text } from "@mantine/core";
import { FC } from "react";

const Cancelled = () => <Text size="xs">Cancelled</Text>;
const Complete = ({ message: { processed, total } }: { message: CompleteSyncMessage }) => (
  <Text size="xs">
    Complete {processed} / {total}
  </Text>
);
const Error = ({ message: { code } }: { message: ErrorSyncMessage }) => <Text size="xs">Error {code}</Text>;
const Metadata = ({ message: { processing, total } }: { message: MetadataSyncMessage }) => (
  <Text size="xs">
    Fetching Metadata {processing} / {total}
  </Text>
);
const Syncing = ({ message: { library } }: { message: LibrarySyncMessage }) => <Text size="xs">Syncing {library}</Text>;

const syncStatusMap: Record<GameSyncAction, FC<{ message: any }>> = {
  [GameSyncAction.Cancelled]: Cancelled,
  [GameSyncAction.Complete]: Complete as FC<{ message: any }>,
  [GameSyncAction.Error]: Error as FC<{ message: any }>,
  [GameSyncAction.Metadata]: Metadata as FC<{ message: any }>,
  [GameSyncAction.Syncing]: Syncing as FC<{ message: any }>,
};

export const GameSync = () => {
  const message = useGameSync();

  if (!message) {
    return (
      <Group align="center">
        <Loader size={24} />
      </Group>
    );
  }

  const Component = syncStatusMap[message.action];

  return (
    <Group align="center">
      <Loader size={24} />
      <Component message={message} />
    </Group>
  );
};
