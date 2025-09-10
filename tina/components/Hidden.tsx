import { useEffect } from 'react'
import { wrapFieldsWithMeta, Input, type InputProps } from 'tinacms'
import { uniqueId } from 'lodash'

export interface HiddenProps {
  value?: string | ((id: string) => string)
}

export const Hidden = wrapFieldsWithMeta<InputProps, HiddenProps>(
  ({ field, input }) => {
    if (!input.value) {
      if (typeof field.value === 'string') {
        input.onChange(field.value)
      } else {
        const id = uniqueId(`${field.name}_${Date.now()}`)
        input.onChange(field.value ? field.value(id) : id)
      }
    }

    useEffect(() => {
      const element = document.querySelector(`input[name="${input.name}"]`)
      const parent = element?.parentElement
      if (!parent) return
      parent.hidden = true
    }, [])

    return <Input {...input} />
  },
)
