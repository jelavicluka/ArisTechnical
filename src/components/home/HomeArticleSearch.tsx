'use client'

import { useEffect, useRef, useState } from 'react'

type SearchResult = {
  category: string
  matchSource: 'Article text' | 'Code' | 'Summary' | 'Title'
  slug: string
  snippet: string
  title: string
}

const HighlightSearchTerm = ({ query, text }: { query: string; text: string }) => {
  const matchIndex = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
  if (matchIndex < 0 || !query) return text
  const matchEnd = matchIndex + query.length

  return <>{text.slice(0, matchIndex)}<mark>{text.slice(matchIndex, matchEnd)}</mark>{text.slice(matchEnd)}</>
}

export function HomeArticleSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [state, setState] = useState<'error' | 'idle' | 'loading' | 'ready'>('idle')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const normalizedQuery = query.trim()

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([])
      setState('idle')
      setActiveIndex(-1)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setState('loading')
      setIsOpen(true)
      try {
        const response = await fetch(`/api/article-search?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Article search failed.')
        const data = (await response.json()) as { results: SearchResult[] }
        setResults(data.results)
        setActiveIndex(data.results.length ? 0 : -1)
        setState('ready')
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([])
          setActiveIndex(-1)
          setState('error')
        }
      }
    }, 220)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [normalizedQuery])

  const openResult = (index: number) => {
    const result = results[index]
    if (result) window.location.assign(`/articles/${result.slug}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((current) => (current + 1) % results.length)
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      openResult(activeIndex)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div className="home-article-search" ref={searchRef}>
      <label htmlFor="home-article-search">Search the technical library</label>
      <div className={`home-search-field${isOpen ? ' is-open' : ''}`}>
        <svg className="home-search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
        </svg>
        <input
          id="home-article-search"
          type="search"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="home-search-suggestions"
          aria-expanded={isOpen && normalizedQuery.length >= 2}
          aria-activedescendant={activeIndex >= 0 ? `home-search-result-${activeIndex}` : undefined}
          placeholder="Search articles, technical topics or source code..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => normalizedQuery.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {state === 'loading' ? <span className="home-search-loader" aria-label="Searching" /> : null}
        {query ? (
          <button className="home-search-clear" type="button" aria-label="Clear search" onClick={clearSearch}>×</button>
        ) : (
          <span className="home-search-shortcut">Titles · text · code</span>
        )}
      </div>

      {isOpen && normalizedQuery.length >= 2 ? (
        <div className="home-search-suggestions" id="home-search-suggestions" role="listbox">
          {state === 'loading' ? <p className="home-search-message">Searching the technical library…</p> : null}
          {state === 'error' ? <p className="home-search-message is-error">Search is temporarily unavailable.</p> : null}
          {state === 'ready' && !results.length ? <p className="home-search-message">No articles match “{normalizedQuery}”.</p> : null}
          {results.map((result, index) => (
            <a
              className={`home-search-result${activeIndex === index ? ' is-active' : ''}`}
              href={`/articles/${result.slug}`}
              id={`home-search-result-${index}`}
              key={result.slug}
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="home-search-result-topline">
                <span>{result.category}</span>
                <small className={result.matchSource === 'Code' ? 'is-code-match' : ''}>Match in {result.matchSource.toLocaleLowerCase()}</small>
              </span>
              <strong><HighlightSearchTerm query={normalizedQuery} text={result.title} /></strong>
              <p className={result.matchSource === 'Code' ? 'is-code-snippet' : ''}>
                <HighlightSearchTerm query={normalizedQuery} text={result.snippet} />
              </p>
            </a>
          ))}
          {state === 'ready' && results.length ? (
            <div className="home-search-hint"><span>↑↓ Navigate</span><span>Enter to open</span></div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
