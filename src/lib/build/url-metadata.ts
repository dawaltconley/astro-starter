import type { MqlResponse } from '@microlink/mql'
import { AssetCache } from '@11ty/eleventy-fetch'
import { getMetadata as getFreshMetadata } from '../url-metadata'
import { toUrl } from '@lib/utils'

export const getMetadata = async (
  urlString: string | URL,
  duration = '1w',
): Promise<MqlResponse['data']> => {
  const url = toUrl(urlString)
  if (!url) throw new Error(`Couldn't parse url: ${urlString}`)
  url.search = ''

  const cache = new AssetCache<MqlResponse['data']>(url.href)
  if (cache.isCacheValid(duration)) {
    return cache.getCachedValue()
  }

  try {
    const metadata = await getFreshMetadata(url.href)
    await cache.save(metadata, 'json')
    return metadata
  } catch (e) {
    console.warn(`Unable to scrape metadata from ${url}:`)
    if (cache.isCacheValid('*')) {
      console.warn(e)
      return cache.getCachedValue()
    }
    throw e
  }
}
