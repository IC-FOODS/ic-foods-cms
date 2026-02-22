/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_CMS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
