import type { TinaField, Template } from 'tinacms'
import { cloneDeep } from 'lodash'
import { isOgDescription, isPercentage } from './validate'

export interface Option {
  value: string
  label: string
}

/*
 * Globals
 */

const linkTemplate = {
  name: 'link',
  label: 'Link',
  ui: {
    itemProps: (values) => ({
      label: values.text || values.href || undefined,
    }),
  },
  fields: [
    {
      type: 'string',
      name: 'text',
      label: 'Page name',
      required: true,
    },
    {
      type: 'string',
      name: 'href',
      label: 'Link',
      required: true,
    },
  ],
} satisfies Template

export const link = {
  type: 'object',
  ...linkTemplate,
} satisfies TinaField

export const headerLinks = {
  type: 'object',
  name: 'header',
  label: 'Header Links',
  list: true,
  templates: [
    linkTemplate,
    {
      name: 'dropdown',
      label: 'Dropdown',
      fields: [
        {
          type: 'string',
          name: 'name',
          label: 'Dropdown label',
          required: true,
        },
        {
          ...link,
          name: 'links',
          label: 'Links',
          list: true,
          required: true,
        },
      ],
    },
  ],
} satisfies TinaField

export const redirects = {
  type: 'object',
  name: 'redirects',
  label: 'Redirects',
  list: true,
  ui: {
    itemProps: (values) => ({
      label:
        values.from && values.to
          ? `${values.from || ''} → ${values.to || ''}`
          : 'Undefined redirect',
    }),
  },
  fields: [
    {
      type: 'string',
      name: 'from',
      label: 'From',
      required: true,
    },
    {
      type: 'string',
      name: 'to',
      label: 'To',
      required: true,
    },
  ],
} satisfies TinaField

/*
 * Page Meta
 */

export const pageMeta = {
  type: 'object',
  name: 'meta',
  label: 'Page Metadata',
  fields: [
    {
      type: 'string',
      name: 'description',
      label: 'Page description',
      ui: {
        description:
          'Shown in Google searches and when links are shared on social media.',
        validate: isOgDescription,
      },
    },
    {
      type: 'image',
      name: 'ogImage',
      label: 'Social media image',
      ui: {
        description:
          'Used for previews when this page is shared on social media or any app that supports link previews. For best results should be 1200x630 pixels.',
      },
    },
  ],
} satisfies TinaField

const pageMetaNoImage = cloneDeep(pageMeta)
pageMetaNoImage.fields.splice(1, 1)

export { pageMetaNoImage }

/*
 * Image Controls
 */

export type ImageControlFields = 'alt' | 'size' | 'posX' | 'posY'

const imageControlFields: Record<ImageControlFields, TinaField> = {
  alt: {
    type: 'string',
    name: 'alt',
    label: 'Image description',
  },
  size: {
    type: 'string',
    name: 'size',
    label: 'Image size',
    ui: {
      description:
        'Cover ensures that the image fills the complete space and is usually the right approach. Contain ensures that the full image is visible.',
    },
    options: [
      {
        value: 'cover',
        label: 'cover',
      },
      {
        value: 'contain',
        label: 'contain',
      },
    ],
  },
  posX: {
    type: 'number',
    name: 'posX',
    label: 'Horizontal position %',
    ui: {
      description: 'Controls how the image is centered when sized to "cover."',
      validate: isPercentage,
    },
  },
  posY: {
    type: 'number',
    name: 'posY',
    label: 'Vertical position %',
    ui: {
      description: 'Controls how the image is centered when sized to "cover."',
      validate: isPercentage,
    },
  },
}

export const imageControls = ({
  name = 'imageControls',
  fields = ['alt', 'size', 'posX', 'posY'],
}: {
  name?: string
  fields?: ImageControlFields[]
} = {}): TinaField => ({
  type: 'object',
  name,
  label: 'Image Controls',
  fields: fields.map((f) => imageControlFields[f]),
})

export const defaultImageControls = {
  imageControls: {
    size: 'cover',
    posX: 50,
    posY: 50,
  },
}

/*
 * Forms
 */

const formStatusContent = [
  {
    type: 'string',
    name: 'title',
    label: 'Heading',
    required: true,
  },
  {
    type: 'string',
    name: 'description',
    label: 'Description',
  },
] satisfies TinaField[]

export const formContent = [
  {
    type: 'object',
    name: 'initial',
    label: 'Form Message',
    fields: formStatusContent,
    required: true,
  },
  {
    type: 'object',
    name: 'error',
    label: 'Error Message',
    ui: {
      description: 'Shown if the form encounters an error.',
    },
    fields: formStatusContent,
  },
  {
    type: 'object',
    name: 'success',
    label: 'Success Message',
    ui: {
      description: 'Shown after the form is successfully submitted.',
    },
    fields: formStatusContent,
  },
] satisfies TinaField[]
