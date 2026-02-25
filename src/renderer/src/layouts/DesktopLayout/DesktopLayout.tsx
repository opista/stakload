import { modals } from "@components/Desktop/Modals/modals";
import { Navbar } from "@components/Desktop/Navigation/Navbar/Navbar";
import { NotificationDrawer } from "@components/Desktop/Notifications/NotificationDrawer/NotificationDrawer";
import { WindowBar } from "@components/Desktop/WindowBar/WindowBar";
import { ModalsProvider } from "@mantine/modals";
import { Outlet } from "react-router";

import { Spotlight } from "../../components/Desktop/Spotlight/Spotlight";

export const DesktopLayout = () => (
  <ModalsProvider modals={modals}>
    <div className="flex h-screen w-full pt-12">
      <WindowBar />
      <Spotlight />
      <Navbar />
      <NotificationDrawer />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  </ModalsProvider>
);
