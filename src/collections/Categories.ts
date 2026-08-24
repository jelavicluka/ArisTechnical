import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'sortOrder', 'updatedAt'],
    description: 'The five stable technical areas used for navigation, filtering and SEO landing pages.',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 100,
      required: true,
    },
    slugField(),
    {
      name: 'shortTitle',
      type: 'text',
      maxLength: 60,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 320,
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
      min: 1,
      required: true,
      unique: true,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 70,
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 170,
        },
      ],
    },
  ],
}
