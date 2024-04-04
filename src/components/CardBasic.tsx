import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface CardBasicProps {
  url?: string | URL
  children: ReactNode
  borderColor?: string
  linkText?: string | null
}

export default function CardBasic({
  url,
  borderColor,
  linkText = 'Read more',
  children,
}: CardBasicProps) {
  const Wrapper = url ? 'a' : 'div'
  const hasLink = url && linkText
  return (
    <Wrapper
      href={url?.toString()}
      className="group relative flex h-full border-4 border-amber-300 @container/image-card"
      style={{ borderColor }}
    >
      <div
        className={clsx('m-auto max-w-prose', {
          'pb-[1em]': hasLink,
        })}
      >
        {children}
      </div>
      {hasLink && (
        <div className="slant-edge-l absolute bottom-0 right-0 z-50 bg-gray-900 py-1 pl-2.5 pr-2 font-sans text-sm text-white duration-150 group-hover:bg-gray-900 group-hover:text-amber-300">
          {linkText}
        </div>
      )}
    </Wrapper>
  )
}
