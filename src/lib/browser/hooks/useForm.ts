import { useState, useRef, type FormEvent } from 'react'
import {
  submitForm,
  copyFormData,
  isFormMethod,
  isFormEncoding,
  type FormStatus,
} from '../forms'

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

export default function useForm({
  requiredFields = [],
  transformData,
}: UseFormProps): UseFormResult {
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
