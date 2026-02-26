import { CommandPalette } from "@components/layout/CommandPalette";
import { Navbar } from "@components/layout/Desktop/Navigation/Navbar/Navbar";
import { NotificationDrawer } from "@components/layout/Desktop/Notifications/NotificationDrawer/NotificationDrawer";
import { WindowBar } from "@components/layout/Desktop/WindowBar/WindowBar";
import { GlobalModalRenderer } from "@components/ui/GlobalModalRenderer";
import { Outlet } from "react-router";

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
