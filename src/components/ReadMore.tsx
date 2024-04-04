import Icon from './Icon'
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight'

interface ReadMoreProps {
  href: string | URL
  children: string
}

export default function ReadMore({ href, children: text }: ReadMoreProps) {
  return (
    <a
      href={href.toString()}
      className="not-prose group text-inherit duration-300"
    >
      <span className="underline-fill group-hover:underline-fill--active">
        {text}
      </span>{' '}
      <Icon
        icon={faArrowRight}
        className="fa-inline relative translate-x-0 text-base duration-300 ease-out group-hover:translate-x-0.5"
        width="1em"
        height="1em"
      />
    </a>
  )
}
