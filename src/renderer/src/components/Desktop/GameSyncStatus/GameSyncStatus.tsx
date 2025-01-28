import { GameSyncAction, GameSyncMessage } from "@contracts/sync";
import { useGameSync } from "@hooks/use-game-sync-status";
import { ActionIcon, Center, Group, Loader, RingProgress, Text, Title, Transition } from "@mantine/core";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { IconBrandSteam, IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { CSSProperties, FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameSyncStatus.module.css";

// TODO: This component is a bit messy, needs a cleanup

type GameSyncStatusProps = {
  className?: string;
};

type MessageProps = {
  className?: string;
  message: GameSyncMessage;
  onClose?: () => void;
  styles?: CSSProperties;
};

type ContainerProps = GameSyncStatusProps & {
  closable?: boolean;
  description?: ReactNode;
  leftSection: ReactNode;
  onClose?: () => void;
  styles?: CSSProperties;
  title: ReactNode;
};

const Container = ({ className, closable, description, leftSection, onClose, styles, title }: ContainerProps) => (
  <Group className={clsx(classes.container, className)} style={styles}>
    <Group className={classes.leftSection}>
      {leftSection}
      <div>
        <Title order={5} size="sm">
          {title}
        </Title>
        {description && <Group gap="4px">{description}</Group>}
      </div>
    </Group>
    {closable && (
      <ActionIcon onClick={onClose} radius="sm" size="xs" style={{ alignSelf: "flex-start" }}>
        <IconX size={10} />
      </ActionIcon>
    )}
  </Group>
);

const SyncingLibrary = ({ className, message, styles }: MessageProps) => {
  if (message.action !== "library") return null;
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

const SyncComplete = ({ className, message, onClose, styles }: MessageProps) => {
  if (message.action !== "complete") return null;
  const { hasFailures, total } = message;
  return (
    <Container
      className={className}
      closable
      description={<Text size="sm">{total} games added</Text>}
      leftSection={
        <RingProgress
          label={
            <Center>
              <ActionIcon color={hasFailures ? "orange" : "teal"} radius="xl" size="xs" variant="light">
                {hasFailures ? <IconExclamationMark size={12} stroke={3} /> : <IconCheck size={12} stroke={2} />}
              </ActionIcon>
            </Center>
          }
          sections={[{ color: hasFailures ? "orange" : "teal", value: 100 }]}
          size={40}
          thickness={4}
          transitionDuration={350}
        />
      }
      onClose={onClose}
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
  complete: SyncComplete,
  library: SyncingLibrary,
  metadata: SyncingMetadata,
};

export const GameSyncStatus = ({ className }: GameSyncStatusProps) => {
  const message = useGameSync();
  const [open, setOpen] = useState(false);

  const Component = useMemo(() => message?.action && messageActionMap[message.action], [message]);

  useEffect(() => {
    if (!Component) return;
    setOpen(true);
  }, [Component]);

  return (
    <Transition duration={400} mounted={open} timingFunction="ease" transition="slide-up">
      {(styles) =>
        Component ? (
          <Component className={className} message={message!} onClose={() => setOpen(false)} styles={styles} />
        ) : (
          <></>
        )
      }
    </Transition>
  );
};
