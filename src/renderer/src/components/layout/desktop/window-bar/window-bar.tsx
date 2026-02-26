import { WindowControls } from "./window-controls";

export const WindowBar = () => (
  <header className="fixed top-0 left-0 w-full flex justify-end [app-region:drag] select-none">
    <WindowControls />
  </header>
);
