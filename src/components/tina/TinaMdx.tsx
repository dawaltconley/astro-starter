import type { ResponsiveImageData } from '@lib/images'
import type { Link } from '@lib/utils'
import { memo } from 'react'
import { TinaMarkdown, type TinaMarkdownContent } from 'tinacms/dist/rich-text'
import { getMetadata } from '@lib/images'
import Image from '../Image'
import ImageLink from '../ImageLink'
import LinkedHeading from './LinkedHeading'

type Components = Parameters<typeof TinaMarkdown>[0]['components']

export interface TinaMdxProps {
  content: TinaMarkdownContent | TinaMarkdownContent[]
  images?: ResponsiveImageData
}

export default function TinaMdx({
  content,
  images,
}: TinaMdxProps): JSX.Element {
  const components: Components = {
    h2: (props) => (props !== undefined ? <LinkedHeading {...props} /> : <></>),
    Button: (props) =>
      'text' in props && 'href' in props ? (
        <Button {...(props as any)} />
      ) : (
        <></>
      ),
    CallToAction: (props) =>
      'text' in props ? (
        <Button
          text={(props.text as string) || 'Take Action!'}
          href="/takeaction"
        />
      ) : (
        <></>
      ),
    ImageLink: (props) =>
      'href' in props && 'image' in props ? (
        <ImageLink {...(props as any)} images={images} />
      ) : (
        <></>
      ),
    HTML: (props) =>
      'html' in props && typeof props.html === 'string' ? (
        <HTML html={props.html} />
      ) : (
        <></>
      ),
    img: (props) => {
      if (!props?.url) return <></>
      const metadata = getMetadata(props.url, images)
      return <Image src={metadata} alt={props?.caption || ''} />
    },
  }
  return <TinaMarkdown content={content} components={components} />
}

function Button({ text, href }: Link) {
  return (
    <div className="not-prose my-8 text-center">
      <a href={href} className="btn btn--primary min-w-1/3">
        {text}
      </a>
    </div>
  )
}

const HTML = memo(({ html = '' }: { html?: string }) => {
  return (
    <div
      className="my-8 first:mt-0 last:mb-0"
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  )
})
