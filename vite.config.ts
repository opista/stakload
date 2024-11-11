import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import type { Plugin, ResolvedConfig } from "vite";

import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const _dirname = dirname(fileURLToPath(import.meta.url));

interface AuthInfo {
  nlConnectToken: string;
  nlPort: string;
  nlToken: string;
}

const neutralino = (): Plugin => {
  let config: ResolvedConfig;

  return {
    name: "neutralino",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async transformIndexHtml(html) {
      const regex = /<script src="http:\/\/localhost:(\d+)\/__neutralino_globals\.js"><\/script>/;

      if (config.mode === "production") {
        return html.replace(regex, '<script src="%PUBLIC_URL%/__neutralino_globals.js"></script>');
      }

      if (config.mode === "development") {
        const authInfoFile = await fs.readFile(path.join(_dirname, ".tmp", "auth_info.json"), {
          encoding: "utf-8",
        });

        const authInfo = JSON.parse(authInfoFile) as AuthInfo;
        const port = authInfo.nlPort;

        return html.replace(
          regex,
          `<script src="http://localhost:${port}/__neutralino_globals.js"></script>`,
        );
      }

      return html;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), neutralino()],
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          remove: true,
        }), // add options if needed
      ],
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
  },
});
