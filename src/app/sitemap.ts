import config from '@payload-config'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import { getAbsoluteURL, getSiteSettings } from '@/utilities/siteSettings'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [payload, settings] = await Promise.all([getPayload({ config }), getSiteSettings()])
  const articleResult = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 1000,
    pagination: false,
    select: {
      seo: true,
      slug: true,
      updatedAt: true,
    },
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const staticPages: MetadataRoute.Sitemap = [
    {
      changeFrequency: 'weekly',
      lastModified: settings.updatedAt || undefined,
      priority: 1,
      url: getAbsoluteURL('', settings.siteURL),
    },
    {
      changeFrequency: 'weekly',
      lastModified: settings.updatedAt || undefined,
      priority: 0.9,
      url: getAbsoluteURL('/articles', settings.siteURL),
    },
    {
      changeFrequency: 'monthly',
      lastModified: settings.updatedAt || undefined,
      priority: 0.8,
      url: getAbsoluteURL('/services', settings.siteURL),
    },
    {
      changeFrequency: 'yearly',
      lastModified: settings.updatedAt || undefined,
      priority: 0.6,
      url: getAbsoluteURL('/contact', settings.siteURL),
    },
  ]

  const articlePages: MetadataRoute.Sitemap = articleResult.docs
    .filter((article) => !article.seo?.excludeFromIndex && !article.seo?.canonicalURL)
    .map((article) => ({
      changeFrequency: 'monthly',
      lastModified: article.updatedAt,
      priority: 0.7,
      url: getAbsoluteURL(`/articles/${article.slug}`, settings.siteURL),
    }))

  return [...staticPages, ...articlePages]
}
