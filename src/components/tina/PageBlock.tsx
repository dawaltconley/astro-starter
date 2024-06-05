import type { PagesQuery } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/images'
import LinkedHeading from './LinkedHeading'
import { withTinaWrapper } from './withTinaWrapper'
import { tinaField } from 'tinacms/dist/react'
import clsx from 'clsx'
import PagesBlock from '@components/blocks'

interface CarouselProps {
  blockIndex: number
  images?: ResponsiveImageData
  id?: string
}

export default withTinaWrapper<PagesQuery, CarouselProps>(
  ({ data, blockIndex, images, id }) => {
    const block = data.pages.blocks?.[blockIndex]
    if (!block) {
      throw new Error(`No block at index ${blockIndex}`)
    }
    const heading = ('blockHeading' in block && block.blockHeading) || null

    return (
      <div
        id={id}
        className={clsx('mx-auto my-16 sm:my-24 lg:my-32', {
          'max-w-4xl': block.__typename === 'PagesBlocksAccordion',
        })}
        data-tina-field={tinaField(data.pages, 'blocks', blockIndex)}
      >
        {heading && (
          <LinkedHeading className="mb-12 text-4xl font-medium uppercase">
            {heading}
          </LinkedHeading>
        )}
        <PagesBlock block={block} images={images} />
      </div>
    )
  },
)
