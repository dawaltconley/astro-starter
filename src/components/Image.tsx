import type { ResponsiveImageData } from '@lib/images'
import { forwardRef, type ComponentPropsWithoutRef, type Ref } from 'react'

export interface ImageProps extends ComponentPropsWithoutRef<'picture'> {
  src: string | ResponsiveImageData[string]
  alt: string
  imgRef?: Ref<HTMLImageElement>
  imgProps?: ComponentPropsWithoutRef<'img'>
}

export default forwardRef<HTMLPictureElement, ImageProps>(function Image(
  { src, alt, imgRef, imgProps = {}, ...picture },
  pictureRef,
) {
  const isResponsive = typeof src === 'object'
  const sources = isResponsive ? [...src.children] : []
  const img = sources.pop()
  return (
    <picture ref={pictureRef} {...picture}>
      {sources.map(({ properties }) => (
        <source key={properties.type?.toString()} {...properties} />
      ))}
      <img
        ref={imgRef}
        src={!isResponsive ? src : undefined}
        {...img?.properties}
        loading="lazy"
        decoding="async"
        {...imgProps}
      />
    </picture>
  )
})
