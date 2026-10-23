/**
 * optimize-fonts.js — makes small .woff2 copies of every font in src/style/fonts.
 *
 * Only for fonts that are NOT on Google Fonts (commercial fonts, client fonts).
 * Google fonts are installed with npm instead; see src/style/fonts.ts.
 *
 * Usage: npm run fonts
 *
 * For each .ttf / .otf it writes a .woff2 next to it that keeps only the characters
 * Western European languages need: English, Italian, Spanish, French, German, etc.,
 * plus punctuation, € and other symbols. Usually 80-95% smaller.
 * Variable fonts keep all their weights.
 *
 * The original .ttf/.otf files are kept as the source. Only the .woff2 files are
 * used by the site (see src/style/settings/_font_families.scss).
 *
 * A client site in Greek, Cyrillic, etc.? Add that range to EXTRA_RANGES below
 * (Greek: [0x0370, 0x03FF]) and run it again.
 */

const fs = require('fs')
const path = require('path')
const subsetFont = require('subset-font')

const FONTS_DIR = path.resolve(__dirname, '..', 'src', 'style', 'fonts')

const RANGES = [
    [0x0020, 0x007E], // Basic Latin (A-Z, 0-9, punctuation)
    [0x00A0, 0x00FF], // Latin-1: à è é ì ò ù ç ñ ü ß « » © ° …
    [0x0100, 0x017F], // Latin Extended-A: Polish, Czech, Croatian, Turkish …
    [0x0131, 0x0131], [0x0152, 0x0153], [0x02C6, 0x02C6], [0x02DA, 0x02DA], [0x02DC, 0x02DC],
    [0x2000, 0x206F], // General punctuation: – — ‘ ’ “ ” • …
    [0x20AC, 0x20AC], // €
    [0x2122, 0x2122], // ™
    [0x2190, 0x2193], // arrows ← ↑ → ↓
    [0xFB01, 0xFB02], // fi fl ligatures
]
const EXTRA_RANGES = []

const characters = [...RANGES, ...EXTRA_RANGES]
    .flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)))
    .join('')

const findFonts = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) return findFonts(full)
        return /\.(ttf|otf)$/i.test(entry.name) ? [full] : []
    })

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`

const main = async () => {
    const fonts = findFonts(FONTS_DIR)
    if (!fonts.length) return console.log('No .ttf/.otf files found in src/style/fonts.')

    let before = 0
    let after = 0
    for (const file of fonts) {
        const input = fs.readFileSync(file)
        const output = await subsetFont(input, characters, { targetFormat: 'woff2' })
        const outFile = file.replace(/\.(ttf|otf)$/i, '.woff2')
        fs.writeFileSync(outFile, output)
        before += input.length
        after += output.length
        console.log(`  ✓ ${path.relative(FONTS_DIR, file).padEnd(60)} ${kb(input.length).padStart(7)} → ${kb(output.length)}`)
    }
    console.log(`Done: ${kb(before)} → ${kb(after)}`)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
