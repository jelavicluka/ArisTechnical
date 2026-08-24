import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    description: 'Editable identity and SEO defaults so branding and authorship are not hardcoded.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      admin: {
        description: 'Can remain empty until the public brand decision is final.',
      },
      maxLength: 100,
    },
    {
      name: 'publisherName',
      type: 'text',
      admin: {
        description: 'Used for structured data only after the publisher identity is confirmed.',
      },
      maxLength: 120,
    },
    {
      name: 'defaultAuthorName',
      type: 'text',
      admin: {
        description: 'Optional fallback for article authorship. No default is currently assumed.',
      },
      maxLength: 120,
    },
    {
      name: 'defaultSEODescription',
      type: 'textarea',
      maxLength: 170,
    },
    {
      name: 'defaultSocialImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
