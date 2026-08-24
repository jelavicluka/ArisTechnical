import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    description: 'Reusable article images with required accessibility and SEO metadata.',
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Describe the meaningful content of the image. Required before publishing.',
      },
      maxLength: 180,
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      maxLength: 300,
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
        position: 'centre',
      },
      {
        name: 'article',
        width: 1200,
        height: 800,
        position: 'centre',
      },
      {
        name: 'social',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
}
