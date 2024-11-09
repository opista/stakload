import { IconArrowBigUpFilled } from "@tabler/icons-react";
import { ActionIcon, Affix, Transition } from "@mantine/core";
import useScrollPosition from "../../../hooks/use-scroll-position";

type BackToTopProps = {
  container: Element | null;
};

export const BackToTop = ({ container }: BackToTopProps) => {
  const containerScrollPosition = useScrollPosition(container);

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-left" mounted={containerScrollPosition > 0}>
        {(transitionStyles) => (
          <ActionIcon
            style={transitionStyles}
            onClick={() => container?.scrollTo({ behavior: "smooth", top: 0 })}
          >
            <IconArrowBigUpFilled
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};
