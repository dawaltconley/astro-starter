import type { ImageData, ResponsiveImageData } from './build/images'
import type { HastOutput } from '@dawaltconley/responsive-images'
import type { ImageCardProps } from '@components/ImageCard'
import { toUrl } from './utils'

export type { ResponsiveImageData }

export const tinaAssets = /^https:\/\/assets.tina.io\/[a-f0-9\-]*/

export const fixTinaMalformedPath = (image: string): string =>
  toUrl(image.replace(tinaAssets, ''))?.href || image

export const getMetadata = (
  path: string,
  responsive: ResponsiveImageData = {},
): string | HastOutput => {
  const image = fixTinaMalformedPath(path)
  return responsive[image] || image
}

export interface Image {
  src: string
  alt: string
}

export interface TinaImageControls {
  alt?: string | null
  size?: string | null
  posX?: number | null
  posY?: number | null
}

const isImageSize = (str: string): str is 'cover' | 'contain' =>
  str === 'cover' || str === 'contain'

export const getTinaImage = (
  imagePath: string,
  imageControls?: TinaImageControls | null,
  responsive: ResponsiveImageData = {},
): Pick<ImageCardProps, 'image' | 'alt' | 'imageSize' | 'imagePosition'> => {
  const image = getMetadata(imagePath, responsive)
  const hasPosition =
    typeof imageControls?.posX === 'number' ||
    typeof imageControls?.posY === 'number'
  const x = imageControls?.posX || 50
  const y = imageControls?.posY || 50
  return {
    image,
    alt: imageControls?.alt || undefined,
    imageSize:
      imageControls?.size && isImageSize(imageControls.size)
        ? imageControls.size
        : undefined,
    imagePosition: hasPosition ? [x, y] : undefined,
  }
}

export const getImagesFromTinaAst = (ast: any): ImageData[] => {
  if (!Array.isArray(ast)) return []
  return ast.reduce(function toImageData(data: ImageData[], e): ImageData[] {
    if (e && e?.type === 'img' && typeof e?.url === 'string') {
      return [
        ...data,
        {
          path: e.url,
          alt: typeof e?.caption === 'string' ? e.caption : undefined,
        },
      ]
    }
    if (e && Array.isArray(e?.children)) {
      return [...data, ...e.children.reduce(toImageData, [])]
    }
    return data
  }, [])
}
