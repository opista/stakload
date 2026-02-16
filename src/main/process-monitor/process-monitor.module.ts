import { Module } from "@nestjs/common";

import { ProcessMonitorService } from "./process-monitor.service";
import { MacProcessMonitor } from "./strategies/mac.strategy";
import { WindowsProcessMonitor } from "./strategies/windows.strategy";

@Module({
  exports: [ProcessMonitorService],
  providers: [ProcessMonitorService, MacProcessMonitor, WindowsProcessMonitor],
})
export class ProcessMonitorModule {}
