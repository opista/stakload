import { modals } from "@components/Desktop/Modals/modals";

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}
