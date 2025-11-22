import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  fields: [
    {
      name: 'metaTitle',
      label: 'Meta Title',
      type: 'text',
      localized: true,
    },
    {
      name: 'metaDescription',
      label: 'Meta Description',
      type: 'textarea',
      localized: true,
    },
  ],
}

