import { Navbar } from "@components/Desktop/Navigation/Navbar/Navbar";
import { NotificationDrawer } from "@components/Desktop/Notifications/NotificationDrawer/NotificationDrawer";
import { WindowBar } from "@components/Desktop/WindowBar/WindowBar";
import { Outlet } from "react-router";

import { CommandPalette } from "../../components/CommandPalette/CommandPalette";
import { GlobalModalRenderer } from "../../components/Modal/GlobalModalRenderer";

export const DesktopLayout = () => (
  <div className="flex h-screen w-full pt-12">
    <WindowBar />
    <CommandPalette />
    <Navbar />
    <NotificationDrawer />
    <GlobalModalRenderer />
    <main className="flex-1 overflow-hidden">
      <Outlet />
    </main>
  </div>
);
