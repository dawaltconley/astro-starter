import { useEffect, useRef } from 'react'
import {
  restoreForm,
  getContent,
  type FormContent,
  type FormMethod,
  type FormEncoding,
} from '@browser/forms'
import useForm from '@browser/hooks/useForm'
import useFormContentChange from '@browser/hooks/useFormContentChange'
import clsx from 'clsx'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'

interface ContactFormProps {
  action: string
  method?: FormMethod
  encType?: FormEncoding
  content: FormContent
}

export default function ContactForm({
  content,
  ...formProps
}: ContactFormProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const {
    status: formStatus,
    data,
    errorMessage,
    handleSubmit,
  } = useForm({
    requiredFields: ['name', 'email', 'subject', 'message'],
    transformData: prefixSubject,
  })
  const editStatus = useFormContentChange(content)
  const status = editStatus || formStatus
  const showForm = status !== 'success'

  useEffect(() => {
    const form = formRef.current
    if (form && showForm) restoreForm(form, data)
  }, [showForm])

  const lockHeight = () => {
    const container = containerRef.current
    if (!container) return
    container.style.minHeight = `${container.clientHeight.toString()}px`
  }

  const { description } = getContent(content, status)

  return (
    <div ref={containerRef} className="text-center">
      <h2
        className={clsx('heading-2', {
          capitalize: status !== 'error',
        })}
      >
        {getContent(content, status).title}
      </h2>
      <div className="mx-auto my-4 max-w-prose space-y-2 font-serif">
        {status === 'error' &&
          (errorMessage ? (
            <ErrorMessage message={errorMessage} />
          ) : editStatus === 'error' ? (
            <ErrorMessage message="Error message will show here." />
          ) : null)}
        {description && (
          <p className="m-0 inline-block text-left">{description}</p>
        )}
      </div>
      {showForm && (
        <form
          ref={formRef}
          {...formProps}
          className="contact-form mx-auto mt-8 w-full max-w-xl grid-cols-2 text-lg @container/contact-form"
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
            window.plausible?.('Contact Form', { props: { error } })
          }}
        >
          <label htmlFor="contact-name" className="form-label @md:col-span-1">
            <span className="form-label__text">Name</span>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="form-field w-full"
              autoComplete="name"
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label htmlFor="contact-email" className="form-label @md:col-span-1">
            <span className="form-label__text">Email</span>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="form-field w-full"
              autoComplete="email"
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label htmlFor="contact-subject" className="form-label">
            <span className="form-label__text">Subject</span>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              className="form-field w-full"
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label htmlFor="contact-fax" className="form-label special-input">
            <span className="form-label__text">Fax number</span>
            <input
              id="contact-fax"
              name="fax_number"
              className="form-field w-full"
              disabled={status === 'submitting'}
              tabIndex={-1}
              autoComplete="off"
            ></input>
          </label>
          <label htmlFor="contact-message" className="form-label">
            <span className="form-label__text">Message</span>
            <textarea
              id="contact-message"
              name="message"
              className="form-field min-h-[12rem] w-full"
              disabled={status === 'submitting'}
              required
            ></textarea>
          </label>
          <button
            type="submit"
            className="form-button col-span-2 text-base @lg:text-lg"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <Spinner className="fa-inline" /> Sending
              </>
            ) : (
              'Send'
            )}
          </button>
        </form>
      )}
    </div>
  )
}

function prefixSubject(data: FormData): FormData {
  const subject = data.get('subject')
  if (subject) data.set('subject', `[${window.location.host}] ${subject}`)
  return data
}
