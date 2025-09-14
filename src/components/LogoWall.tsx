import type { JSX, CSSProperties } from 'react'
import { getMetadata, type ResponsiveImageData } from '@lib/images'
import Image from './Image'
import clsx from 'clsx'
import styles from './LogoWall.module.css'

interface Logo {
  src?: string | null
  alt: string
  colStart?: number | null
  colEnd?: number | null
  rowStart?: number | null
  rowEnd?: number | null
  zIndex?: number | null
  fit?: 'cover' | 'contain' | null
}

export interface LogoWallProps {
  images: Logo[]
  showGridLines?: boolean
  columns?: number
  rows?: number
  responsiveImages?: ResponsiveImageData
}

export default function LogoWall({
  images,
  columns,
  rows,
  showGridLines,
  responsiveImages,
}: LogoWallProps): JSX.Element {
  const totalImages = images.length
  return (
    <div className="max-bw-7xl">
      <div
        className={clsx(
          'mx-auto grid grid-cols-4 items-center sm:grid-cols-6 lg:grid-cols-10',
          columns
            ? 'gap-0'
            : 'max-w-lg gap-x-8 gap-y-12 sm:max-w-xl sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none',
          {
            [`${styles.gridlines} transform-gpu`]: showGridLines,
          },
        )}
        style={
          {
            gridTemplateColumns: columns
              ? `repeat(${columns}, 1fr)`
              : undefined,
            gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : undefined,
            '--columns': columns || 1,
            '--rows': rows || 1,
            gap: columns ? 0 : undefined,
          } as CSSProperties
        }
      >
        {images.map(({ colStart, colEnd, rowStart, rowEnd, ...image }, i) => {
          const lastLinePosition = clsx(
            // last image
            i === totalImages - 1 && [
              totalImages % 2 === 1 && 'col-start-2',
              totalImages % 3 === 1 ? 'sm:col-start-3' : 'sm:col-start-auto',
              totalImages % 5 === 1 ? 'lg:col-start-5' : 'lg:col-start-auto',
            ],
            // 2nd to last image
            i === totalImages - 2 && [
              totalImages % 3 === 2 && 'sm:col-start-2',
              totalImages % 5 === 2 ? 'lg:col-start-4' : 'lg:col-start-auto',
            ],
            {
              // 3rd to last (5 columns)
              'lg:col-start-3': totalImages % 5 === 3 && i === totalImages - 3,
              // 4th to last (5 columns)
              'lg:col-start-2': totalImages % 5 === 4 && i === totalImages - 4,
            },
          )

          if (!image.src) {
            return (
              <div
                key={i + image.alt}
                className={clsx(
                  'col-span-2 w-full text-center',
                  lastLinePosition,
                )}
              >
                {image.alt}
              </div>
            )
          }
          const src = getMetadata(image.src, responsiveImages)
          const isPositioned = Boolean(colStart || colEnd || rowStart || rowEnd)
          return (
            <Image
              key={i + image.alt}
              src={src}
              alt={image.alt}
              className={clsx(!isPositioned && 'col-span-2', lastLinePosition)}
              style={
                {
                  gridColumnStart: colStart,
                  gridColumnEnd: colEnd,
                  gridRowStart: rowStart,
                  gridRowEnd: rowEnd,
                  zIndex: image.zIndex,
                } as CSSProperties
              }
              imgProps={{
                className: clsx(
                  'w-full object-contain object-center',
                  isPositioned ? 'h-full' : 'max-h-24',
                ),
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
