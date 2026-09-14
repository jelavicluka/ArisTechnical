import config from '@payload-config'
import type { Metadata } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'

const fallbackSettings = {
  defaultSEODescription:
    'Independent technical guides and professional support for ARIS administration, development, automation and integration.',
  defaultSEOTitle: 'Independent Technical Guidance for ARIS',
  siteName: 'Technical Knowledge & Consulting',
}

const isMedia = (value: number | Media | null | undefined): value is Media =>
  typeof value === 'object' && value !== null

export const getSiteURL = () => {
  const configuredURL =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  try {
    return new URL(configuredURL).toString().replace(/\/$/, '')
  } catch {
    return 'http://localhost:3000'
  }
}

export const getAbsoluteURL = (pathOrURL: string, siteURL = getSiteURL()) =>
  new URL(pathOrURL, `${siteURL}/`).toString()

const hasPublicHostname = (siteURL: string) => {
  const { hostname } = new URL(siteURL)
  return hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '[::1]'
}

export const getSiteSettings = cache(async () => {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })
  const siteURL = getSiteURL()
  const socialImage = isMedia(settings.defaultSocialImage) ? settings.defaultSocialImage : null

  return {
    defaultAuthorName: settings.defaultAuthorName || undefined,
    defaultSEODescription: settings.defaultSEODescription || fallbackSettings.defaultSEODescription,
    defaultSEOTitle: settings.defaultSEOTitle || fallbackSettings.defaultSEOTitle,
    indexingEnabled:
      settings.indexingEnabled !== false && process.env.NODE_ENV === 'production' && hasPublicHostname(siteURL),
    publisherName: settings.publisherName || undefined,
    siteName: settings.siteName || fallbackSettings.siteName,
    siteURL,
    socialImage: socialImage?.url
      ? {
          alt: socialImage.alt,
          url: getAbsoluteURL(socialImage.url, siteURL),
        }
      : {
          alt: `${settings.siteName || fallbackSettings.siteName} social preview`,
          url: getAbsoluteURL('/aris-technical-social.png', siteURL),
        },
    updatedAt: settings.updatedAt,
  }
})

type PageMetadataInput = {
  absoluteTitle?: boolean
  description: string
  path: string
  title: string
}

export const buildPageMetadata = async ({
  absoluteTitle = false,
  description,
  path,
  title,
}: PageMetadataInput): Promise<Metadata> => {
  const settings = await getSiteSettings()
  const canonicalURL = getAbsoluteURL(path, settings.siteURL)
  const socialTitle = absoluteTitle ? title : `${title} | ${settings.siteName}`

  return {
    alternates: {
      canonical: canonicalURL,
    },
    description,
    openGraph: {
      description,
      images: [settings.socialImage],
      siteName: settings.siteName,
      title: socialTitle,
      type: 'website',
      url: canonicalURL,
    },
    title: absoluteTitle ? { absolute: title } : title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [settings.socialImage.url],
      title: socialTitle,
    },
  }
}
