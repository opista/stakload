import { join } from "path";

import { app } from "electron";

const APP_DIR_NAME = "stakload";
const userDataPath = join(app.getPath("appData"), APP_DIR_NAME);

app.setName(APP_DIR_NAME);
app.setPath("userData", userDataPath);
app.setAppLogsPath(join(userDataPath, "logs"));

export { APP_DIR_NAME, userDataPath };
