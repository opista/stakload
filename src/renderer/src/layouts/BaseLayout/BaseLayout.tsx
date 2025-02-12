import { useEffect } from "react";
import { useNavigate } from "react-router";

export const BaseLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO - We should make this configurable later
    navigate("/desktop");
  }, []);

  return <></>;
};
