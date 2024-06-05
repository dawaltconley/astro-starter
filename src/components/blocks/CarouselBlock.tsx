import type { PagesBlocksCarousel } from '@tina/__generated__/types'
import type { PagesBlockProps } from './index'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import Carousel, { isBackground } from '../Carousel'
import { isTruthy, hasRichText } from '@lib/utils'

interface CarouselBlockProps extends PagesBlockProps {
  block: PagesBlocksCarousel
}

export default function CarouselBlock({
  block,
  images: responsiveImages,
}: CarouselBlockProps) {
  const images =
    block?.images
      ?.map(
        (i) =>
          i?.src && {
            src: i.src,
            ...i.imageControls,
            alt: i.imageControls?.alt || '',
          },
      )
      .filter(isTruthy) || []

  return (
    <Carousel
      images={images}
      responsiveImages={responsiveImages}
      aspectRatio={block.aspectRatio || undefined}
      fit={block.fit === 'cover' ? 'cover' : 'contain'}
      background={
        block.background && isBackground(block.background)
          ? block.background
          : undefined
      }
      vignette={Boolean(block.vignette)}
      caption={
        hasRichText(block.caption) ? (
          <div className="prose prose-sm">
            <TinaMarkdown content={block.caption} />
          </div>
        ) : undefined
      }
    />
  )
}
