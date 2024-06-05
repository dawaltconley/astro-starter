import { useState, useEffect, useRef, Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
import useResizeObserver from '@react-hook/resize-observer'
import clsx from 'clsx'
import PlusMinusIcon from './PlusMinusIcon'
import { getHeading, type Heading } from '@lib/headings'

export interface AccordionSection {
  heading: React.ReactNode
  body: React.ReactNode
}

export interface AccordionProps {
  sections: AccordionSection[]
  autoClose?: boolean
  headingLevel?: Heading | number
}

export default function Accordion({
  sections,
  // autoClose = false,
  headingLevel,
}: AccordionProps): JSX.Element {
  return (
    <div className="divide-y divide-black border-y border-black">
      {sections.map((section, i) => (
        <AccordionSection key={i} headingLevel={headingLevel} {...section} />
      ))}
    </div>
  )
}

interface AccordionSectionProps extends AccordionSection {
  transitionDuration?: number
  headingLevel?: Heading | number
}

function AccordionSection({
  heading,
  body,
  transitionDuration = 500,
  headingLevel,
}: AccordionSectionProps) {
  const panel = useRef<HTMLDivElement>(null)
  const [panelHeight, setPanelHeight] = useState<number | null>(null)

  useEffect(() => {
    setPanelHeight(panel.current?.scrollHeight || null)
  }, [panel])

  const panelWidth = useRef(panel.current?.clientWidth)
  const isResizing = useRef(false)
  const resizingTimeout = useRef(-1)
  useResizeObserver(panel, (entry) => {
    const newWidth = entry.borderBoxSize[0]?.inlineSize
    if (!newWidth || panelWidth.current === newWidth) {
      return
    }
    panelWidth.current = newWidth
    if (!isResizing.current) {
      isResizing.current = true
      setPanelHeight(null)
    }
    window.clearTimeout(resizingTimeout.current)
    resizingTimeout.current = window.setTimeout(() => {
      isResizing.current = false
      setPanelHeight(entry.target.scrollHeight)
    }, 100)
  })

  const H = headingLevel ? getHeading(headingLevel) : Fragment

  return (
    <Disclosure as="div">
      {({ open: isOpen }) => (
        <>
          <H>
            <Disclosure.Button className="flex w-full flex-row items-center justify-between gap-8 py-8 text-left text-2xl">
              {heading}
              <PlusMinusIcon
                isPlus={!isOpen}
                className="shrink-0 text-[19px]"
                transitionDuration={transitionDuration * 0.5}
              />
            </Disclosure.Button>
          </H>
          <Disclosure.Panel
            ref={panel}
            static
            className={clsx(
              'prose prose-base relative overflow-hidden transition-[height,margin-bottom] duration-500 md:prose-lg prose-headings:uppercase prose-a:text-primary',
              isOpen && 'mb-8',
            )}
            style={{
              height: !isOpen
                ? '0px'
                : panelHeight
                  ? `${panelHeight}px`
                  : undefined,
              transitionDuration: `${transitionDuration}ms`,
            }}
          >
            {body}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
