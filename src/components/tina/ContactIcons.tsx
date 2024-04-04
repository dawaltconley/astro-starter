import type { GlobalQuery } from '@tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import { getIconFromUrl } from '@data/icons'
import { withTinaWrapper } from './withTinaWrapper'
import Icon from '../Icon'

export default withTinaWrapper<GlobalQuery>(({ data }) => (
  <div
    className="flex space-x-3"
    data-tina-field={tinaField(data.global, 'socialLinks')}
  >
    {data.global.socialLinks?.map((url) => {
      const icon = url && getIconFromUrl(url)
      if (!icon) return null
      return (
        <a
          key={url}
          href={url}
          aria-label={icon.name}
          className="duration-150 hover:text-amber-300"
          target="_blank"
        >
          <Icon
            icon={icon.getDefinition()}
            className="fa-inline"
            width="1.2em"
            height="1.2em"
          />
        </a>
      )
    })}
  </div>
))
