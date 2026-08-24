import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return {
    host: siteURL,
    rules: {
      allow: '/',
      disallow: ['/admin/', '/api/', '/preview/'],
      userAgent: '*',
    },
  }
}
