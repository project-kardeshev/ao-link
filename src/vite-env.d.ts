/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARNS_ANT_REGISTRY: string
  readonly VITE_ARNS_AR_IO_REGISTRY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
