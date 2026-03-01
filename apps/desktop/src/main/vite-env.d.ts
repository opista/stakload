/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_STAKLOAD_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
