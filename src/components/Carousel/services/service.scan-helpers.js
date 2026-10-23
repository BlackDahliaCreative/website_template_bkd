// Shared helpers for the carousel image scan scripts.

const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i

// Leading number of a file or folder name ("10.Hexagon.webp" → 10). Names without one go last.
const leadingNumber = (name) => {
    const match = name.match(/^(\d+)/)
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

// Sort by the leading number, so "2.x" comes before "10.x".
const byLeadingNumber = (a, b) =>
    leadingNumber(a) - leadingNumber(b) || a.localeCompare(b)

// "1-Random Pictures" → "Random Pictures" (keeps any later hyphens).
const stripFolderPrefix = (folder) => folder.replace(/^\d+\s*-\s*/, '')

// "1.Grand resort lagonissi.webp" → "Grand resort lagonissi"
const altFromFile = (file) =>
    file.replace(IMAGE_EXT, '').replace(/^\d+\s*[.\-_]\s*/, '')

const listImages = (fs, dir) =>
    fs.readdirSync(dir).filter((file) => IMAGE_EXT.test(file)).sort(byLeadingNumber)

// Paths are stored with a leading "/". Older lists sometimes had none, so match both.
const normalizeSrc = (src) => (src.startsWith('/') ? src : `/${src}`)

module.exports = { byLeadingNumber, stripFolderPrefix, altFromFile, listImages, normalizeSrc }
