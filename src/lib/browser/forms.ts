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
  const dataCopy = copyFormData(data)
  const subject = dataCopy.get('subject')
  if (subject) dataCopy.set('subject', `[${window.location.host}] ${subject}`)

  if (method === 'GET') {
    if (encType === 'multipart/form-data')
      throw new Error(
        'Unupported: GET method with multipart/form-data encoding',
      )
    target.search = formDataToSearchParams(dataCopy).toString()
  } else if (method === 'POST') {
    opts.body =
      encType === 'application/x-www-form-urlencoded'
        ? formDataToSearchParams(dataCopy)
        : dataCopy
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

export interface FormProps {
  requiredFields?: readonly string[]
}

export const useForm = ({ requiredFields = [] }: FormProps) => {
  const formData = useRef(new FormData())
  const [status, setStatus] = useState<FormStatus>('initial')
  const [errorMessage, setErrorMessage] = useState<string>()

  const isValid = (data: FormData): boolean =>
    requiredFields.every((field) => data.get(field))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    let { action, method, enctype: encType } = e.currentTarget
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

    const data = new FormData(e.currentTarget)
    if (!isValid(data)) {
      return handleError('Missing required fields in contact form')
    }
    formData.current = data

    setStatus('submitting')

    try {
      const response = await submitForm(data, { action, method, encType })
      if (response.status >= 400) {
        const body = await response.json()
        console.error(body)
        if ('message' in body && typeof body.message === 'string') {
          return handleError(`${response.status}: ${body.message}`)
        }
        return handleError(`Status code ${response.status}`)
      }
      return setStatus('success')
    } catch (e) {
      // NetworkError when attempting to fetch resource (bad CORS)
      console.error(e)
      return e instanceof Error
        ? handleError(`${e.name}: ${e.message}`)
        : handleError()
    }
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
