import type { Metadata } from 'next'

import { ArticlesLibrary } from '@/components/library/ArticlesLibrary'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'

import styles from '@/components/library/library.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description:
    'Practical ARIS technical articles covering administration, scripting, Process Governance, REST APIs, integrations, installation and setup.',
  title: 'ARIS Technical Articles & Guides | Aris Technical',
}

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
