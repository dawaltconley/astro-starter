import type { PagesBlocksAccordion } from '@tina/__generated__/types'
import type { PagesBlockProps } from './index'
import Accordion, { type AccordionSection } from '../Accordion'
import TinaMdx from '@components/tina/TinaMdx'
import { isTruthy } from '@lib/utils'
import { isHeading } from '@lib/headings'

interface AccordionBlockProps extends PagesBlockProps {
  block: PagesBlocksAccordion
}

export default function AccordionBlock({
  block: accordion,
  images,
}: AccordionBlockProps) {
  const sections: AccordionSection[] =
    accordion.sections
      ?.map(
        (s) =>
          s &&
          Boolean(s.heading) &&
          Boolean(s.body) && {
            heading: s.heading,
            body: <TinaMdx content={s.body} images={images} />,
          },
      )
      .filter(isTruthy) || []

  const headingLevel =
    (accordion.headingLevel &&
      isHeading(accordion.headingLevel) &&
      accordion.headingLevel) ||
    undefined

  return (
    <Accordion
      sections={sections}
      headingLevel={headingLevel}
      autoClose={Boolean(accordion.isAutoClosing)}
    />
  )
}
