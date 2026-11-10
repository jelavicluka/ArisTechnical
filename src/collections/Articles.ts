import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access/authenticated'
import { ApiFlowBlock } from '@/blocks/ApiFlowBlock'
import { CodeBlock } from '@/blocks/CodeBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { ReportJourneyBlock } from '@/blocks/ReportJourneyBlock'
import { slugField } from '@/fields/slug'
import { calculateReadingTime } from '@/utilities/readingTime'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'updatedAt'],
    description: 'Draft, preview and publish searchable technical articles.',
    useAsTitle: 'title',
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 140,
      required: true,
    },
    slugField({ reserveCategorySlugs: true }),
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Used in article cards and as the default search description.',
      },
      maxLength: 320,
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [RichTextBlock, CodeBlock, ImageBlock, ApiFlowBlock, ReportJourneyBlock],
      minRows: 1,
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'dd MMM yyyy',
          pickerAppearance: 'dayOnly',
        },
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Calculated automatically from the article content.',
        position: 'sidebar',
        readOnly: true,
      },
      min: 1,
    },
    {
      name: 'authorName',
      type: 'text',
      admin: {
        description: 'Optional until the public author and publisher identity is finalized.',
        position: 'sidebar',
      },
      maxLength: 120,
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
      hasMany: true,
      relationTo: 'articles',
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Search and social metadata. Empty fields fall back to the article title and summary.',
      },
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
        {
          name: 'socialImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'canonicalURL',
          type: 'text',
          admin: {
            description: 'Only set when the canonical source is a different URL.',
          },
          validate: (value: null | string | undefined) => {
            if (!value) return true

            try {
              const url = new URL(value)
              return ['http:', 'https:'].includes(url.protocol) || 'Enter a complete HTTP or HTTPS URL.'
            } catch {
              return 'Enter a complete HTTP or HTTPS URL.'
            }
          },
        },
        {
          name: 'excludeFromIndex',
          type: 'checkbox',
          admin: {
            description: 'Rarely needed. Published articles should normally remain indexable.',
          },
          defaultValue: false,
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.readingTime = calculateReadingTime(data.content)

        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 5000,
      },
    },
    maxPerDoc: 50,
  },
}
