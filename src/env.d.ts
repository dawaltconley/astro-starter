/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  plausible?(
    event: string,
    options?: {
      callback?: () => void
      props?: object
    },
  ): void
}
