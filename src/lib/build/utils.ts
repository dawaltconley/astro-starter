import fsp from 'node:fs/promises'

export const fileExists = (file: string): Promise<boolean> =>
  fsp
    .stat(file)
    .then(() => true)
    .catch((e) => {
      if (e.code === 'ENOENT') return false
      else throw e
    })
