import { Flex, Text, Transition } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";

type SettingsStatusIndicatorProps = {
  className?: string;
  icon: Icon;
  iconProps: IconProps;
  mounted: boolean;
  text: string;
};

export const SettingsStatusIndicator = ({
  className,
  icon: Icon,
  iconProps,
  mounted,
  text,
}: SettingsStatusIndicatorProps) => (
  <Transition duration={400} exitDuration={0} mounted={mounted} timingFunction="ease" transition="fade-left">
    {(styles) => (
      <Flex align="center" className={className} gap={4} style={styles}>
        <Icon {...iconProps} size={24} />
        <Text size="xs">{text}</Text>
      </Flex>
    )}
  </Transition>
);
