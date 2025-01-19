import { useEffect } from "react";
import { useNavigate } from "react-router";

export const SettingsView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/desktop/settings/interface");
  }, []);

  return <></>;
};
