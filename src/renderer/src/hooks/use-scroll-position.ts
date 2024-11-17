import { useEffect, useState } from "react";

const useScrollPosition = (element: Element | null) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!element) return;
    const updatePosition = () => {
      setScrollPosition(element.scrollTop);
    };
    element.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => element.removeEventListener("scroll", updatePosition);
  }, [element]);

  return scrollPosition;
};

export default useScrollPosition;
