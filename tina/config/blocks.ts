import type { TinaField, Template } from 'tinacms'
import { imageControls } from './fields'
import { headings } from '../../src/lib/headings'

const blockFields = [
  {
    type: 'string',
    name: 'blockHeading',
    label: 'Heading',
  },
] satisfies TinaField[]

export const contentBlock = {
  name: 'content',
  label: 'Content',
  ui: {
    defaultItem: {
      textSize: 'base',
    },
  },
  fields: [
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      templates: [
        {
          name: 'Button',
          ui: {
            defaultItem: {
              text: '',
              href: '',
            },
          },
          fields: [
            {
              type: 'string',
              label: 'Text',
              name: 'text',
              required: true,
            },
            {
              type: 'string',
              label: 'Link',
              name: 'href',
              required: true,
            },
          ],
        },
        {
          name: 'CallToAction',
          label: 'Call to Action',
          ui: {
            defaultItem: {
              text: 'Write to Your Reps!',
            },
          },
          fields: [
            {
              type: 'string',
              label: 'Text',
              name: 'text',
              required: true,
              ui: {
                description:
                  'This button always links to the /takeaction page.',
              },
            },
          ],
        },
        {
          name: 'HTML',
          label: 'HTML',
          fields: [
            {
              type: 'string',
              label: 'Raw html',
              name: 'html',
              ui: {
                component: 'textarea',
                description:
                  'WARNING! Inserting raw HTML into your site is potentially dangerous. Please ensure that you trust its source AND understand what it’s doing! External embeds may not preview properly.',
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies Template

export const accordionBlock = {
  name: 'accordion',
  label: 'Accordion',
  fields: [
    ...blockFields,
    {
      type: 'object',
      label: 'Sections',
      name: 'sections',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item.heading || 'Unnamed section',
        }),
      },
      fields: [
        {
          type: 'string',
          label: 'Heading',
          name: 'heading',
        },
        {
          type: 'rich-text',
          label: 'Body',
          name: 'body',
        },
      ],
    },
    {
      type: 'string',
      label: 'Heading Level',
      name: 'headingLevel',
      options: [...headings],
      ui: {
        description:
          'No visible effect; this controls the semantic section level of the accordion headings. If no adjacent content, h2 is a good bet.',
      },
    },
    {
      type: 'boolean',
      label: 'Auto-closing',
      name: 'isAutoClosing',
      ui: {
        description:
          'If set, opening a new accordion section will close any other open sections.',
      },
    },
  ],
} satisfies Template

export const carouselBlock = {
  name: 'carousel',
  label: 'Carousel',
  fields: [
    ...blockFields,
    {
      type: 'object',
      label: 'Images',
      name: 'images',
      list: true,
      ui: {
        itemProps: (values) => {
          let label: string | undefined = values.src
          const segments = label?.split('/') || []
          label = segments[segments.length - 1]
          return { label }
        },
        defaultItem: {
          imageControls: {
            size: 'contain',
          },
        },
      },
      fields: [
        {
          type: 'image',
          label: 'Image',
          name: 'src',
        },
        imageControls({ fields: ['alt', 'size'] }),
      ],
    },
    {
      type: 'number',
      label: 'Aspect Ratio',
      name: 'aspectRatio',
    },
    {
      type: 'string',
      label: 'Default fit',
      name: 'fit',
      options: ['cover', 'contain'],
    },
    {
      type: 'string',
      label: 'Background',
      name: 'background',
      options: ['dark', 'light', 'none'],
    },
    {
      type: 'boolean',
      label: 'Vignette',
      name: 'vignette',
    },
    {
      type: 'rich-text',
      label: 'Caption',
      name: 'caption',
    },
  ],
} satisfies Template

export const logoWall = {
  name: 'logoWall',
  label: 'Logo Wall',
  fields: [
    ...blockFields,
    {
      type: 'object',
      label: 'Logos',
      name: 'logos',
      list: true,
      required: true,
      ui: {
        itemProps: (values) => {
          let label: string | undefined = values.organization || values.logo
          const segments = label?.split('/') || []
          label = segments[segments.length - 1]
          return { label }
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Organization name',
          name: 'organization',
        },
        {
          type: 'image',
          label: 'Logo',
          name: 'logo',
        },
      ],
    },
  ],
} satisfies Template
