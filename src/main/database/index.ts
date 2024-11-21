import { AceBase, AceBaseLocalSettings } from "acebase";
import { app } from "electron";

const options: Partial<AceBaseLocalSettings> = { logLevel: "warn", storage: { path: app.getPath("userData") } };
export const db = new AceBase("application", options);
