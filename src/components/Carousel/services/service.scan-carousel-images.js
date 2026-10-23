/**
 * Builds service.carousel-images-data.json from the subfolders of public/carousel-pictures.
 * Runs automatically before `npm start` and the builds (see `scan-images` in package.json),
 * or by hand with `npm run scan-images`.
 *
 *  - Each subfolder becomes a carousel section. Its name minus the number prefix is the
 *    section name ("1-Random Pictures" → "Random Pictures").
 *  - Folders and pictures are ordered by the number at the start of their names (2 before 10).
 *  - alt text defaults to the file name without number and extension.
 *  - alt and extraCaption you edit in the JSON are kept when the script runs again.
 *    Renaming a file or folder resets them for that entry.
 */

const fs = require('fs')
const path = require('path')
const { byLeadingNumber, stripFolderPrefix, altFromFile, listImages, normalizeSrc } = require('./service.scan-helpers')

const directoryPath = path.join(__dirname, '../../../../public/carousel-pictures')
const jsonFilePath = path.join(__dirname, 'service.carousel-images-data.json')

const generateImageData = () => {
    if (!fs.existsSync(directoryPath)) {
        console.error(`Directory ${directoryPath} does not exist.`)
        return
    }

    // Saved alt/captions, looked up by image path.
    const existing = new Map()
    if (fs.existsSync(jsonFilePath)) {
        try {
            const saved = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
            for (const folder of saved) {
                for (const image of folder.images) {
                    existing.set(normalizeSrc(image.src), image)
                }
            }
        } catch (error) {
            console.error('Could not read the existing carousel JSON, starting fresh:', error.message)
        }
    }

    const folders = fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort(byLeadingNumber)

    const data = folders.map((folder) => ({
        name: stripFolderPrefix(folder),
        images: listImages(fs, path.join(directoryPath, folder)).map((file) => {
            const src = `/carousel-pictures/${folder}/${file}`
            const saved = existing.get(src)
            return {
                src,
                alt: saved?.alt || altFromFile(file),
                extraCaption: saved?.extraCaption ?? null,
            }
        }),
    }))

    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2) + '\n')
    console.log('service.carousel-images-data.json generated.')
}

generateImageData()
