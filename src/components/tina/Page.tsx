import type { PagesQuery } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/images'
import { withTinaWrapper } from './withTinaWrapper'
import PageBlock from './PageBlock'

interface PageProps {
  images?: ResponsiveImageData
  offset?: number
}

export default withTinaWrapper<PagesQuery, PageProps>(function Page({
  data,
  images,
  offset = 0,
  isClient,
}) {
  return (
    <>
      {data.pages.blocks
        ?.slice(offset)
        .map((block, i) => (
          <PageBlock
            key={`${i} ${block?.__typename}`}
            data={data}
            isClient={isClient}
            blockIndex={i}
            images={images}
          />
        ))}
    </>
  )
})
