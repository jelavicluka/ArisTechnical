import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    create: async ({ req }) => {
      if (req.user) return false

      const existingAdmins = await req.payload.count({
        collection: 'admins',
        overrideAccess: true,
      })

      return existingAdmins.totalDocs === 0
    },
    delete: () => false,
    read: authenticated,
    update: ({ req }) => {
      if (!req.user) return false
      return { id: { equals: req.user.id } }
    },
  },
  admin: {
    description: 'The private administrator account for managing website content.',
    useAsTitle: 'email',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Used inside the administration interface only for now.',
      },
      maxLength: 120,
    },
  ],
}
