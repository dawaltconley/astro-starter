import Icon, { type IconProps } from './Icon'
import clsx from 'clsx'
import { faSpinnerThird as faLoading } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird'

export default function Spinner({
  className,
  class: className2,
  ...props
}: Omit<IconProps, 'icon'>) {
  return (
    <Icon
      icon={faLoading}
      width="1em"
      height="1em"
      class={clsx('fa-spin', className, className2)}
      {...props}
    />
  )
}
