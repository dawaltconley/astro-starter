import {
  getMetadata,
  type ResponsiveImageData,
  type TinaImageControls,
} from '@lib/images'
import { useState, useRef, type JSX, type ReactNode } from 'react'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import Image from './Image'
import Icon from './Icon'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

interface CarouselImage extends TinaImageControls {
  src: string
  alt: string
}

export interface CarouselProps {
  images: CarouselImage[]
  responsiveImages?: ResponsiveImageData
  aspectRatio?: number
  fit?: 'cover' | 'contain'
  background?: 'dark' | 'light' | 'none'
  vignette?: boolean
  id?: string
  className?: string
  caption?: ReactNode
}

export default function Carousel({
  images,
  responsiveImages,
  aspectRatio,
  fit = 'contain',
  background = 'dark',
  vignette = false,
  id,
  className,
  caption,
}: CarouselProps): JSX.Element {
  const last = useRef(0)
  const [current, setCurrent] = useState(0)
  // const [loaded, setLoaded] = useState(0)

  const setPrevious = (): void => {
    last.current = current
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  const setTo = (i: number): void => {
    last.current = current
    setCurrent(i)
  }

  const setNext = (): void => {
    last.current = current
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <figure>
      <div
        id={id}
        className={clsx(
          'relative aspect-video overflow-hidden',
          {
            'bg-gray-900': background === 'dark',
            'bg-gray-100': background === 'light',
            vignette: vignette,
          },
          className,
        )}
        style={{ aspectRatio }}
      >
        {images.map((image, i, images) => (
          <Transition
            key={image.src}
            show={
              i === current
              // current === i || (last.current === i && current !== loaded)
            }
            enter="transition duration-500 ease-out z-10"
            enterFrom={clsx(
              'opacity-0',
              last.current > current ? '-translate-x-8' : 'translate-x-8',
            )}
            enterTo="opacity-100 translate-x-0"
            leave="transition duration-500 ease-in z-0"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo={clsx(
              'opacity-0',
              i < current || i === images.length
                ? '-translate-x-8'
                : 'translate-x-8',
            )}
          >
            <Image
              src={getMetadata(image.src, responsiveImages)}
              alt={image.alt}
              className={'absolute inset-0 h-full w-full'}
              // onLoad={() => setLoaded(i)}
              imgProps={{
                className: clsx('h-full w-full', {
                  'object-contain':
                    image.size === 'contain' || fit === 'contain',
                  'object-cover': image.size === 'cover' || fit === 'cover',
                }),
              }}
            />
          </Transition>
        ))}
      </div>
      <div className="flex flex-row items-baseline justify-center gap-8">
        {caption && (
          <figcaption className="prose prose-sm mr-auto text-gray-500">
            {caption}
          </figcaption>
        )}
        <div className="flex flex-row items-center justify-center gap-4 py-2 text-gray-400 dark:text-gray-500">
          <button
            key="prev"
            onClick={setPrevious}
            className="relative text-sm transition-colors before:pseudo-padding-2 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Previous"
            aria-controls={id}
          >
            <Icon icon={faChevronLeft} />
          </button>
          {images.map((image, i) => (
            <button
              key={image.src}
              className={clsx(
                'relative text-2xl transition-colors before:pseudo-padding-2 hover:text-gray-500 dark:hover:text-gray-400',
                i === current && 'text-gray-600 dark:text-gray-300',
              )}
              onClick={() => setTo(i)}
              aria-label={i.toString()}
              aria-controls={id}
            >
              &bull;
            </button>
          ))}
          <button
            key="next"
            onClick={setNext}
            className="relative text-sm transition-colors before:pseudo-padding-2 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Next"
            aria-controls={id}
          >
            <Icon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </figure>
  )
}

export const isBackground = (str: string): str is 'dark' | 'light' | 'none' =>
  str === 'dark' || str === 'light' || str === 'none'
