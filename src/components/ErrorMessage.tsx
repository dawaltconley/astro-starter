interface ErrorMessageProps {
  message: string
}

export default ({ message }: ErrorMessageProps) => (
  <pre className="inline-block border border-gray-900 bg-white px-4 py-2 text-sm text-red-900 drop-shadow">
    {message}
  </pre>
)
