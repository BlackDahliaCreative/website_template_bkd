/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Build modes match the env files:
//   vite build --mode preview   → reads .env.preview
//   vite build --mode official  → reads .env.official
//
// In those files:
//   BASE_PATH=/repo-name/   where the site lives ("/" for a custom domain)
//   VITE_SITE_ENV=preview   "preview" or "official"
// The old CRA names (PUBLIC_URL, REACT_APP_SITE_ENV) still work, so existing env files don't break.
export default defineConfig(({ mode, isSsrBuild }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const rawBase = env.BASE_PATH || env.PUBLIC_URL || '/'
    const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
    const siteEnv = env.VITE_SITE_ENV || env.REACT_APP_SITE_ENV || ''

    return {
        base,
        plugins: [react()],
        define: {
            'import.meta.env.VITE_SITE_ENV': JSON.stringify(siteEnv),
        },
        server: { port: 3000, open: true },
        build: {
            outDir: 'build',
            emptyOutDir: true,
            // One CSS file for the whole site, loaded in <head>: pre-rendered pages are
            // styled immediately, before their JavaScript arrives.
            cssCodeSplit: false,
            // Server build: a .mjs file so the CommonJS prerender script can import() it
            rollupOptions: isSsrBuild ? { output: { entryFileNames: '[name].mjs' } } : undefined,
        },
        // The server build (used only for pre-rendering) bundles everything,
        // so Node never has to load package files it can't read.
        // (Only for that build: in tests it would make every package slow to load.)
        ssr: isSsrBuild ? { noExternal: true } : undefined,
        css: { preprocessorOptions: { scss: { silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'] } } },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: './src/setupTests.ts',
            css: false,
        },
    }
})
