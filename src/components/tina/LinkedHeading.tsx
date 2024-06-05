import type { ComponentPropsWithoutRef } from 'react'
import { slugify } from '@lib/utils'
import { getHeading, type Heading } from '@lib/headings'

interface LinkedHeadingProps extends ComponentPropsWithoutRef<Heading> {
  children: string | JSX.Element
  hLevel?: number | Heading
}

export default function LinkedHeading({
  children,
  hLevel = 'h2',
  ...headingProps
}: LinkedHeadingProps): JSX.Element {
  const slug = slugify(getTextContent(children))
  const H = getHeading(hLevel)
  return (
    <H {...headingProps}>
      <span id={slug} className="-mt-12 pt-12">
        {children}
      </span>
    </H>
  )
}

function getTextContent(element: string | JSX.Element): string {
  if (typeof element === 'string') return element
  const content: unknown = element.props.content
  if (!content) return ''
  if (Array.isArray(content)) {
    return content
      .filter(isTextNode)
      .map((item) => item.text)
      .join('')
  }
  if (typeof content === 'string' || typeof content === 'number') {
    return content.toString()
  }
  if (isTextNode(content)) {
    return content.text
  }
  return ''
}

interface TextNode {
  type: 'text'
  text: string
}

function isTextNode(item: unknown): item is TextNode {
  return (
    !!item &&
    typeof item === 'object' &&
    'type' in item &&
    item.type === 'text' &&
    'text' in item &&
    typeof item.text === 'string'
  )
}
