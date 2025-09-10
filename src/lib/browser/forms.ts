import { useState, useRef, type FormEvent } from 'react'

export type FormMethod = 'GET' | 'POST'
export type FormEncoding =
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'

export const isFormMethod = (s: string): s is FormMethod =>
  s === 'GET' || s === 'POST'

export const isFormEncoding = (s: string): s is FormEncoding =>
  s === 'application/x-www-form-urlencoded' || s === 'multipart/form-data'

export const copyFormData = (data: FormData): FormData => {
  const copy = new FormData()
  for (const [key, value] of data.entries()) {
    copy.append(key, value)
  }
  return copy
}

export const formDataToSearchParams = (formData: FormData): URLSearchParams => {
  const formEntries = Array.from(formData, ([key, value]) => [
    key,
    typeof value === 'string' ? value : value.name,
  ])
  return new URLSearchParams(formEntries)
}

export interface SubmitFormOps {
  action: string | URL
  method?: FormMethod
  encType?: FormEncoding
}

export const submitForm = (
  data: FormData,
  {
    action,
    method = 'GET',
    encType = 'application/x-www-form-urlencoded',
  }: SubmitFormOps,
): Promise<Response> => {
  const target = new URL(action)
  const opts: RequestInit = { method, redirect: 'follow' }

  if (method === 'GET') {
    if (encType === 'multipart/form-data')
      throw new Error(
        'Unupported: GET method with multipart/form-data encoding',
      )
    target.search = formDataToSearchParams(data).toString()
  } else if (method === 'POST') {
    opts.body =
      encType === 'application/x-www-form-urlencoded'
        ? formDataToSearchParams(data)
        : data
  } else {
    throw new Error(`Invalid ${method} request method`)
  }

  return fetch(target, opts)
}

export const restoreForm = (form: HTMLFormElement, data: FormData): void => {
  for (const [name, value] of data.entries()) {
    const field = form.querySelector(`[name=${name}]`)
    if (field && 'value' in field) field.value = value
  }
}

export const FormStatus = ['initial', 'submitting', 'error', 'success'] as const

export type FormStatus = (typeof FormStatus)[number]

export const isFormStatus = (str: string): str is FormStatus =>
  FormStatus.includes(str as FormStatus)

export interface UseFormProps {
  requiredFields?: readonly string[]
  transformData?: (data: FormData) => FormData
}

export interface UseFormResult {
  status: FormStatus
  data: FormData
  errorMessage?: string
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  handleError: (message?: string) => void
}

export const useForm = ({
  requiredFields = [],
  transformData,
}: UseFormProps): UseFormResult => {
  const formData = useRef(new FormData())
  const [status, setStatus] = useState<FormStatus>('initial')
  const [errorMessage, setErrorMessage] = useState<string>()

  const isValid = (data: FormData): boolean =>
    requiredFields.every((field) => data.get(field))

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    let { action, method, enctype: encType } = event.currentTarget
    method = method.toUpperCase()

    if (!isFormMethod(method)) {
      throw new Error(`Invalid form method: ${method}`)
    }
    if (!isFormEncoding(encType)) {
      throw new Error(`Invalid form encoding: ${encType}`)
    }
    if (method === 'GET' && encType === 'multipart/form-data') {
      throw new Error(
        'Unupported: GET method with multipart/form-data encoding',
      )
    }

    const data = new FormData(event.currentTarget)
    if (!isValid(data)) {
      return handleError('Missing required fields in contact form')
    }
    formData.current = data

    setStatus('submitting')

    const submitData = transformData ? transformData(copyFormData(data)) : data

    submitForm(submitData, { action, method, encType })
      .then(async (response) => {
        if (response.status >= 400) {
          const body: unknown = await response.json()
          console.error(body) // eslint-disable-line no-console -- should log error
          if (
            body &&
            typeof body === 'object' &&
            'message' in body &&
            typeof body.message === 'string'
          ) {
            handleError(`${response.status}: ${body.message}`)
            return
          }
          handleError(`Status code ${response.status}`)
          return
        }
        setStatus('success')
      })
      .catch((error: Error) => {
        // NetworkError when attempting to fetch resource (bad CORS)
        console.error(error)
        handleError(
          error instanceof Error
            ? `${error.name}: ${error.message}`
            : undefined,
        )
      })
  }

  const handleError = (message?: string): void => {
    setErrorMessage(message)
    setStatus('error')
  }

  return {
    status,
    data: formData.current,
    errorMessage,
    handleSubmit,
    handleError,
  }
}

interface FormStatusContent {
  title: string
  description?: string | null
}

export interface FormContent {
  initial: FormStatusContent
  submitting?: FormStatusContent | null
  error?: FormStatusContent | null
  success?: FormStatusContent | null
}

export const getContent = (
  content: FormContent,
  status: FormStatus,
): FormStatusContent =>
  (status in content && content[status]) || content.initial

export const useFormContentChange = (
  content: FormContent,
): FormStatus | null => {
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
