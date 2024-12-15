import ActionIcon from "@components/ActionIcon/ActionIcon";
import { useScrollPosition } from "@hooks/use-scroll-position";
import { Transition } from "@mantine/core";
import { IconArrowBigUpFilled } from "@tabler/icons-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import classes from "./BackToTop.module.css";

type BackToTopProps = {
  container: Element | null;
};

const BackToTop = memo(({ container }: BackToTopProps) => {
  const containerScrollPosition = useScrollPosition(container);
  const { t } = useTranslation();

  const handleScrollToTop = () => container?.scrollTo({ behavior: "smooth", top: 0 });

  return (
    <Transition mounted={containerScrollPosition > 0} transition="slide-left">
      {(transitionStyles) => (
        <ActionIcon
          aria-label={t("backToTop")}
          className={classes.button}
          icon={IconArrowBigUpFilled}
          onClick={handleScrollToTop}
          style={transitionStyles}
          title={t("backToTop")}
          variant="filled"
        />
      )}
    </Transition>
  );
});

BackToTop.displayName = "BackToTop";

export default BackToTop;
