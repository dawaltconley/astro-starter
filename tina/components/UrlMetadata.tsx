import type { MqlResponse, MqlOptions } from '@microlink/mql'
import React, { useState, useEffect, useRef } from 'react'
import {
  wrapFieldsWithMeta,
  Input,
  LoadingDots,
  type InputProps,
} from 'tinacms'
import { get, memoize } from 'lodash'
import { fixTinaMalformedPath } from '../../src/lib/images'
import { hasRichText } from '../../src/lib/utils'
import { getMetadata as getMetadataUtil } from '../../src/lib/url-metadata'

const getMetadata = memoize(getMetadataUtil)

export interface UrlMetadataProps {
  metadataFields: Record<
    string,
    string | ((data: MqlResponse['data']) => string)
  >
  overwriteFields: boolean
  mqlOptions: MqlOptions
}

export const UrlMetadata = wrapFieldsWithMeta<InputProps, UrlMetadataProps>(
  ({ field, input, form }) => {
    // ;(window as any).form = form
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const debounce = useRef<number>()
    const onUrlChange = (url: string): void => {
      setIsLoading(true)
      window.clearTimeout(debounce.current)
      if (!url) return setIsLoading(false)
      debounce.current = window.setTimeout(() => {
        getMetadata(url, field.mqlOptions)
          .then((metadata) => {
            setError(null)
            const { values } = form.getState()
            const updateFields = Object.entries(field.metadataFields).filter(
              ([f]) =>
                field.overwriteFields || // if has overwrite flag
                !values[f] || // if field is empty
                !hasRichText(values[f]), // if empty AST
            )
            form.batch(() => {
              updateFields.forEach(([field, property]) => {
                const value: string =
                  typeof property === 'function'
                    ? property(metadata)
                    : get(metadata, property, '')
                form.change(field, value)
              })
            })
          })
          .catch(setError)
          .finally(() => setIsLoading(false))
      }, 1200)
    }

    useEffect(() => {
      const { values } = form.getState()
      form.batch(() => {
        for (let [field, value] of Object.entries(values)) {
          if (typeof value === 'string') {
            const fixed = fixTinaMalformedPath(value)
            if (fixed !== value) {
              form.change(field, fixed)
            }
          }
        }
      })
    }, [])

    return (
      <>
        <div className="relative">
          <Input
            {...input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              input.onChange(e.target.value)
              onUrlChange(e.target.value)
            }}
          />
          {isLoading && (
            <div className="absolute bottom-0 right-2 top-0 flex flex-col justify-center">
              <LoadingDots color="rgb(0, 132, 255)" />
            </div>
          )}
        </div>
        {error && (
          <span className="animate-slide-in undefined m-0 block whitespace-normal pt-3 font-sans text-xs font-normal text-red-500">
            {error.name}: {error.message}
          </span>
        )}
      </>
    )
  },
)
