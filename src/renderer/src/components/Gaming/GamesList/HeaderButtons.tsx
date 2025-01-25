import { Flex } from "@mantine/core";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconCategory, IconHome, IconSearch, IconSettings } from "@tabler/icons-react";

import { HeaderButton } from "./HeaderButton";

const FOCUS_KEY = "HEADER_BUTTONS";

export const HeaderButtons = () => {
  const { ref, focusKey } = useFocusable({
    autoRestoreFocus: true,
    focusBoundaryDirections: ["right", "up"],
    focusKey: FOCUS_KEY,
    focusable: true,
    isFocusBoundary: true,
    onArrowPress: () => true,
    preferredChildFocusKey: undefined,
    saveLastFocusedChild: false,
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <Flex gap="md" ref={ref}>
        <HeaderButton icon={IconHome} />
        <HeaderButton icon={IconCategory} />
        <HeaderButton icon={IconSearch} />
        <HeaderButton icon={IconSettings} />
      </Flex>
    </FocusContext.Provider>
  );
};
