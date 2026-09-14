import type { MetadataRoute } from 'next'

import { getSiteSettings } from '@/utilities/siteSettings'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()

  return {
    host: settings.siteURL,
    rules: settings.indexingEnabled
      ? {
          allow: '/',
          disallow: ['/admin/', '/api/', '/preview/'],
          userAgent: '*',
        }
      : {
          disallow: '/',
          userAgent: '*',
        },
    sitemap: `${settings.siteURL}/sitemap.xml`,
  }
}
