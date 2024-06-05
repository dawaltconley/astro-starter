import type { PagesBlocks } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/images'
import AccordionBlock from './AccordionBlock'
import CarouselBlock from './CarouselBlock'
import ContentBlock from './ContentBlock'
import LogoWallBlock from './LogoWallBlock'

export interface PagesBlockProps {
  block: PagesBlocks
  images?: ResponsiveImageData
}

export default function PagesBlock({
  block,
  ...optionals
}: PagesBlockProps): JSX.Element | null {
  switch (block.__typename) {
    case 'PagesBlocksAccordion':
      return <AccordionBlock block={block} {...optionals} />
    case 'PagesBlocksCarousel':
      return <CarouselBlock block={block} {...optionals} />
    case 'PagesBlocksContent':
      return <ContentBlock block={block} {...optionals} />
    case 'PagesBlocksLogoWall':
      return <LogoWallBlock block={block} {...optionals} />
  }
  return null
}
