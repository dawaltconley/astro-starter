import type { FunctionComponent } from 'react'
import { useTina } from 'tinacms/dist/react'

export type TinaData<T extends object = object> = Parameters<
  typeof useTina<T>
>[0]

export function withTinaWrapper<
  Query extends object,
  Props extends object = {},
>(
  Child: FunctionComponent<
    Omit<Props, 'data' | 'isClient'> & ReturnType<typeof useTina<Query>>
  >,
): FunctionComponent<
  Props &
    (
      | { data: Query; isClient: boolean } // allow passing through data from previous useTina hook
      | { data: TinaData<Query>; isClient?: undefined }
    )
> {
  return ({ data, isClient, ...props }) => {
    const tinaData = isClient === undefined ? useTina(data) : { data, isClient }
    return <Child {...props} {...tinaData} />
  }
}
