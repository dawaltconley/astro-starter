import { useEffect, type ReactNode } from 'react'
import { useEditState } from 'tinacms/dist/react'

interface TinaOnlyProps {
  children: ReactNode
  replace?: string
}

export default function TinaOnly({
  children,
  replace,
}: TinaOnlyProps): ReactNode {
  const { edit: isEditor } = useEditState()

  useEffect(() => {
    if (isEditor && replace) {
      document.querySelectorAll(replace).forEach((element) => {
        element.remove()
      })
    }
  }, [isEditor])

  return isEditor ? children : null
}
