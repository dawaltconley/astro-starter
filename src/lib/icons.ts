import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types'
import type { IconifyIcon } from '@iconify/types'
import { toUrl } from '@lib/utils'

export type IconDefinition = FaIconDefinition | IconifyIcon

type IconDict = { default: IconDefinition } & Record<string, IconDefinition>

interface IconOpts {
  name: string
  url?: string | URL
  icons: IconDefinition | IconDict
}

export class Icon {
  readonly name: string
  readonly icons: IconDict
  readonly url?: URL

  static readonly urlMap = new Map<string, Icon>()

  constructor({ name, url: urlString, icons }: IconOpts) {
    this.name = name
    this.icons = 'default' in icons ? icons : { default: icons }

    if (urlString) {
      const url = toUrl(urlString)
      if (!url) throw new Error(`Bad url string in icon: ${name}`)

      const urlKey = url.host || url.protocol
      if (Icon.urlMap.has(urlKey)) {
        throw new Error(
          `Duplicate icon urls: ${name} conflicts with ${Icon.urlMap.get(
            urlKey,
          )}`,
        )
      }
      Icon.urlMap.set(urlKey, this)
    }
  }

  getDefinition(id?: 'default'): IconDefinition
  getDefinition(id: string): IconDefinition | null
  getDefinition(id = 'default'): IconDefinition | null {
    return this.icons[id] || null
  }

  matchesUrl(url: URL): boolean {
    const { protocol, host } = url
    return this.url?.host ? host === this.url.host : protocol === this.url?.href
  }
}

export const getIconFromUrl = (urlString: string | URL): Icon | null => {
  const url = toUrl(urlString)
  if (!url) return null
  const { protocol, host } = url
  return Icon.urlMap.get(host) || Icon.urlMap.get(protocol) || null
}

export const faToIconify = (icon: FaIconDefinition): IconifyIcon => {
  const [width, height, , , svgPathData] = icon.icon
  const body = Array.isArray(svgPathData)
    ? `<g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="${svgPathData[0]}"></path><path class="fa-primary" fill="currentColor" d="${svgPathData[1]}"></path></g>`
    : `<path fill="currentColor" d=${svgPathData}></path>`
  return { width, height, body }
}
