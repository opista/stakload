import { Flex } from "@mantine/core";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconCategory, IconHome, IconSearch, IconSettings } from "@tabler/icons-react";

import { HeaderButton } from "./HeaderButton";

const FOCUS_KEY = "HEADER_BUTTONS";

export const HeaderButtons = () => {
  const { ref, focusKey } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    focusBoundaryDirections: ["right", "up"],
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: true,
    focusKey: FOCUS_KEY,
    preferredChildFocusKey: undefined,
    onArrowPress: () => true,
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
