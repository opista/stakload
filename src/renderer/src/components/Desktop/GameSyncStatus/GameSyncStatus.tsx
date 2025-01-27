import { GameSyncAction, GameSyncMessage } from "@contracts/sync";
import { useGameSync } from "@hooks/use-game-sync-status";
import { ActionIcon, Center, Group, Loader, RingProgress, Text, Title, Transition } from "@mantine/core";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { IconBrandSteam, IconCheck } from "@tabler/icons-react";
import clsx from "clsx";
import { CSSProperties, FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameSyncStatus.module.css";

type GameSyncStatusProps = {
  className?: string;
};

type MessageProps = {
  className?: string;
  message: GameSyncMessage;
  styles?: CSSProperties;
};

type ContainerProps = GameSyncStatusProps & {
  description?: ReactNode;
  leftSection: ReactNode;
  styles?: CSSProperties;
  title: ReactNode;
};

const Container = ({ className, description, leftSection, styles, title }: ContainerProps) => (
  <Group className={clsx(classes.container, className)} style={styles}>
    {leftSection}
    <div>
      <Title order={5} size="sm">
        {title}
      </Title>
      {description && <Group gap="4px">{description}</Group>}
    </div>
  </Group>
);

const SyncingLibrary = ({ className, message, styles }: MessageProps) => {
  if (message.action !== "syncing") return null;
  return (
    <Container
      className={className}
      description={
        <>
          <IconBrandSteam size={16} />
          <Text size="sm">{message.library}</Text>
        </>
      }
      leftSection={<Loader className={classes.loader} size={28} />}
      styles={styles}
      title="Syncing library"
    />
  );
};

const SyncingMetadata = ({ className, message, styles }: MessageProps) => {
  if (message.action !== "metadata") return null;
  return (
    <Container
      className={className}
      description={
        <Text size="sm">
          {message.processing} / {message.total}
        </Text>
      }
      leftSection={<Progress processing={message.processing} total={message.total} />}
      styles={styles}
      title="Fetching metadata"
    />
  );
};

const SyncComplete = ({ className, message, styles }: MessageProps) => {
  if (message.action !== "complete") return null;
  return (
    <Container
      className={className}
      leftSection={
        <RingProgress
          label={
            <Center>
              <ActionIcon color="teal" radius="xl" size="xs" variant="light">
                <IconCheck size={12} stroke={2} />
              </ActionIcon>
            </Center>
          }
          sections={[{ color: "teal", value: 100 }]}
          size={40}
          thickness={4}
          transitionDuration={350}
        />
      }
      styles={styles}
      title="Sync complete"
    />
  );
};

const Progress = ({ processing, total }: { processing: number; total: number }) => {
  const primaryColor = useInterfaceSettingsStore(useShallow((state) => state.theme));
  const percentage = (processing / total) * 100;
  const rounded = Math.round(percentage);
  return (
    <RingProgress
      rootColor="transparent"
      sections={[{ color: primaryColor, value: rounded }]}
      size={40}
      thickness={4}
      transitionDuration={350}
    />
  );
};

const messageActionMap: Record<GameSyncAction, FC<MessageProps> | null> = {
  cancelled: null,
  complete: SyncComplete,
  error: null,
  metadata: SyncingMetadata,
  syncing: SyncingLibrary,
};

export const GameSyncStatus = ({ className }: GameSyncStatusProps) => {
  const message = useGameSync();
  const [open, setOpen] = useState(false);

  const Component = useMemo(() => (message && messageActionMap[message.action])!, [message?.action]);

  useEffect(() => {
    if (!message) return;

    setOpen(true);

    if (message?.action === "complete") {
      setTimeout(() => setOpen(false), 5000);
    }
  }, [message]);

  return (
    <Transition duration={400} mounted={open} timingFunction="ease" transition="slide-up">
      {(styles) => <Component className={className} message={message!} styles={styles} />}
    </Transition>
  );
};
