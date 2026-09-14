import type { Metadata } from 'next'

import { ArticlesLibrary } from '@/components/library/ArticlesLibrary'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'
import { buildPageMetadata } from '@/utilities/siteSettings'

import styles from '@/components/library/library.module.css'

export const dynamic = 'force-dynamic'

export const generateMetadata = (): Promise<Metadata> =>
  buildPageMetadata({
    description:
      'Practical technical articles covering ARIS administration, scripting, Process Governance, REST APIs, integrations, installation and setup.',
    path: '/articles',
    title: 'Technical Articles & Guides for ARIS',
  })

export default async function ArticlesPage() {
  const { articles, categories } = await getArticleLibrary()

  return (
    <div className={styles.page} id="top">
      <a className="skip-link" href="#article-list">Skip to articles</a>
      <SiteHeader categories={categories} currentPage="articles" />

      <main>
        <ArticlesLibrary articles={articles} categories={categories} />
      </main>

      <SiteFooter categories={categories} />
    </div>
  )
}
