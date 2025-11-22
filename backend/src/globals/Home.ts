import type { GlobalConfig } from 'payload'
import { seoFields } from '../fields/seo'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
  },
  graphQL: { name: 'Home' },
  fields: [
    seoFields,
    {
        name: 'Hero Image',
        type: 'upload',
        relationTo: 'media',
    },
    {
      name: 'Info List',
      type: 'array',
      labels: { singular: 'Info List', plural: 'Info Lists' },
      fields: [
        { name: 'info', type: 'textarea' },
      ],
    },
  ],
}
