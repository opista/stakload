import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

export const BaseLayout = () => {
  const defaultUI = useInterfaceSettingsStore(useShallow((state) => state.defaultUI));
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultUI === "desktop") {
      navigate("/desktop");
    } else {
      navigate("/gaming");
    }
  }, []);

  return <></>;
};
