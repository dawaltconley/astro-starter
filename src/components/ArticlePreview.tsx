import type { ReactNode } from 'react'
import type { ResponsiveImageData } from '@lib/images'
import type { ImageCardProps } from './ImageCard'
import Card from './Card'
import pick from 'lodash/pick'
import clsx from 'clsx'
import { getHeading, type Heading } from '@lib/headings'

const ArticlePreviewStyle = ['card', 'tile', 'inline'] as const
const ArticlePreviewLayout = ['basic', 'date'] as const

export type ArticlePreviewStyle = (typeof ArticlePreviewStyle)[number]
export type ArticlePreviewLayout = (typeof ArticlePreviewLayout)[number]

export const isArticleStyle = (str: string): str is ArticlePreviewStyle =>
  ArticlePreviewStyle.some((s) => s === str)

export const isArticleLayout = (str: string): str is ArticlePreviewLayout =>
  ArticlePreviewLayout.some((s) => s === str)

const passthroughProps = [
  'imageSize',
  'imagePosition',
  'linkText',
  'linkLocation',
  'borderColor',
] as const

export interface ArticlePreviewProps
  extends Pick<ImageCardProps, (typeof passthroughProps)[number]> {
  url: string | URL
  title: string
  image?: string | ResponsiveImageData[string] | null
  alt?: string | null
  date?: string | Date | null
  description?: ReactNode | null
  children?: ReactNode | null
  publisher?: string | null
  author?: string | null
  hLevel?: Heading | number
  style?: ArticlePreviewStyle
  layout?: ArticlePreviewLayout
}

export default function ArticlePreview({
  url,
  image,
  alt,
  style = 'card',
  ...props
}: ArticlePreviewProps) {
  if (!image) style = 'tile'
  const cardStyle = style === 'tile' ? 'tile' : 'card'
  const imageCardProps = pick(props, passthroughProps)
  return (
    <Card
      url={url}
      style={cardStyle}
      image={image || undefined}
      alt={alt || undefined}
      {...imageCardProps}
    >
      <div
        className={clsx('h-full @container/article-preview', {
          'px-8 py-4': style === 'card',
          'px-8 py-6': style === 'tile',
          'mb-4 py-2 @2xl/image-card:pl-8 @2xl/image-card:pt-0':
            style === 'inline',
        })}
      >
        <ArticleLayout {...props} />
      </div>
    </Card>
  )
}

export type ArticleLayoutProps = Omit<ArticlePreviewProps, 'url' | 'image'>

export function ArticleLayout({ layout, ...props }: ArticleLayoutProps) {
  switch (layout) {
    case 'date':
      return ArticleLayoutDate(props)
    case 'basic':
    // fallthrough
    default:
      return ArticleLayoutBasic(props)
  }
}

function ArticleLayoutBasic({
  title,
  children,
  description = children,
  publisher,
  hLevel,
}: ArticleLayoutProps) {
  const H = hLevel ? getHeading(hLevel) : 'p'
  return (
    <div className="h-full max-w-prose font-serif @container/article-preview">
      <H className="font-display text-2xl font-bold">{title}</H>
      {publisher && (
        <p className="text-base italic text-gray-500">{publisher}</p>
      )}
      {description && <div className="mt-2">{description}</div>}
    </div>
  )
}

const dateFormat = Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function ArticleLayoutDate({
  title,
  publisher,
  date: dateString,
  children,
  description = children,
  hLevel,
}: ArticleLayoutProps) {
  const date = dateString ? new Date(dateString) : null
  const H = hLevel ? getHeading(hLevel) : 'p'

  return (
    <div className="flex h-full max-w-prose flex-col font-serif">
      <H
        className={clsx(
          'font-display w-full text-2xl font-semibold leading-tight @md:text-3xl',
          description
            ? '@sm:separator @2xl/image-card:separator @sm:mb-8 @2xl/image-card:mb-8'
            : '@2xl/image-card:separator @2xl/image-card:mb-2',
        )}
      >
        {title}
      </H>
      {(date || publisher) && (
        <div className="-order-1 flex text-base leading-none text-gray-500">
          {date && (
            <time className="shrink-0" dateTime={date.toISOString()}>
              {dateFormat.format(date)}
            </time>
          )}
          {publisher && (
            <span
              className={clsx('flex italic', {
                'before:content-em ml-1 before:mr-1': date,
              })}
            >
              {publisher}
            </span>
          )}
        </div>
      )}
      {description && (
        <div className="hidden text-base before:-top-4 @sm:block @md:text-lg @2xl/image-card:block">
          {description}
        </div>
      )}
    </div>
  )
}
