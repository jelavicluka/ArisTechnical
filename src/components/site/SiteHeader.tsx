'use client'

import { useEffect, useState } from 'react'

import type { LibraryCategory } from '@/utilities/getArticleLibrary'

type Props = {
  categories: LibraryCategory[]
  currentPage?: 'articles' | 'contact' | 'home' | 'services'
}

const BrandMark = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 8 8 54h12.5L32 31.8 43.5 54H56L32 8Z" fill="currentColor" />
    <path d="M32 31.8 43.5 54H33.8L27.1 41.1 32 31.8Z" fill="var(--violet)" />
  </svg>
)

export function SiteHeader({ categories, currentPage = 'home' }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [articlesOpen, setArticlesOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setArticlesOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const closeNavigation = () => {
    setMenuOpen(false)
    setArticlesOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Aris Technical home" onClick={closeNavigation}>
          <span className="brand-mark">
            <BrandMark />
          </span>
          <span className="brand-name">
            <strong>ARIS</strong>
            <span>TECHNICAL</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <nav
          id="primary-navigation"
          className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
          aria-label="Primary navigation"
        >
          <a
            className={`nav-link${currentPage === 'home' ? ' is-active' : ''}`}
            href="/"
            aria-current={currentPage === 'home' ? 'page' : undefined}
            onClick={closeNavigation}
          >
            Home
          </a>

          <div className={`nav-dropdown${articlesOpen ? ' is-open' : ''}`}>
            <button
              className={`nav-link dropdown-toggle${currentPage === 'articles' ? ' is-active' : ''}`}
              type="button"
              aria-expanded={articlesOpen}
              aria-controls="articles-menu"
              onClick={() => setArticlesOpen((open) => !open)}
            >
              Articles
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>

            <div className="dropdown-panel" id="articles-menu">
              <div className="dropdown-heading">
                <span>Technical library</span>
                <a className="view-all-link" href="/articles" onClick={closeNavigation}>
                  View all articles <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="category-list">
                {categories.map((category, index) => (
                  <a href={`/articles#${category.slug}`} key={category.slug} onClick={closeNavigation}>
                    <span className="category-number">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <strong>{category.title}</strong>
                      <small>{category.description}</small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            className={`nav-link${currentPage === 'services' ? ' is-active' : ''}`}
            href="/services"
            aria-current={currentPage === 'services' ? 'page' : undefined}
            onClick={closeNavigation}
          >
            Services
          </a>
          <a
            className={`contact-link${currentPage === 'contact' ? ' is-active' : ''}`}
            href="/contact"
            aria-current={currentPage === 'contact' ? 'page' : undefined}
            onClick={closeNavigation}
          >
            Discuss a project <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
