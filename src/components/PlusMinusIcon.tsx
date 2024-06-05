import clsx from 'clsx'

export interface PlusMinusIconProps {
  isPlus: boolean
  className?: string
  transitionDuration?: number
  transitionDelay?: number
}

export default function PlusMinusIcon({
  isPlus,
  className,
  transitionDuration = 300,
  transitionDelay = 0,
}: PlusMinusIconProps) {
  return (
    <svg
      viewBox="0 0 2 2"
      patternUnits="userSpaceOnUse"
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('inline-block aspect-square', className)}
    >
      <path
        d="M 0 1 L 2 1"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        stroke="black"
      />
      <path
        d="M 1 0 L 1 2"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        stroke="black"
        className={clsx(
          'origin-center transition ease-in-out',
          isPlus ? '' : '-rotate-90 opacity-0',
        )}
        style={{
          transitionDuration: `${transitionDuration}ms`,
          transitionDelay: `${transitionDelay}ms`,
        }}
      />
    </svg>
  )
}
