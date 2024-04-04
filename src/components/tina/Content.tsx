import type { ResponsiveImageData } from '@lib/build/images'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { withTinaWrapper } from './withTinaWrapper'
import { getMetadata } from '@lib/images'
import Image from '../Image'
import ImageLink from '../ImageLink'
import get from 'lodash/get'
import toPath from 'lodash/toPath'

type Components = Parameters<typeof TinaMarkdown>[0]['components']

export interface TinaContentProps {
  path: any
  images?: ResponsiveImageData
}

export default withTinaWrapper<object, TinaContentProps>(
  ({ data, path, images }) => {
    const pathNormalized = toPath(path)
    const content = get(data, pathNormalized)
    if (!content || content?.children?.length === 0) return null

    const formPath = [...pathNormalized]
    const fieldName = formPath.pop()

    const isString = typeof content === 'string'
    const Wrapper = isString ? 'span' : 'div'

    const components: Components = {
      ImageLink: (props) =>
        'link' in props && 'image' in props ? (
          <ImageLink {...(props as any)} images={images} />
        ) : (
          <></>
        ),
      img: (props) => {
        if (!props?.url) return <></>
        const metadata = getMetadata(props.url, images)
        return <Image src={metadata} alt={props?.caption || ''} />
      },
    }

    return (
      <Wrapper data-tina-field={tinaField(get(data, formPath), fieldName)}>
        {isString ? (
          content
        ) : (
          <TinaMarkdown content={content} components={components} />
        )}
      </Wrapper>
    )
  },
)
