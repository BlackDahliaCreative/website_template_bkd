// Turns a path inside the public/ folder into a working URL, on both the preview
// site (served from /repo-name/) and the official domain (served from /).
//   publicUrl('/carousel-pictures/a.webp') → '/repo-name/carousel-pictures/a.webp'
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

export const publicUrl = (path: string) => `${BASE}${path.startsWith('/') ? '' : '/'}${path}`

// Router basename: '' on the official site, '/repo-name' on the preview site.
export const routerBasename = BASE
