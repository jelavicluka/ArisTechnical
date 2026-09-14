import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleContent } from '@/components/article/ArticleContent'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import type { Category, Media } from '@/payload-types'
import { getArticleBySlug } from '@/utilities/getArticleBySlug'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'
import { getAbsoluteURL, getSiteSettings } from '@/utilities/siteSettings'

import styles from '@/components/article/article.module.css'

type PageProps = {
  params: Promise<{ slug: string }>
}

const isCategory = (category: number | Category): category is Category => typeof category === 'object'
const isMedia = (media: number | Media | null | undefined): media is Media => typeof media === 'object' && media !== null

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [article, settings] = await Promise.all([getArticleBySlug(slug), getSiteSettings()])

  if (!article) return {}

  const uploadedSocialImage = isMedia(article.seo?.socialImage)
    ? article.seo.socialImage
    : isMedia(article.featuredImage)
      ? article.featuredImage
      : null
  const socialImage = uploadedSocialImage?.url
    ? {
        alt: uploadedSocialImage.alt,
        url: getAbsoluteURL(uploadedSocialImage.url, settings.siteURL),
      }
    : settings.socialImage
  const canonicalURL = article.seo?.canonicalURL ||
    getAbsoluteURL(`/articles/${article.slug}`, settings.siteURL)
  const description = article.seo?.description || article.summary
  const title = article.seo?.title || article.title
  const authorName = article.authorName || settings.defaultAuthorName

  return {
    alternates: {
      canonical: canonicalURL,
    },
    description,
    openGraph: {
      authors: authorName ? [authorName] : undefined,
      description,
      images: [socialImage],
      modifiedTime: article.updatedAt,
      publishedTime: article.publishedAt || article.createdAt,
      siteName: settings.siteName,
      title,
      type: 'article',
      url: canonicalURL,
    },
    robots: article.seo?.excludeFromIndex ? { follow: false, index: false } : undefined,
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [socialImage.url],
      title,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const [article, library, settings] = await Promise.all([
    getArticleBySlug(slug),
    getArticleLibrary(),
    getSiteSettings(),
  ])

  if (!article) notFound()

  const category = isCategory(article.category) ? article.category : null
  const publicationDate = article.publishedAt || article.createdAt
  const articlesHref = '/articles'
  const canonicalURL = article.seo?.canonicalURL ||
    getAbsoluteURL(`/articles/${article.slug}`, settings.siteURL)
  const socialImage = isMedia(article.seo?.socialImage)
    ? article.seo.socialImage
    : isMedia(article.featuredImage)
      ? article.featuredImage
      : null
  const authorName = article.authorName || settings.defaultAuthorName
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    articleSection: category?.title,
    author: authorName
      ? {
          '@type': 'Person',
          name: authorName,
        }
      : undefined,
    dateModified: article.updatedAt,
    datePublished: publicationDate,
    description: article.seo?.description || article.summary,
    headline: article.seo?.title || article.title,
    image: socialImage?.url
      ? getAbsoluteURL(socialImage.url, settings.siteURL)
      : settings.socialImage.url,
    mainEntityOfPage: canonicalURL,
    publisher: settings.publisherName
      ? {
          '@type': 'Organization',
          name: settings.publisherName,
          url: settings.siteURL,
        }
      : undefined,
    url: canonicalURL,
  }

  return (
    <div className={styles.articlePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <SiteHeader categories={library.categories} currentPage="articles" />

      <main>
        <article>
          <header className={styles.articleHero}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.heroInner}>
              {category ? <p className={styles.category}>{category.title}</p> : null}
              <h1>{article.title}</h1>
              <p className={styles.summary}>{article.summary}</p>
              <div className={styles.articleMeta}>
                <time dateTime={publicationDate}>{formatDate(publicationDate)}</time>
                {article.readingTime ? (
                  <>
                    <i aria-hidden="true" />
                    <span>{article.readingTime} min read</span>
                  </>
                ) : null}
                {article.authorName ? (
                  <>
                    <i aria-hidden="true" />
                    <span>{article.authorName}</span>
                  </>
                ) : null}
              </div>
            </div>
          </header>

          <ArticleContent blocks={article.content} />

          <footer className={styles.articleFooter}>
            <div>
              <span>End of article</span>
              <p>Looking for another technical topic?</p>
            </div>
            <a href={articlesHref}>Return to the technical library</a>
          </footer>
        </article>
      </main>
      <SiteFooter categories={library.categories} />
    </div>
  )
}
