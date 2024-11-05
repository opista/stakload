import { useEffect, useState } from "react";

import { initialize } from "./database/initialize";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";

export function App() {
  const [db, setDb] = useState<RxDatabase>();

  useEffect(() => {
    initialize().then(setDb);
  }, []);

  return (
    <Provider db={db}>
      <div>
        <p>binaryVersion: {window.NL_VERSION}</p>
        <p>clientVersion: {window.NL_CVERSION}</p>
      </div>
    </Provider>
  );
}
