import { ActionIcon, Affix, Transition } from "@mantine/core";
import { IconArrowBigUpFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import useScrollPosition from "../../../hooks/use-scroll-position";

interface BackToTopProps {
  container: Element | null;
}

export const BackToTop = ({ container }: BackToTopProps) => {
  const { t } = useTranslation();
  const containerScrollPosition = useScrollPosition(container);

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-left" mounted={containerScrollPosition > 0}>
        {(transitionStyles) => (
          <ActionIcon
            style={transitionStyles}
            title={t("backToTop")}
            onClick={() => container?.scrollTo({ behavior: "smooth", top: 0 })}
          >
            <IconArrowBigUpFilled style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};
