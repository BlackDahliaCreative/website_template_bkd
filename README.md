# Black Dahlia website template

React + TypeScript website template, built with **Vite**. Every page is **pre-rendered** into its own HTML file, so search engines see the full content, and it's published on **GitHub Pages**: a preview site plus the client's official domain.

Starting a new client site? Follow **[CLIENT_SETUPS.md](CLIENT_SETUPS.md)**.

---

## Commands

| Command | What it does |
|---|---|
| `npm start` | Runs the site locally at http://localhost:3000 and reloads as you edit |
| `npm test` | Runs the tests once (`npm run test:watch` keeps them running) |
| `npm run typecheck` | Checks the TypeScript for errors |
| `npm run build:preview` | Builds the preview version into `build/` |
| `npm run build:official` | Builds the official version into `build/` |
| `npm run deploy:preview` | Builds and publishes the preview site |
| `npm run deploy:official` | Builds and publishes the official site |
| `npm run scan-images` | Rebuilds the carousel image lists (also runs automatically) |
| `npm run fonts` | Makes small `.woff2` copies of the local fonts in `src/style/fonts` (fonts not on Google Fonts) |

---

## Settings files

Create these two files in the project folder. They're ignored by git.

**`.env.preview`**: the preview site, at `https://<org>.github.io/<preview-repo>/`
```
BASE_PATH=/<preview-repo>/
VITE_SITE_ENV=preview
```

**`.env.official`**: the client's own domain
```
BASE_PATH=/
VITE_SITE_ENV=official
```

The preview build tells search engines not to index any page, so it never competes with the official site.

---

## Where things live

| What | Where |
|---|---|
| Site name, domain, and each page's title and description | `src/site.config.json` |
| Pages | `src/pages/` |
| Routes (which URL shows which page) | `src/App.tsx` |
| Menus | `src/components/NavigationBar*` |
| Global styles and variables | `src/style/` |
| Google fonts (installed with npm via Fontsource) | `src/style/fonts.ts` |
| Other fonts (commercial, or not on Google) | `src/style/fonts/`, plus `@font-face` in `src/style/settings/_font_families.scss` |
| Images and other static files | `public/` |
| Social links, language, structured data, Google Tag Manager | `index.html` |

Use `publicUrl('/my-image.webp')` (from `src/utils/publicUrl.ts`) for images in `public/`, so the paths work on both the preview site and the official site.

---

## How the build works

`npm run build:official` (and `build:preview`) runs these steps:

1. **Scan images**: updates the carousel image lists.
2. **Type check**.
3. **`vite build`**: builds the site for browsers into `build/`.
4. **`vite build --ssr`**: builds a copy of the app that runs in Node (`build-ssr/`, deleted afterwards).
5. **`scripts/prerender.js`**: renders every page listed in `site.config.json` into a real HTML file:
   - `build/index.html`, `build/carousels/index.html`, …: full page content plus that page's title, description, canonical link and share tags
   - `build/404.html`: the "Page not found" page, set to noindex
   - `build/sitemap.xml` and `build/robots.txt`: official build only, once `siteUrl` is filled in

When a visitor opens a page, the HTML shows immediately. React then **hydrates** it: it attaches clicks and animations to the existing HTML instead of redrawing it.

**Code rule that comes with this:** pages are rendered once at build time in Node, where `window` and `document` don't exist. Use them only inside `useEffect` or event handlers, never directly in a component's body or at the top of a file.

### Why pre-render?

GitHub Pages only serves files that exist. Without pre-rendering, `/carousels` has no file, so GitHub serves `404.html` with a **404 status**, and Google treats the page as missing. With pre-rendering, every page returns **200** with its own content and tags.

---

## Publishing

`deploy:preview` and `deploy:official` push the contents of `build/` to the `live` branch of the repo named in `package.json` (see `scripts/deploy.js`).

For the official repo: **Settings → Pages** → Branch `live`, folder `/`, set the custom domain, enable **Enforce HTTPS**. DNS: the four GitHub A records (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and a `www` CNAME to `blackdahliacreative.github.io`.

---

## Requirements

Node.js **22.12+** (or 20.19+). Check with `node -v`.
