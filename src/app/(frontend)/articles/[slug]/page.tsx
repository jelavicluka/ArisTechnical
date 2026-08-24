import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleContent } from '@/components/article/ArticleContent'
import type { Category, Media } from '@/payload-types'
import { getArticleBySlug } from '@/utilities/getArticleBySlug'

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
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const category = isCategory(article.category) ? article.category : null
  const publicationDate = article.publishedAt || article.createdAt

  return (
    <div className={styles.articlePage}>
      <header className={styles.siteHeader}>
        <Link className={styles.brandLink} href="/" aria-label="Technical library home">
          <img src="/aris-technical-mark.svg" alt="" width="31" height="31" />
          <span>Technical library</span>
        </Link>
        <Link className={styles.backLink} href="/">
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="m10 3-5 5 5 5" />
          </svg>
          Back to home
        </Link>
      </header>

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
            <Link href="/">Return to the technical library</Link>
          </footer>
        </article>
      </main>
    </div>
  )
}
