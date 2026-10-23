/**
 * Builds service.single-folder-carousel-images-data.json from public/single-carousel-folder.
 * Runs automatically before `npm start` and the builds (see `scan-images` in package.json).
 * Same rules as service.scan-carousel-images.js: ordered by leading number, and edited
 * alt/extraCaption values are kept.
 */

const fs = require('fs')
const path = require('path')
const { altFromFile, listImages, normalizeSrc } = require('./service.scan-helpers')

const directoryPath = path.join(__dirname, '../../../../public/single-carousel-folder')
const jsonFilePath = path.join(__dirname, 'service.single-folder-carousel-images-data.json')

const generateSingleFolderImageData = () => {
    if (!fs.existsSync(directoryPath)) {
        console.error(`Directory ${directoryPath} does not exist.`)
        return
    }

    const existing = new Map()
    if (fs.existsSync(jsonFilePath)) {
        try {
            const saved = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
            for (const image of saved.images || []) {
                existing.set(normalizeSrc(image.src), image)
            }
        } catch (error) {
            console.error('Could not read the existing single-folder JSON, starting fresh:', error.message)
        }
    }

    const images = listImages(fs, directoryPath).map((file) => {
        const src = `/single-carousel-folder/${file}`
        const saved = existing.get(src)
        return {
            src,
            alt: saved?.alt || altFromFile(file),
            extraCaption: saved?.extraCaption ?? null,
        }
    })

    const data = { name: 'Single Folder Carousel', images }

    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2) + '\n')
    console.log('service.single-folder-carousel-images-data.json generated.')
}

generateSingleFolderImageData()
