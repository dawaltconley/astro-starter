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
    Omit<Props, 'data'> & ReturnType<typeof useTina<Query>>
  >,
): FunctionComponent<Props & { data: TinaData<Query> }> {
  return ({ data, ...props }) => <Child {...props} {...useTina(data)} />
}
