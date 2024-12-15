import { Button } from "@mantine/core";
import { useNavigate } from "react-router";

export const DummyComponent = () => {
  const navigate = useNavigate();

  // TODO - Delete me
  return (
    <>
      <div>Gaming mode UI</div>;<Button onClick={() => navigate("/desktop")}>Back to desktop mode</Button>
    </>
  );
};
