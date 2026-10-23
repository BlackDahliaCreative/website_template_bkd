/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** "preview" or "official", from the env file of the build mode */
    readonly VITE_SITE_ENV: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
