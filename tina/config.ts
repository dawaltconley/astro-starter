import { defineConfig, type Collection } from 'tinacms'
import { pageMeta } from './config/fields'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

const globalData = {
  name: 'global',
  label: 'Global Data',
  path: 'content/pages',
  match: {
    include: 'global',
  },
  format: 'yaml',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: 'image',
      name: 'ogImage',
      label: 'Default social media image',
      required: true,
      ui: {
        description:
          'Used for previews when a link is shared on social media or any app that supports link previews. For best results should be 1200x630 pixels. This is a fallback for when page-specific images are not provided.',
      },
    },
    {
      type: 'string',
      name: 'socialLinks',
      label: 'Social links',
      list: true,
    },
  ],
} satisfies Collection

const homePage = {
  name: 'home',
  label: 'Home Page',
  path: 'content/pages',
  match: {
    include: 'home',
  },
  format: 'mdx',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: async ({ document }) => {
      if (document._sys.filename === 'home') return '/'
      return undefined
    },
  },
  fields: [
    pageMeta,
    {
      type: 'object',
      name: 'hero',
      label: 'Hero',
      required: true,
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Title',
          required: true,
        },
        {
          type: 'string',
          name: 'subtitle',
          label: 'Subtitle',
        },
        {
          type: 'rich-text',
          name: 'content',
          label: 'Content',
          isBody: true,
        },
      ],
    },
  ],
} satisfies Collection

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_CONTENT_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'media',
      publicFolder: 'public',
    },
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
    },
  },
  schema: {
    collections: [globalData, homePage],
  },
})
