/**
 * Writes build/sitemap.xml and build/robots.txt for the official site.
 * Runs in `predeploy:official` after the build.
 *
 * Usage: node scripts/generate-sitemap.js
 *
 * Update SITE_URL and ROUTES for each client. Keep ROUTES in sync with the
 * <Route> list in src/App.tsx (leave out the "*" not-found route).
 */

const fs = require('fs')
const path = require('path')

// ═══════════════════════════════════════════════════════════════════
// CLIENT CONFIG
// ═══════════════════════════════════════════════════════════════════
const SITE_URL = 'https://www.CLIENT_DOMAIN.com' // same as SITE_URL in SEOHead.tsx, no trailing slash

const ROUTES = [
    { path: '/',           changefreq: 'monthly', priority: '1.0' },
    { path: '/Carousels',  changefreq: 'monthly', priority: '0.8' },
    { path: '/page_2',     changefreq: 'monthly', priority: '0.8' },
    { path: '/Animations', changefreq: 'monthly', priority: '0.8' },
]
// ═══════════════════════════════════════════════════════════════════

const BUILD_DIR = path.resolve(__dirname, '..', 'build')

if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌  build/ directory not found. Run the build step first.')
    process.exit(1)
}

if (SITE_URL.includes('CLIENT_')) {
    console.warn('⚠️  SITE_URL in scripts/generate-sitemap.js is still a placeholder — sitemap.xml not written.')
    process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)
const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const urls = ROUTES.map((r) => [
    '  <url>',
    `    <loc>${escapeXml(SITE_URL + r.path)}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${r.changefreq}</changefreq>`,
    `    <priority>${r.priority}</priority>`,
    '  </url>',
].join('\n')).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots)
console.log(`✅  sitemap.xml (${ROUTES.length} URLs) and robots.txt written to build/`)
