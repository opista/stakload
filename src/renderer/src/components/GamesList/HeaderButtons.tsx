import { Flex } from "@mantine/core";
import { FocusContext, init, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconCategory, IconHome, IconSearch, IconSettings } from "@tabler/icons-react";

import { HeaderButton } from "./HeaderButton";

const FOCUS_KEY = "HEADER_BUTTONS";

init({
  debug: false,
  visualDebug: false,
});

export const HeaderButtons = () => {
  const { ref, focusKey } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    focusBoundaryDirections: ["left", "right"],
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
