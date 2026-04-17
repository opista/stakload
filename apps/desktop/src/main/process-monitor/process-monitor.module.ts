import { Module } from "@nestjs/common";

import { resolvePlatformImplementation } from "../platform/resolve-platform-implementation";
import { MacProcessMonitor } from "./strategies/mac.strategy";
import { WindowsProcessMonitor } from "./strategies/windows.strategy";
import { PROCESS_MONITOR, ProcessMonitorStrategy } from "./types";

@Module({
  exports: [PROCESS_MONITOR],
  providers: [
    MacProcessMonitor,
    WindowsProcessMonitor,
    {
      inject: [MacProcessMonitor, WindowsProcessMonitor],
      provide: PROCESS_MONITOR,
      useFactory: (
        macProcessMonitor: MacProcessMonitor,
        windowsProcessMonitor: WindowsProcessMonitor,
      ): ProcessMonitorStrategy =>
        resolvePlatformImplementation<ProcessMonitorStrategy>("process monitor", {
          darwin: macProcessMonitor,
          win32: windowsProcessMonitor,
        }),
    },
  ],
})
export class ProcessMonitorModule {}
