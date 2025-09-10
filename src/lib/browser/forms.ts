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
