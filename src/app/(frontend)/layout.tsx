import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getSiteSettings } from '@/utilities/siteSettings'

import './base.css'
import './site.css'
import './styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    applicationName: settings.siteName,
    description: settings.defaultSEODescription,
    icons: {
      apple: '/apple-touch-icon.png',
      icon: [
        { type: 'image/svg+xml', url: '/aris-technical-mark.svg' },
        { sizes: '32x32', type: 'image/png', url: '/favicon-32x32.png' },
      ],
    },
    manifest: '/site.webmanifest',
    metadataBase: new URL(settings.siteURL),
    robots: {
      follow: settings.indexingEnabled,
      index: settings.indexingEnabled,
    },
    title: {
      default: settings.defaultSEOTitle,
      template: `%s | ${settings.siteName}`,
    },
  }
}

type Args = {
  children: ReactNode
}

const FrontendLayout = async ({ children }: Args) => {
  const settings = await getSiteSettings()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: settings.defaultSEODescription,
    name: settings.siteName,
    publisher: settings.publisherName
      ? {
          '@type': 'Organization',
          name: settings.publisherName,
          url: settings.siteURL,
        }
      : undefined,
    url: settings.siteURL,
  }

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  )
}

export default FrontendLayout
