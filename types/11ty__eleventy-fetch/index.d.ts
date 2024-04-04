declare module '@11ty/eleventy-fetch' {
  import { Cache } from '@types/flat-cache'
  import { Response } from '@types/node-fetch'

  type CacheType = 'json' | 'text' | 'buffer'

  interface Options {
    type?: CacheType
    duration: string
    directory?: string
    removeUrlQueryParams?: boolean
    formatUrlForDisplay?: (url: string) => string
    dryRun?: boolean
    verbose?: boolean
    concurrency?: number
    hashLength?: number
  }

  interface JsonOptions extends Options {
    type: 'json'
  }

  interface TextOptions extends Options {
    type: 'text'
  }

  interface BufferOptions extends Options {
    type: 'buffer'
  }

  export type { CacheType, Options, JsonOptions, TextOptions, BufferOptions }

  export default function EleventyFetch<AssetType>(
    source: string,
    options: JsonOptions,
  ): Promise<AssetType>
  export default function EleventyFetch(
    source: string,
    options: TextOptions,
  ): Promise<string>
  export default function EleventyFetch(
    source: string,
    options: BufferOptions,
  ): Promise<Buffer>
  export default function EleventyFetch(
    source: string,
    options: Options,
  ): Promise<any>

  export function queue<T>(
    source: string,
    queueCallback: (...args: any) => T,
  ): Promise<T>

  export interface Util {
    isFullUrl: (url: string | URL) => boolean
  }

  export declare class AssetCache<AssetType> {
    constructor(uniqueKey: string, cacheDirectory?: string, options?: Options)
    static getHash(url: string, hashLength?: number): string
    source: AssetType
    hash: string
    cacheDirectory: string
    readonly cacheFilename: string
    readonly rootDir: string
    readonly cachePath: string
    readonly cache: Cache
    getDurationMs(duration?: string): number
    getCachedContentsPath(type?: CacheType): string
    ensureDir(): Promise<void>
    save(contents: AssetType, type?: CacheType): Promise<void>
    getCachedContents(type: 'json'): Promise<AssetType>
    getCachedContents(type: 'text'): Promise<string>
    getCachedContents(type: 'buffer'): Promise<Buffer>
    getCachedContents(type: CacheType): Promise<AssetType | string | buffer>
    /** depends on CacheType passed to the save method */
    getCachedValue(): Promise<AssetType>
    isCacheValid(duration: string): boolean
    readonly cachedObject: any
    needsToFetch(duration: string): boolean
    fetch(options: JsonOptions): Promise<AssetType>
    fetch(options: TextOptions): Promise<string>
    fetch(options: BufferOptions): Promise<Buffer>
    fetch(options: Options): Promise<AssetType | string | Buffer>
  }

  export declare class RemoteAssetCache<
    AssetType,
  > extends AssetCache<AssetType> {
    constructor(url: string, cacheDirectory?: string, options?: Options)
    static cleanUrl(url: string): string
    formatUrlForDisplay(url: string): string
    log(message: string): void
    url: string
    getResponseValue(response: Response, type: 'json'): Promise<AssetType>
    getResponseValue(response: Response, type: 'text'): Promise<string>
    getResponseValue(response: Response, type: 'buffer'): Promise<Buffer>
    getResponseValue(
      response: Response,
      type: CacheType,
    ): Promise<AssetType | string | Buffer>
    fetch(optionsOverride: JsonOptions): Promise<AssetType>
    fetch(optionsOverride: TextOptions): Promise<string>
    fetch(optionsOverride: BufferOptions): Promise<Buffer>
    /** unlike AssetCache, this does depend on the CacheType passed to the constructor options */
    fetch(optionsOverride: Options): Promise<AssetType>
    /** for testing */
    hasCacheFiles(): boolean
    /** for testing */
    destroy(): Promise<void>
  }
}
