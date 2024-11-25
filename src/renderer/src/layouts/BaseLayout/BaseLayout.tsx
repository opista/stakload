import { useEffect } from "react";
import { useNavigate } from "react-router";

export const BaseLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/desktop");
  }, []);

  return <></>;
};
