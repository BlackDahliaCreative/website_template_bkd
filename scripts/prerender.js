/**
 * prerender.js — turns every page into a complete HTML file after the build.
 *
 * Why: GitHub Pages only serves files that exist. Without this, opening /carousels
 * directly fell back to 404.html, and Google saw "404 Not Found". Now each page gets
 * build/<page>/index.html containing:
 *   - the page's real content (rendered by React at build time, so Google reads it instantly)
 *   - its own title, description, canonical link and share tags (from SEOHead)
 * When a visitor opens it, React "hydrates" the HTML: clicks and animations start working.
 *
 * It also writes:
 *   - build/404.html for unknown URLs (noindex)
 *   - build/sitemap.xml and build/robots.txt (official build only)
 *
 * Pages come from src/site.config.json — add new pages there.
 *
 * Runs at the end of `npm run build:preview` / `npm run build:official`, after:
 *   1. vite build        → build/        (the site for browsers)
 *   2. vite build --ssr  → build-ssr/    (a Node copy of the app, used only here)
 *
 * Usage: node scripts/prerender.js            (official)
 *        node scripts/prerender.js --preview  (preview: no sitemap)
 */

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const site = require('../src/site.config.json')

const ROOT = path.resolve(__dirname, '..')
const BUILD_DIR = path.join(ROOT, 'build')
const SSR_DIR = path.join(ROOT, 'build-ssr')
const IS_PREVIEW = process.argv.includes('--preview')
const NOT_FOUND_PATH = '/__page-not-found__'

const escapeText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Same rule as canonicalUrl() in SEOHead.tsx: pages end with "/", like GitHub Pages serves them.
const canonicalUrl = (p) => `${site.siteUrl}${p === '/' ? '/' : `${p.replace(/\/+$/, '')}/`}`

const fail = (message) => {
    console.error(`ERROR: ${message}`)
    process.exit(1)
}

// Fill the CLIENT_* placeholders left in index.html (JSON-LD, image alt) from site.config.json.
const fillPlaceholders = (html) => {
    const values = {
        CLIENT_OG_IMAGE: `${site.siteUrl}${site.defaultImage}`,
        CLIENT_URL: site.siteUrl,
        CLIENT_NAME: site.siteName,
        CLIENT_DESC: site.defaultDescription,
    }
    for (const [token, value] of Object.entries(values)) {
        if (!String(value).includes('CLIENT_')) html = html.split(token).join(value)
    }
    return html
}

const main = async () => {
    const templatePath = path.join(BUILD_DIR, 'index.html')
    const serverEntry = ['entry-server.mjs', 'entry-server.js']
        .map((f) => path.join(SSR_DIR, f))
        .find((f) => fs.existsSync(f))

    if (!fs.existsSync(templatePath)) fail('build/index.html not found. Run the build first.')
    if (!serverEntry) fail('build-ssr/entry-server.js not found. Run the SSR build first.')

    const template = fillPlaceholders(fs.readFileSync(templatePath, 'utf-8'))
    if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
        fail('build/index.html has no <!--app-html--> / <!--app-head--> markers. Run the full build again (it may already be pre-rendered).')
    }

    if (site.siteUrl.includes('CLIENT_')) {
        console.warn('WARNING: siteUrl in src/site.config.json is still a placeholder, so canonical links are wrong.')
    }

    const { render } = await import(pathToFileURL(serverEntry).href)

    const renderToFile = async (pagePath, outFile) => {
        const { html, head } = await render(pagePath)
        const page = template
            .replace('<!--app-head-->', head)
            .replace('<!--app-html-->', html)
        fs.mkdirSync(path.dirname(outFile), { recursive: true })
        fs.writeFileSync(outFile, page)
        console.log(`  ✓ ${pagePath.padEnd(22)} → ${path.relative(BUILD_DIR, outFile)}`)
        return html
    }

    for (const page of site.pages) {
        const folder = page.path.replace(/^\/+|\/+$/g, '')
        const html = await renderToFile(page.path, path.join(BUILD_DIR, folder, 'index.html'))
        if (/page not found/i.test(html)) {
            fail(`"${page.path}" is in site.config.json but has no matching <Route> in src/App.tsx.`)
        }
    }

    // Unknown URLs: GitHub Pages serves 404.html (with status 404). It shows the
    // "Page not found" screen and is marked noindex by the NotFound page.
    await renderToFile(NOT_FOUND_PATH, path.join(BUILD_DIR, '404.html'))

    if (IS_PREVIEW) {
        console.log('Preview build: every page is marked noindex, no sitemap.')
    } else if (site.siteUrl.includes('CLIENT_')) {
        console.warn('WARNING: skipping sitemap.xml until siteUrl is filled in.')
    } else {
        const today = new Date().toISOString().slice(0, 10)
        const urls = site.pages.map((p) => [
            '  <url>',
            `    <loc>${escapeText(canonicalUrl(p.path))}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            p.changefreq ? `    <changefreq>${p.changefreq}</changefreq>` : null,
            p.priority ? `    <priority>${p.priority}</priority>` : null,
            '  </url>',
        ].filter(Boolean).join('\n')).join('\n')

        fs.writeFileSync(
            path.join(BUILD_DIR, 'sitemap.xml'),
            `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
        )
        fs.writeFileSync(
            path.join(BUILD_DIR, 'robots.txt'),
            `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`
        )
        console.log(`  ✓ sitemap.xml (${site.pages.length} pages) and robots.txt`)
    }

    // The Node copy of the app is only needed for this step.
    fs.rmSync(SSR_DIR, { recursive: true, force: true })
    console.log('Pre-render done.')
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
