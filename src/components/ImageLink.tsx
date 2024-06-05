import type { ComponentPropsWithoutRef } from 'react'
import Image from './Image'
import Icon from './Icon'
import {
  getTinaImage,
  type ResponsiveImageData,
  type TinaImageControls,
} from '@lib/images'
import clsx from 'clsx'

import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faFile,
  faFilePdf,
  faArrowUpRightFromSquare,
  faLink,
  faDownload,
} from '@fortawesome/pro-regular-svg-icons'

function getIconFromExt(path: string): IconDefinition {
  const [ext] = path.match(/\.[A-z0-9]+$/) || []
  switch (ext) {
    case '.pdf':
      return faFilePdf
    case '.html': // fallthrough
    case '.htm': // fallthrough
    case undefined:
      return faLink
    default:
      return faFile
  }
}

export interface ImageLinkProps extends ComponentPropsWithoutRef<'a'> {
  href: string
  image: string
  description?: string
  imageControls?: TinaImageControls
  images?: ResponsiveImageData
}

export default function ImageLink({
  href,
  image,
  description,
  imageControls,
  images = {},
  className,
  target,
  download,
  ...props
}: ImageLinkProps) {
  const icon = getIconFromExt(href)
  const {
    image: metadata,
    alt = '',
    imageSize = 'cover',
    imagePosition,
  } = getTinaImage(image, imageControls, images)
  const isFile = icon.iconName !== 'arrow-up-right-from-square'

  return (
    <a
      href={encodeURI(href)}
      className={clsx(
        'not-prose group my-8 block text-center text-[0px]',
        className,
      )}
      target={isFile ? '_blank' : undefined}
      download={isFile && download}
      {...props}
    >
      <figure className="inline-block max-w-md">
        <div className="card card--hover relative">
          <Image
            src={metadata}
            alt={alt}
            className={clsx('block overflow-hidden', {
              'bg-img-card bg-amber-300': imageSize === 'contain',
            })}
            imgProps={{
              className: clsx(
                'duration-300 will-change-transform group-hover:scale-105 group-hover:blur',
                imageSize === 'contain' ? 'object-contain' : 'object-cover',
              ),
              style: imagePosition && {
                objectPosition: `${imagePosition[0]}% ${imagePosition[1]}%`,
              },
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex bg-gray-900/50 text-white opacity-0 duration-300 group-hover:opacity-100">
            <Icon
              icon={isFile && download ? faDownload : faArrowUpRightFromSquare}
              className="m-auto text-4xl"
            />
          </div>
          <div className="slant-edge-l form-button absolute bottom-0 right-0 font-sans text-base duration-300 group-hover:bg-gray-600">
            {isFile && download ? 'Download' : 'View'}{' '}
            <Icon icon={icon} className="fa-fw fa-inline" />
          </div>
        </div>
        {description && (
          <figcaption className="mx-auto mt-2 max-w-prose text-base text-gray-600">
            {description}
          </figcaption>
        )}
      </figure>
    </a>
  )
}
