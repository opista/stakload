import { CommandPalette } from "@components/layout/command-palette";
import { Navbar } from "@components/layout/desktop/navigation/navbar";
import { NotificationDrawer } from "@components/layout/desktop/notifications/notification-drawer";
import { GlobalModalRenderer } from "@components/ui/global-modal-renderer";
import { Outlet } from "react-router";

export const DesktopLayout = () => (
  <div className="flex h-screen w-full">
    <CommandPalette />
    <Navbar />
    <NotificationDrawer />
    <GlobalModalRenderer />
    <main className="flex-1 overflow-hidden">
      <Outlet />
    </main>
  </div>
);
