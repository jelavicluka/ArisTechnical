import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    description: 'Site-wide identity, search metadata, social sharing and indexing controls.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Technical Knowledge & Consulting',
      maxLength: 100,
      required: true,
    },
    {
      name: 'defaultSEOTitle',
      type: 'text',
      admin: {
        description: 'Homepage title and fallback title used by search engines and social previews.',
      },
      defaultValue: 'Independent Technical Guidance for ARIS',
      maxLength: 70,
      required: true,
    },
    {
      name: 'defaultSEODescription',
      type: 'textarea',
      admin: {
        description: 'Homepage description and fallback description for pages without their own copy.',
      },
      defaultValue:
        'Independent technical guides and professional support for ARIS administration, development, automation and integration.',
      maxLength: 170,
      required: true,
    },
    {
      name: 'defaultSocialImage',
      type: 'upload',
      admin: {
        description: 'Recommended size: 1200 × 630 pixels. The branded fallback is used when empty.',
      },
      relationTo: 'media',
    },
    {
      name: 'publisherName',
      type: 'text',
      admin: {
        description: 'Organization or business name used in structured data. Defaults to the site name.',
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
      name: 'indexingEnabled',
      type: 'checkbox',
      admin: {
        description:
          'Allow search engines to index the public site. This only takes effect when a non-local production site URL is configured.',
        position: 'sidebar',
      },
      defaultValue: true,
    },
  ],
}
