export type Validator<T> = (value?: T | null) => string | void

export const isUrl: Validator<string> = (url) => {
  try {
    if (url) new URL(url)
  } catch (e) {
    return `${url} is not a valid URL.`
  }
}

export const isRequiredUrl: Validator<string> = (url) =>
  url ? isUrl(url) : 'Required'

export const isPercentage: Validator<number> = (value) => {
  if (value && (value < 0 || value > 100)) {
    return 'Number must be between 0 and 100'
  }
}

export const isOgDescription: Validator<string> = (value) => {
  if (value && value.length > 160) {
    return 'Descriptions should be no more than 160 characters long.'
  }
}
