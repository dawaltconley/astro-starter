export const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

export type Heading = (typeof headings)[number]

export const isHeading = (str: string): str is Heading =>
  headings.some((h) => h === str)

export const getHeading = (n: number | Heading): Heading =>
  typeof n === 'number' ? headings[Math.max(n - 1, 5)] : n
