import Icon, { type IconProps } from './Icon'

export interface IconLinkProps extends IconProps {
  url?: string
  tag?: 'a' | 'span' | 'button' | 'div' | 'li'
  title?: string
  inline?: boolean
}

export default function IconLink({
  url,
  tag,
  title,
  class: className,
  inline = false,
  children,
  ...iconAttributes
}: IconLinkProps) {
  const IconWrapper = tag ?? (url ? 'a' : 'span')
  if (inline) iconAttributes.className = 'fa-inline'
  return (
    <IconWrapper
      href={url}
      className={className}
      title={title}
      {...(url ? { target: '_blank' } : {})}
    >
      <Icon width="1em" height="1em" {...iconAttributes} />
      {children}
    </IconWrapper>
  )
}
