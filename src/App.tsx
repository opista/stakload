import { useEffect, useState } from "react";

import { computer } from "@neutralinojs/lib";

export function App() {
  const [osInfo, setOsInfo] = useState<computer.OSInfo>();

  useEffect(() => {
    async function getOSInfo() {
      const data = await computer.getOSInfo();
      setOsInfo(data);
    }
    getOSInfo();
  }, []);

  return (
    <div>
      <p>Neutralinojs + React + TS + Vite template</p>
      <p>
        {osInfo?.name} {osInfo?.version}
      </p>
      <p>binaryVersion: {window.NL_VERSION}</p>
      <p>clientVersion: {window.NL_CVERSION}</p>
    </div>
  );
}
