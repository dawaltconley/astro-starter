import { defineConfig, type Collection } from 'tinacms'
import { pageMeta, headerLinks, redirects } from './config/fields'
import * as blocks from './config/blocks'
import { slugify } from '../src/lib/utils'

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
      type: 'string',
      name: 'title',
      label: 'Site title',
      required: true,
      ui: {
        description:
          'Used for previews when a link is shared on social media or any app that supports link previews.',
      },
    },
    {
      type: 'string',
      name: 'description',
      label: 'Site description',
      required: true,
      ui: {
        description:
          'Used for previews when a link is shared on social media or any app that supports link previews.',
      },
    },
    {
      type: 'image',
      name: 'ogImage',
      label: 'Default social media image',
      ui: {
        description:
          'Used for previews when a link is shared on social media or any app that supports link previews. For best results should be 1200x630 pixels. This is a fallback for when page-specific images are not provided.',
      },
    },
    {
      type: 'image',
      name: 'favicon',
      label: 'Site icon',
      ui: {
        description:
          'Displayed on browser tabs. Should be either an svg file, or an image file no more than 180x180, square aspect ratio.',
      },
    },
    {
      type: 'string',
      name: 'socialLinks',
      label: 'Social links',
      list: true,
    },
    headerLinks,
    redirects,
  ],
} satisfies Collection

const pages = {
  name: 'pages',
  label: 'Pages',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: async ({ document }) => {
      const slug = slugify(document._sys.filename)
      if (slug === 'index') return '/'
      return slug !== undefined ? `/${slug}` : undefined
    },
    filename: {
      slugify: (values) => values.title && slugify(values.title),
    },
  },
  fields: [
    pageMeta,
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
      isTitle: true,
    },
    {
      type: 'object',
      name: 'blocks',
      label: 'Page Blocks',
      list: true,
      templates: Object.values(blocks),
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
    collections: [globalData, pages],
  },
})
