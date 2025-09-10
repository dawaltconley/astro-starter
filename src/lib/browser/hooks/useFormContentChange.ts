import { useState, useRef } from 'react'
import { FormStatus, type FormContent } from '../forms'

export default function useFormContentChange(
  content: FormContent,
): FormStatus | null {
  const [changed, setChanged] = useState<FormStatus | null>(null)

  const lastContent = useRef(content)
  FormStatus.forEach((s) => {
    if (
      content[s]?.title !== lastContent.current[s]?.title ||
      content[s]?.description !== lastContent.current[s]?.description
    ) {
      setChanged(s)
    }
  })
  lastContent.current = content

  return changed
}
