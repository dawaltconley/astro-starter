import type { PagesBlocksContent } from '@tina/__generated__/types'
import type { PagesBlockProps } from './index'
import TinaMdx from '@components/tina/TinaMdx'

interface ContentBlockProps extends PagesBlockProps {
  block: PagesBlocksContent
}

export default function ContentBlock({ block, images }: ContentBlockProps) {
  return (
    <div className="prose mx-auto prose-headings:font-medium prose-headings:uppercase prose-a:text-primary">
      <TinaMdx content={block.body} images={images} />
    </div>
  )
}
