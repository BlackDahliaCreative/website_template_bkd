import { Helmet } from 'react-helmet-async'

// ═══════════════════════════════════════════════════════════════════
// CLIENT CONFIG — update these two constants before launch
// ═══════════════════════════════════════════════════════════════════
const SITE_NAME = 'CLIENT_NAME'                        // e.g. 'Acme Studio'
const SITE_URL = 'https://www.CLIENT_DOMAIN.com'      // canonical root, no trailing slash
const DEFAULT_IMG = `${SITE_URL}/CLIENT_OG_IMAGE_PATH`   // e.g. '/img/og-cover.jpg'
// ═══════════════════════════════════════════════════════════════════

// Preview builds (.env.preview → REACT_APP_SITE_ENV=preview) are never indexed,
// so the GitHub Pages preview doesn't compete with the official site in search.
const IS_PREVIEW = process.env.REACT_APP_SITE_ENV === 'preview'

type Props = {
    title?: string          // page-specific portion, e.g. "About"
    description?: string
    canonicalPath?: string  // e.g. "/about"
    ogImage?: string
    noIndex?: boolean
}

const SEOHead = ({
    title,
    description = 'CLIENT_DESC',
    canonicalPath = '/',
    ogImage = DEFAULT_IMG,
    noIndex = false,
}: Props) => {

    const fullTitle = title
        ? `${title} | ${SITE_NAME}`
        : `${SITE_NAME} | CLIENT_TAGLINE`
    const canonical = `${SITE_URL}${canonicalPath}`

    return (
        <Helmet>
            {/* ── Core ─────────────────────────────────────── */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical"    href={canonical} />
            {(noIndex || IS_PREVIEW) && <meta name="robots" content="noindex, nofollow" />}

            {/* ── Open Graph ───────────────────────────────── */}
            <meta property="og:type"         content="website" />
            <meta property="og:site_name"    content={SITE_NAME} />
            <meta property="og:title"        content={fullTitle} />
            <meta property="og:description"  content={description} />
            <meta property="og:url"          content={canonical} />
            <meta property="og:image"        content={ogImage} />
            <meta property="og:image:width"  content="1200" />
            <meta property="og:image:height" content="630" />

            {/* ── Twitter / X Card ─────────────────────────── */}
            <meta name="twitter:card"        content="summary_large_image" />
            <meta name="twitter:title"       content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image"       content={ogImage} />
        </Helmet>
    )
}

export default SEOHead
