import useScrollPosition from "@hooks/use-scroll-position";
import { Affix, Transition } from "@mantine/core";
import { IconArrowBigUpFilled } from "@tabler/icons-react";
import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { useTranslation } from "react-i18next";

type BackToTopProps = {
  container: Element | null;
};

export const BackToTop = ({ container }: BackToTopProps) => {
  const containerScrollPosition = useScrollPosition(container);
  const { t } = useTranslation();

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-left" mounted={containerScrollPosition > 0}>
        {(transitionStyles) => (
          <ActionIcon
            aria-label={t("backToTop")}
            icon={IconArrowBigUpFilled}
            onClick={() => container?.scrollTo({ behavior: "smooth", top: 0 })}
            style={transitionStyles}
            title={t("backToTop")}
            variant="filled"
          />
        )}
      </Transition>
    </Affix>
  );
};
