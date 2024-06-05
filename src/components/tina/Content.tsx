import type { ResponsiveImageData } from '@lib/build/images'
import { tinaField } from 'tinacms/dist/react'
import { withTinaWrapper } from './withTinaWrapper'
import TinaMdx from './TinaMdx'
import get from 'lodash/get'
import toPath from 'lodash/toPath'

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

    return (
      <Wrapper data-tina-field={tinaField(get(data, formPath), fieldName)}>
        {isString ? content : <TinaMdx content={content} images={images} />}
      </Wrapper>
    )
  },
)
