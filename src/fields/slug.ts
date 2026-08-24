import type { Field } from 'payload'

const reservedArticleSlugs = new Set([
  'administration',
  'scripting',
  'apg-automation',
  'rest-api-integrations',
  'installation-setup',
  'category',
  'search',
  'page',
])

export const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type SlugFieldOptions = {
  reserveCategorySlugs?: boolean
}

export const slugField = ({ reserveCategorySlugs = false }: SlugFieldOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    description: 'Stable URL identifier. Changing it after publication will require a redirect.',
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        const source = typeof value === 'string' && value.length > 0 ? value : data?.title
        return typeof source === 'string' ? formatSlug(source) : value
      },
    ],
  },
  index: true,
  required: true,
  unique: true,
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) return 'A URL slug is required.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers and hyphens only.'
    if (reserveCategorySlugs && reservedArticleSlugs.has(value)) {
      return 'This slug is reserved for an article category or system route.'
    }
    return true
  },
})
