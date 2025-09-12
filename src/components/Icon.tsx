import type { JSX, ComponentProps } from 'react'
import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types'
import type { IconifyIcon as IconifyIconDefinition } from '@iconify/types'
import clsx from 'clsx'

export type IconDefinition = FaIconDefinition | IconifyIconDefinition

export interface IconProps extends Omit<ComponentProps<'svg'>, 'icon'> {
  icon: IconDefinition
  title?: string
}

export interface IconPropsFa extends IconProps {
  icon: FaIconDefinition
}

export interface IconPropsIconify extends IconProps {
  icon: IconifyIconDefinition
}

export const FontAwesomeIcon = ({
  icon,
  title,
  className,
  ...attributes
}: IconPropsFa): JSX.Element => {
  const [width, height, , , svgPathData] = icon.icon
  let svgContent: JSX.Element
  if (Array.isArray(svgPathData)) {
    svgContent = (
      <g className="fa-duotone-group">
        <path className="fa-secondary" fill="currentColor" d={svgPathData[0]} />
        <path className="fa-primary" fill="currentColor" d={svgPathData[1]} />
      </g>
    )
  } else {
    svgContent = <path fill="currentColor" d={svgPathData} />
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={clsx(`svg-inline--fa fa-${icon.iconName}`, className)}
      data-prefix={icon.prefix}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
      {...attributes}
    >
      {title && <title>{title}</title>}
      {svgContent}
    </svg>
  )
}

export const IconifyIcon = ({
  icon,
  title,
  ...attributes
}: IconPropsIconify): JSX.Element => {
  let innerHtml = icon.body
  if (title) innerHtml = `<title>${title}</title>${innerHtml}`
  const { left = 0, top = 0, width = 16, height = 16 } = icon
  return (
    <svg
      viewBox={`${left} ${top} ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
      {...attributes}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: innerHtml }}
    />
  )
}

const Icon = ({ icon, ...attributes }: IconProps): JSX.Element =>
  'iconName' in icon ? (
    <FontAwesomeIcon icon={icon} {...attributes} />
  ) : (
    <IconifyIcon icon={icon} {...attributes} />
  )

export default Icon
