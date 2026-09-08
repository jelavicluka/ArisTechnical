import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleContent } from '@/components/article/ArticleContent'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import type { Category, Media } from '@/payload-types'
import { getArticleBySlug } from '@/utilities/getArticleBySlug'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'

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
  const article = await getArticleBySlug(slug)

  if (!article) return {}

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const socialImage = isMedia(article.seo?.socialImage)
    ? article.seo.socialImage
    : isMedia(article.featuredImage)
      ? article.featuredImage
      : null

  return {
    alternates: {
      canonical: article.seo?.canonicalURL || `${serverURL}/articles/${article.slug}`,
    },
    description: article.seo?.description || article.summary,
    openGraph: {
      description: article.seo?.description || article.summary,
      images: socialImage?.url ? [{ alt: socialImage.alt, url: socialImage.url }] : undefined,
      title: article.seo?.title || article.title,
      type: 'article',
    },
    robots: article.seo?.excludeFromIndex ? { follow: false, index: false } : undefined,
    title: article.seo?.title || article.title,
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const [article, library] = await Promise.all([getArticleBySlug(slug), getArticleLibrary()])

  if (!article) notFound()

  const category = isCategory(article.category) ? article.category : null
  const publicationDate = article.publishedAt || article.createdAt
  const articlesHref = '/articles'
  const serverURL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const canonicalURL = article.seo?.canonicalURL || `${serverURL}/articles/${article.slug}`
  const socialImage = isMedia(article.seo?.socialImage)
    ? article.seo.socialImage
    : isMedia(article.featuredImage)
      ? article.featuredImage
      : null
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    author: article.authorName
      ? {
          '@type': 'Person',
          name: article.authorName,
        }
      : undefined,
    dateModified: article.updatedAt,
    datePublished: publicationDate,
    description: article.seo?.description || article.summary,
    headline: article.seo?.title || article.title,
    image: socialImage?.url || undefined,
    mainEntityOfPage: canonicalURL,
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
