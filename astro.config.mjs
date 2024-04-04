import { defineConfig } from 'astro/config'

import * as sass from 'sass'
import mkTwFunctions from 'sass-tailwind-functions/legacy'
import react from '@astrojs/react'
import tina from 'astro-tina'
import { getLegacySassFunctions } from '@dawaltconley/responsive-images/sass'
import imageConfig from './src/lib/build/image-config'

const { pathname: twConfig } = new URL('./tailwind.config.cjs', import.meta.url)

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react(), tina()],
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
