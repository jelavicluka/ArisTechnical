'use client'

import { useEffect, useMemo, useState } from 'react'

import type { LibraryArticle, LibraryCategory } from '@/utilities/getArticleLibrary'

import styles from './library.module.css'

type Props = {
  articles: LibraryArticle[]
  categories: LibraryCategory[]
}

const formatDate = (date: string | null | undefined) =>
  date
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(date))
    : 'Unscheduled'

const categoryFromHash = (categories: LibraryCategory[]) => {
  const slug = window.location.hash.slice(1)
  return categories.some((category) => category.slug === slug) ? slug : 'all'
}

export function ArticlesLibrary({ articles, categories }: Props) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const normalizedQuery = query.trim().toLocaleLowerCase()

  useEffect(() => {
    const syncHash = () => setSelectedCategory(categoryFromHash(categories))
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [categories])

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        if (selectedCategory !== 'all' && article.category.slug !== selectedCategory) return false
        if (!normalizedQuery) return true

        return [article.title, article.summary, article.category.title, article.category.shortTitle]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      }),
    [articles, normalizedQuery, selectedCategory],
  )

  const activeCategory = categories.find((category) => category.slug === selectedCategory)

  const selectCategory = (slug: string) => {
    setSelectedCategory(slug)
    window.history.replaceState(null, '', slug === 'all' ? '/articles' : `/articles#${slug}`)
  }

  const clearFilters = () => {
    setQuery('')
    selectCategory('all')
  }

  return (
    <>
      <section className={styles.hero} aria-labelledby="articles-title">
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.container}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Articles</span>
          </nav>
          <p className={styles.eyebrow}>Technical library</p>
          <h1 id="articles-title">
            ARIS technical articles
            <br /> <em>built around real problems.</em>
          </h1>
          <p className={styles.intro}>
            Practical guides, examples and troubleshooting notes for ARIS administrators, developers,
            architects and technical consultants.
          </p>
          <div className={styles.search}>
            <label className={styles.visuallyHidden} htmlFor="article-search">
              Search technical articles
            </label>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              id="article-search"
              type="search"
              placeholder="Search articles, topics or technical terms..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <span>{articles.length} guides</span>
          </div>
        </div>
      </section>

      <section className={styles.listSection} id="article-list" aria-live="polite">
        <div className={styles.container}>
          <div className={styles.listHeading}>
            <div>
              <p className={styles.eyebrow}>{normalizedQuery ? 'Search results' : 'Technical articles'}</p>
              <h2>{activeCategory?.shortTitle || 'All articles'}</h2>
            </div>
            <p>
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} · Newest first
            </p>
          </div>

          <div className={styles.filterBar} aria-label="Filter articles by technical area">
            <button
              className={selectedCategory === 'all' ? styles.active : undefined}
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => selectCategory('all')}
            >
              All articles <span>{articles.length}</span>
            </button>
            {categories.map((category) => {
              const count = articles.filter((article) => article.category.slug === category.slug).length
              return (
                <button
                  className={selectedCategory === category.slug ? styles.active : undefined}
                  type="button"
                  aria-pressed={selectedCategory === category.slug}
                  onClick={() => selectCategory(category.slug)}
                  key={category.slug}
                >
                  {category.shortTitle} <span>{count}</span>
                </button>
              )
            })}
          </div>

          {normalizedQuery || selectedCategory !== 'all' ? (
            <div className={styles.filterSummary}>
              <span>
                Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}
                {normalizedQuery ? ` for “${query.trim()}”` : ''}
              </span>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : null}

          {filteredArticles.length ? (
            <div className={styles.articleList}>
              {filteredArticles.map((article) => (
                <article className={styles.article} key={article.slug}>
                  <div>
                    <p className={styles.category}>{article.category.shortTitle}</p>
                    <h3>
                      <a href={`/articles/${article.slug}`}>{article.title}</a>
                    </h3>
                    <p className={styles.summary}>{article.summary}</p>
                  </div>
                  <div className={styles.meta}>
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>{article.readingTime || 1} min read</span>
                    <a href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}>
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M4 10h11M11 6l4 4-4 4" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyResults}>
              <span>404</span>
              <h3>No matching articles yet.</h3>
              <p>Try a broader term such as API, scripting, LDAP, APG or installation.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
