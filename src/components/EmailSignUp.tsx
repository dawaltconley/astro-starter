import { useRef } from 'react'
import {
  getContent,
  type FormContent,
  type FormMethod,
  type FormEncoding,
} from '@browser/forms'
import useForm from '@browser/hooks/useForm'
import useFormContentChange from '@browser/hooks/useFormContentChange'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'

interface EmailSignUpProps {
  action: string
  method?: FormMethod
  encType?: FormEncoding
  content: FormContent
}

export default function EmailSignUp({
  content,
  ...formProps
}: EmailSignUpProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    status: formStatus,
    errorMessage,
    handleSubmit,
  } = useForm({
    requiredFields: ['email'],
  })
  const editStatus = useFormContentChange(content)
  const status = editStatus || formStatus

  const lockHeight = () => {
    const container = containerRef.current
    if (!container) return
    container.style.minHeight = `${container.clientHeight.toString()}px`
  }

  const { description } = getContent(content, status)

  return (
    <div ref={containerRef} className="mx-auto w-auto text-center">
      <h2 className="heading-2 mb-4">{getContent(content, status).title}</h2>
      {status === 'error' &&
        (errorMessage ? (
          <ErrorMessage message={errorMessage} />
        ) : editStatus === 'error' ? (
          <ErrorMessage message="Error message will show here." />
        ) : null)}
      {description && <p className="mt-2 font-serif">{description}</p>}
      {status !== 'success' && (
        <form
          {...formProps}
          className="mx-auto mt-4 flex max-w-xl text-lg"
          onSubmit={async (e) => {
            let error: string | null = null
            try {
              lockHeight()
              handleSubmit(e)
            } catch (e) {
              if (e instanceof Error) {
                error = e.message
              } else {
                error = e?.toString() || null
              }
            }
            window.plausible?.('Email Sign-up', { props: { error } })
          }}
        >
          <label htmlFor="sign-up-email" className="sr-only">
            Email
          </label>
          <input
            id="sign-up-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="form-field w-full border-r-0"
            autoComplete="email"
            disabled={status === 'submitting'}
            required
          />
          <label htmlFor="sign-up-fax" className="form-label special-input">
            Fax Number
          </label>
          <input
            id="sign-up-fax"
            name="fax_number"
            className="form-field special-input w-full"
            tabIndex={-1}
            autoComplete="off"
            disabled={status === 'submitting'}
          />
          <button
            type="submit"
            className="form-button w-28"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <Spinner className="fa-inline" />
            ) : (
              'Sign up'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
