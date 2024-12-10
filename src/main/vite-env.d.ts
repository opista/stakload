/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_TRULAUNCH_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
