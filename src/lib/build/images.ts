import type { HastOutput } from '@dawaltconley/responsive-images'
import crypto from 'node:crypto'
import fsp from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import imageConfig from './image-config'
import { toUrl, isNotEmpty } from '../utils'

export interface ImageData {
  path: string
  sizes?: string
  alt?: string
}

export type ResponsiveImageData = Record<string, HastOutput>

export const normalizeImagePath = (image: string): string =>
  toUrl(image)?.href || path.resolve('./public', `.${image}`)

const processImageData = async ({
  path: image,
  sizes = '100vw',
  alt = '',
}: ImageData): Promise<HastOutput> => {
  const metadata = await imageConfig
    .responsive(normalizeImagePath(image))
    .fromSizes(sizes)
  return metadata.toHast({ alt })
}

export const makeResponsive = async (
  images: (ImageData | null | undefined)[],
): Promise<ResponsiveImageData> =>
  Object.fromEntries(
    await Promise.all(
      images
        .filter(isNotEmpty)
        .map((i) => Promise.all([i.path, processImageData(i)])),
    ),
  )

export const makeOg = async (image: string): Promise<string> => {
  const buffer = await sharp(normalizeImagePath(image))
    .resize(1200, 630, {
      fit: 'cover',
      withoutEnlargement: false,
    })
    .toFormat('png')
    .toBuffer()
  const fileName =
    crypto.createHash('md5').update(buffer).digest('hex') + '.png'
  const fileDir = imageConfig.defaults.outputDir || './dist'
  const filePath = path.join(fileDir, fileName)
  const fileUrl = '/' + path.join(...filePath.split(path.sep).slice(1))
  await fsp.mkdir(fileDir, { recursive: true })
  await fsp.writeFile(filePath, buffer)
  return fileUrl
}
