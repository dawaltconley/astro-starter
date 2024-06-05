import { defineConfig } from 'astro/config'

import { SITE } from './src/data/site.mjs'
import * as sass from 'sass'
import mkTwFunctions from 'sass-tailwind-functions/modern'
import react from '@astrojs/react'
import { getLegacySassFunctions } from '@dawaltconley/responsive-images/sass'
import imageConfig from './src/lib/build/image-config'

const { pathname: twConfig } = new URL('./tailwind.config.cjs', import.meta.url)

// https://astro.build/config
export default defineConfig({
  site: SITE.domain.href,
  output: 'static',
  integrations: [react()],
  vite: {
    build: {
      emptyOutDir: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src/styles'],
          quietDeps: true,
          functions: {
            ...mkTwFunctions(sass, twConfig),
            ...getLegacySassFunctions(imageConfig),
          },
        },
      },
    },
  },
})
