import { Grid, GridCol } from "@mantine/core";
import { FocusContext, init, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { IconCategory, IconHome, IconSearch, IconSettings } from "@tabler/icons-react";

import { HeaderButton } from "./HeaderButton";

const FOCUS_KEY = "HEADER_BUTTONS";

init({
  debug: false,
  shouldFocusDOMNode: true,
  visualDebug: false,
});

export const HeaderButtons = () => {
  const { ref, focusKey } = useFocusable({
    focusable: true,
    saveLastFocusedChild: true,
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
      <Grid ref={ref}>
        <GridCol span={3}>
          <HeaderButton icon={IconHome} />
        </GridCol>
        <GridCol span={3}>
          <HeaderButton icon={IconCategory} />
        </GridCol>
        <GridCol span={3}>
          <HeaderButton icon={IconSearch} />
        </GridCol>
        <GridCol span={3}>
          <HeaderButton icon={IconSettings} />
        </GridCol>
      </Grid>
    </FocusContext.Provider>
  );
};
