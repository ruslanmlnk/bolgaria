import type { CollectionConfig } from 'payload'

export const Requests: CollectionConfig = {
  slug: 'requests',
  labels: {
    singular: 'Request',
    plural: 'Requests',
  },
  admin: {
    useAsTitle: 'reqNumber',
    defaultColumns: ['reqNumber', 'applicantName', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'reqNumber',
      label: 'Request Number',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'pin',
      label: 'PIN',
      type: 'text',
      required: true,
    },
    {
      name: 'applicantName',
      label: 'Applicant Name',
      type: 'text',
      required: true,
    },

    // STATUS — просте текстове поле
    {
      name: 'status',
      label: 'Status',
      type: 'text',
      required: true,
      defaultValue: 'pending',
    },

    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
    },

    {
      name: 'document',
      label: 'Document (PDF)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    }


  ],
}
