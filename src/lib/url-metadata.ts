import mql, { type MqlResponse, type MqlOptions } from '@microlink/mql'
import { toUrl } from './utils'

export const getMetadata = async (
  urlString: string | URL,
  options?: MqlOptions,
): Promise<MqlResponse['data']> => {
  const url = toUrl(urlString)
  if (!url) {
    throw new Error(`Couldn't parse url: ${urlString}`)
  }
  const { status, data } = await mql(url.href, { meta: true, ...options })
  if (status !== 'success') {
    throw new Error(`Error fetching metadata for ${url.href}: ${status}`)
  }
  return data
}
