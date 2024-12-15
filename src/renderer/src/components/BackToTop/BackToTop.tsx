import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { useScrollPosition } from "@hooks/use-scroll-position";
import { Transition } from "@mantine/core";
import { IconArrowBigUpFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import classes from "./BackToTop.module.css";

type BackToTopProps = {
  container: Element | null;
};

export const BackToTop = ({ container }: BackToTopProps) => {
  const containerScrollPosition = useScrollPosition(container);
  const { t } = useTranslation();

  return (
    <Transition mounted={containerScrollPosition > 0} transition="slide-left">
      {(transitionStyles) => (
        <ActionIcon
          aria-label={t("backToTop")}
          className={classes.button}
          icon={IconArrowBigUpFilled}
          onClick={() => container?.scrollTo({ behavior: "smooth", top: 0 })}
          style={transitionStyles}
          title={t("backToTop")}
          variant="filled"
        />
      )}
    </Transition>
  );
};
