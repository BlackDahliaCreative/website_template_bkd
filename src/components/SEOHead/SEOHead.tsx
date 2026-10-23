import { Helmet } from 'react-helmet-async'
import site from '../../site.config.json'

// All client details (name, URL, page titles and descriptions) live in src/site.config.json.
// scripts/prerender.js reads the same file, so the HTML files Google sees match what React shows.

// Preview builds (.env.preview → VITE_SITE_ENV=preview) are never indexed,
// so the GitHub Pages preview doesn't compete with the official site in search.
const IS_PREVIEW = import.meta.env.VITE_SITE_ENV === 'preview'

// "/" → "https://site.com/", "/about" → "https://site.com/about/"
// (GitHub Pages serves each page as a folder, so the trailing slash is the real address)
export const canonicalUrl = (path: string) =>
    `${site.siteUrl}${path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`}`

type Props = {
    path?: string           // a page "path" from site.config.json, e.g. "/carousels"
    title?: string          // overrides the config title
    description?: string    // overrides the config description
    ogImage?: string        // overrides the default share image
    noIndex?: boolean
}

const SEOHead = ({ path, title, description, ogImage, noIndex = false }: Props) => {
    const page = site.pages.find((p) => p.path === path)

    const pageTitle = title ?? page?.title
    const fullTitle = pageTitle ? `${pageTitle} | ${site.siteName}` : `${site.siteName} | ${site.tagline}`
    const desc = description ?? page?.description ?? site.defaultDescription
    const image = ogImage ?? `${site.siteUrl}${site.defaultImage}`
    const canonical = path ? canonicalUrl(path) : undefined

    return (
        <Helmet>
            {/* ── Core ─────────────────────────────────────── */}
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            {canonical && <link rel="canonical" href={canonical} />}
            {(noIndex || IS_PREVIEW) && <meta name="robots" content="noindex, nofollow" />}

            {/* ── Open Graph ───────────────────────────────── */}
            <meta property="og:type"         content="website" />
            <meta property="og:site_name"    content={site.siteName} />
            <meta property="og:title"        content={fullTitle} />
            <meta property="og:description"  content={desc} />
            {canonical && <meta property="og:url" content={canonical} />}
            <meta property="og:image"        content={image} />
            <meta property="og:image:width"  content="1200" />
            <meta property="og:image:height" content="630" />

            {/* ── Twitter / X Card ─────────────────────────── */}
            <meta name="twitter:card"        content="summary_large_image" />
            <meta name="twitter:title"       content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image"       content={image} />
        </Helmet>
    )
}

export default SEOHead
