import { useEffect, useState } from 'react'
import './App.css'
import AdminPage from './AdminPage.jsx'
import { formatArticleDate, loadArticles } from './articleStore.js'

const articleCategories = [
  ['ARIS Administration', 'Configuration, access & troubleshooting'],
  ['ARIS Scripting', 'Reports, macros & JavaScript'],
  ['APG & Automation', 'Workflows & process automation'],
  ['REST API & Integrations', 'APIs, data & connected systems'],
  ['Installation & Setup', 'Infrastructure & environments'],
]

const expertiseAreas = [
  {
    number: '01',
    title: 'ARIS Administration',
    description: 'ARIS Method and filter configuration covering model and object types, symbols and conventions—alongside database administration and platform support.',
    topics: ['ARIS Method & filters', 'Model & object types', 'Symbols & conventions', 'Database administration', 'Access & troubleshooting'],
  },
  {
    number: '02',
    title: 'ARIS Scripting',
    description: 'Custom reports, macros and JavaScript solutions, including adaptations that keep existing reports working across ARIS version changes.',
    topics: ['Custom reports', 'Macros', 'JavaScript', 'Java Packages', 'Version compatibility updates'],
  },
  {
    number: '03',
    title: 'APG & Automation',
    description: 'ARIS Process Governance workflows and automation designed around real business processes.',
    topics: ['Approval workflows', 'APG development', 'Escalations', 'Automation'],
  },
  {
    number: '04',
    title: 'REST API & Integrations',
    description: 'Connect ARIS to enterprise applications through APIs, synchronized data and custom integrations.',
    topics: ['REST APIs', 'Power BI & Tableau', 'CMDB systems', 'Data synchronization'],
  },
  {
    number: '05',
    title: 'Installation & Setup',
    description: 'Infrastructure planning, installation, configuration and technical setup of ARIS environments.',
    topics: ['Installation', 'Configuration', 'Upgrades', 'Environment setup'],
  },
]

const latestArticles = [
  {
    category: 'REST API & Integrations',
    title: 'How to Retrieve ARIS Models Using the REST API',
    description: 'A practical walkthrough of authentication, repository access and model data retrieval.',
    date: '18 Aug 2026',
    readTime: '9 min read',
  },
  {
    category: 'ARIS Administration',
    title: 'Configure LDAP User Synchronization in ARIS',
    description: 'Understand the core settings, mappings and checks needed for reliable LDAP synchronization.',
    date: '12 Aug 2026',
    readTime: '11 min read',
  },
  {
    category: 'ARIS Scripting',
    title: 'Export ARIS Model Data to Excel with a Report Script',
    description: 'Build a reusable report script that turns model and object data into a structured export.',
    date: '04 Aug 2026',
    readTime: '13 min read',
  },
  {
    category: 'APG & Automation',
    title: 'Building an Approval Workflow with ARIS Process Governance',
    description: 'A technical introduction to workflow structure, roles, triggers and error handling in APG.',
    date: '27 Jul 2026',
    readTime: '10 min read',
  },
]

const topicLinks = [
  'REST API authentication',
  'LDAP synchronization',
  'ARIS report scripting',
  'APG workflows',
  'User & permission management',
  'Power BI integrations',
  'Installation troubleshooting',
  'Repository API',
]

const serviceAreas = [
  {
    number: '01',
    title: 'ARIS custom reports & scripts',
    description: 'Purpose-built reports, macros and JavaScript solutions, including adaptations that keep existing reports working across ARIS version changes.',
    outcomes: ['Custom reports', 'Macros', 'JavaScript', 'Java Packages', 'Version compatibility updates'],
  },
  {
    number: '02',
    title: 'ARIS Connect Portal customizations',
    description: 'Portal experiences adapted to the way your users find, understand and work with published ARIS content.',
    outcomes: ['Layouts & views', 'Custom solutions', 'Customizations'],
  },
  {
    number: '03',
    title: 'ARIS Process Governance automation',
    description: 'APG workflows and automated processes designed around clear roles, reliable handovers and maintainable logic.',
    outcomes: ['Approval workflows', 'APG development', 'Escalations', 'Automation'],
  },
  {
    number: '04',
    title: 'ARIS integrations',
    description: 'Reliable data exchange between ARIS and enterprise platforms through REST APIs and appropriate integration patterns.',
    outcomes: ['REST APIs', 'Power BI & Tableau', 'CMDB systems', 'Data synchronization'],
  },
  {
    number: '05',
    title: 'ARIS installation & technical setup',
    description: 'Environment planning, installation, configuration and upgrades with the infrastructure around ARIS taken into account.',
    outcomes: ['Installation', 'Configuration', 'Upgrades', 'Environment setup'],
  },
  {
    number: '06',
    title: 'ARIS administration & technical support',
    description: 'ARIS Method and filter configuration covering model and object types, filters, symbols and modeling conventions—alongside database administration and platform support.',
    outcomes: ['ARIS Method & filters', 'Model & object types', 'Symbols & conventions', 'Database administration', 'Access & troubleshooting'],
  },
]

const contactTopics = [
  'ARIS administration',
  'Custom reports & scripts',
  'Connect Portal customization',
  'APG & automation',
  'Integration',
  'Installation & upgrade',
  'Troubleshooting or code review',
  'Another technical challenge',
]

const categoryPages = [
  {
    slug: 'administration',
    number: '01',
    title: 'ARIS Administration',
    shortTitle: 'Administration',
    description: 'ARIS Method and filter configuration, databases, access, authentication and practical troubleshooting for stable ARIS environments.',
    topics: ['Method & filters', 'Model & object types', 'Databases', 'Access & troubleshooting'],
  },
  {
    slug: 'scripting',
    number: '02',
    title: 'ARIS Scripting',
    shortTitle: 'Scripting',
    description: 'Report scripts, macros, JavaScript development and reusable automation for everyday technical work.',
    topics: ['Report scripts', 'Macros', 'JavaScript', 'Data exports'],
  },
  {
    slug: 'apg-automation',
    number: '03',
    title: 'ARIS Process Governance & Automation',
    shortTitle: 'APG & Automation',
    description: 'Technical guides for ARIS Process Governance workflows, approvals, automation and related development.',
    topics: ['APG workflows', 'Approvals', 'Triggers', 'Automation'],
  },
  {
    slug: 'rest-api-integrations',
    number: '04',
    title: 'ARIS REST API & Integrations',
    shortTitle: 'REST API & Integrations',
    description: 'Authentication, repository access, data exchange and integrations with external enterprise systems.',
    topics: ['Authentication', 'Repository API', 'Data exchange', 'Integrations'],
  },
  {
    slug: 'installation-setup',
    number: '05',
    title: 'ARIS Installation & Setup',
    shortTitle: 'Installation & Setup',
    description: 'Installation, infrastructure, configuration and technical setup guidance for ARIS environments.',
    topics: ['Installation', 'Infrastructure', 'Configuration', 'Upgrades'],
  },
]

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 8 8 54h12.5L32 31.8 43.5 54H56L32 8Z"
        fill="currentColor"
      />
      <path
        d="M32 31.8 43.5 54H33.8L27.1 41.1 32 31.8Z"
        fill="var(--violet)"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function Header({ currentPage = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [articlesOpen, setArticlesOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
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
          <span className="brand-mark"><BrandMark /></span>
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
          onClick={() => setMenuOpen((current) => !current)}
        >
          <MenuIcon open={menuOpen} />
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
              onClick={() => setArticlesOpen((current) => !current)}
            >
              Articles <ChevronIcon />
            </button>

            <div className="dropdown-panel" id="articles-menu">
              <div className="dropdown-heading">
                <span>Technical library</span>
                <a className="view-all-link" href="/articles/" onClick={closeNavigation}>
                  View all articles <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="category-list">
                {articleCategories.map(([title, description], index) => (
                  <a href={`/articles/#${categoryPages[index].slug}`} key={title} onClick={closeNavigation}>
                    <span className="category-number">0{index + 1}</span>
                    <span>
                      <strong>{title}</strong>
                      <small>{description}</small>
                    </span>
                    <ArrowIcon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            className={`nav-link${currentPage === 'services' ? ' is-active' : ''}`}
            href="/services/"
            aria-current={currentPage === 'services' ? 'page' : undefined}
            onClick={closeNavigation}
          >
            Services
          </a>
          <a
            className={`contact-link${currentPage === 'contact' ? ' is-active' : ''}`}
            href="/contact/"
            aria-current={currentPage === 'contact' ? 'page' : undefined}
            onClick={closeNavigation}
          >
            Discuss a project <ArrowIcon />
          </a>
        </nav>
      </div>
    </header>
  )
}

function SectionHeading({ label, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        <p className="section-label">{label}</p>
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action && <a className="text-link" href={action.href}>{action.label} <span aria-hidden="true">→</span></a>}
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-container footer-main">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="Aris Technical home">
            <span className="brand-mark"><BrandMark /></span>
            <span className="brand-name"><strong>ARIS</strong><span>TECHNICAL</span></span>
          </a>
          <p>Practical ARIS technical knowledge and professional consulting.</p>
        </div>
        <div className="footer-links">
          <div>
            <h3>Navigate</h3>
            <a href="/">Home</a>
            <a href="/articles/">Articles</a>
            <a href="/services/">Services</a>
            <a href="/contact/">Contact</a>
          </div>
          <div>
            <h3>Technical areas</h3>
            {categoryPages.map((category) => (
              <a href={`/articles/#${category.slug}`} key={category.slug}>{category.title}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="content-container footer-bottom">
        <span>© 2026 Aris Technical</span>
        <span>Built around useful technical knowledge.</span>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage="home" />

      <main id="main-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-grid" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">ARIS knowledge & consulting</p>
            <h1 id="hero-title">Technical expertise for<br /> <em>ARIS environments.</em></h1>
            <p className="intro-copy">
              Practical technical guides, solutions and professional support for ARIS administration,
              development, automation and integration.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/articles/">Explore technical articles <span aria-hidden="true">→</span></a>
              <a className="button button-secondary" href="/contact/">Discuss your project <ArrowIcon /></a>
            </div>
            <div className="hero-topics" aria-label="Core areas of expertise">
              <span>Administration</span><i />
              <span>Scripting</span><i />
              <span>APG</span><i />
              <span>REST API</span><i />
              <span>Integrations</span>
            </div>
          </div>
        </section>

        <section className="content-section expertise-section" id="expertise">
          <div className="content-container">
            <SectionHeading
              label="Technical expertise"
              title="Focused on the technical side of ARIS."
              description="Explore practical guidance across the five areas at the core of reliable ARIS environments."
            />
            <div className="expertise-grid">
              {expertiseAreas.map((area, index) => (
                <a className={`expertise-card expertise-card-${index + 1}`} id={`category-${index + 1}`} href={`/articles/#${categoryPages[index].slug}`} key={area.title}>
                  <span className="card-number">{area.number}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <ul aria-label={`${area.title} topics`}>
                    {area.topics.map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                  <span className="card-link">Explore this area <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section featured-section" aria-labelledby="featured-title">
          <div className="content-container">
            <article className="featured-article">
              <div className="featured-code" aria-hidden="true">
                <div className="code-window-bar"><i /><i /><i /><span>authentication.js</span></div>
                <pre><code><span className="code-violet">const</span> response = <span className="code-violet">await</span> fetch(<br />  <span className="code-green">'/aris/api/repository'</span>,<br />  {'{'}<br />    method: <span className="code-green">'GET'</span>,<br />    headers: {'{'}<br />      Authorization: <span className="code-blue">`Bearer ${'{'}token{'}'}`</span><br />    {'}'}<br />  {'}'}<br />)</code></pre>
                <span className="status-line"><i /> 200 OK · application/json</span>
              </div>
              <div className="featured-copy">
                <p className="section-label">Featured technical guide</p>
                <p className="article-category">REST API & Integrations</p>
                <h2 id="featured-title">ARIS Repository API Authentication: Guide and Examples</h2>
                <p>Learn how authentication works, structure requests correctly and diagnose the most common authorization failures.</p>
                <div className="article-meta"><span>14 min read</span><span>Updated 18 Aug 2026</span></div>
                <a className="button button-primary" href="#featured-article">Read the complete guide <span aria-hidden="true">→</span></a>
              </div>
            </article>
          </div>
        </section>

        <section className="content-section articles-section" id="articles">
          <div className="content-container">
            <SectionHeading
              label="From the technical library"
              title="Latest ARIS technical articles"
              description="Practical answers to real administration, development and integration challenges."
              action={{ label: 'View all articles', href: '/articles/' }}
            />
            <div className="articles-grid">
              {latestArticles.map((article, index) => (
                <article className="article-card" key={article.title}>
                  <div className="article-card-top">
                    <span className="article-index">0{index + 1}</span>
                    <span className="article-category">{article.category}</span>
                  </div>
                  <h3><a href="/articles/">{article.title}</a></h3>
                  <p>{article.description}</p>
                  <div className="article-card-footer">
                    <span>{article.date} · {article.readTime}</span>
                    <a href="/articles/" aria-label={`Read ${article.title}`}><ArrowIcon /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section services-section" id="services">
          <div className="content-container services-layout">
            <div className="services-intro">
              <p className="section-label">Professional services</p>
              <h2>Need help with an ARIS technical challenge?</h2>
              <p>I provide focused technical consulting and development for integrations, automation, scripting, administration and custom ARIS solutions.</p>
              <a className="button button-primary" href="/services/">Explore services <ArrowIcon /></a>
            </div>
            <div className="work-steps" aria-label="How I can help">
              <div><span>01</span><h3>Diagnose</h3><p>Investigate technical problems, constraints and existing environments.</p></div>
              <div><span>02</span><h3>Develop</h3><p>Build scripts, integrations, workflows and practical automation.</p></div>
              <div><span>03</span><h3>Support</h3><p>Assist with configuration, upgrades and ongoing troubleshooting.</p></div>
            </div>
          </div>
        </section>

        <section className="content-section topics-section">
          <div className="content-container">
            <SectionHeading
              label="Explore by topic"
              title="Find the technical answer you need."
              description="Start with a common ARIS topic or browse the complete technical library."
            />
            <div className="topic-links">
              {topicLinks.map((topic) => <a href="/articles/" key={topic}>{topic} <ArrowIcon /></a>)}
            </div>
          </div>
        </section>

        <section className="final-cta" id="contact">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="content-container final-cta-content">
            <p className="section-label">Let’s solve it</p>
            <h2>Have an ARIS technical problem?</h2>
            <p>Tell me what you’re trying to achieve and I’ll let you know whether I can help.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/contact/">Discuss your project <ArrowIcon /></a>
              <a className="button button-secondary" href="/articles/">Browse articles <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function LibraryArticle({ article }) {
  const category = categoryPages.find((item) => item.slug === article.category)

  return (
    <article className="library-article">
      <div className="library-article-copy">
        <p className="article-category">{category.shortTitle}</p>
        <h3>
          <a href={`/articles/#${category.slug}`}>{article.title}</a>
        </h3>
        <p>{article.description}</p>
      </div>
      <div className="library-article-meta">
        <span>{formatArticleDate(article.date)}</span>
        <span>{article.readTime}</span>
        <a href={`/articles/#${category.slug}`} aria-label={`Read ${article.title}`}><ArrowIcon /></a>
      </div>
    </article>
  )
}

function ArticlesPage() {
  const [articles] = useState(loadArticles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const categoryFromHash = window.location.hash.slice(1)
    return categoryPages.some((category) => category.slug === categoryFromHash) ? categoryFromHash : 'all'
  })
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const publishedArticles = articles.filter((article) => article.status === 'published')
  const filteredArticles = publishedArticles.filter((article) => {
    if (selectedCategory !== 'all' && article.category !== selectedCategory) return false
    if (normalizedQuery) {
        const category = categoryPages.find((item) => item.slug === article.category)
        return [article.title, article.description, category.title, ...category.topics]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
    }
    return true
  })

  const activeCategory = categoryPages.find((category) => category.slug === selectedCategory)

  const selectCategory = (category) => {
    setSelectedCategory(category)
    const nextUrl = category === 'all' ? '/articles/' : `/articles/#${category}`
    window.history.replaceState(null, '', nextUrl)
  }

  const clearFilters = () => {
    setSearchQuery('')
    selectCategory('all')
  }

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')

    document.title = 'ARIS Technical Articles & Guides | Aris Technical'
    description?.setAttribute(
      'content',
      'Practical ARIS technical articles covering administration, scripting, Process Governance, REST APIs, integrations, installation and setup.',
    )

    return () => {
      document.title = previousTitle
      if (description && previousDescription) description.setAttribute('content', previousDescription)
    }
  }, [])

  useEffect(() => {
    const syncCategoryFromHash = () => {
      const categoryFromHash = window.location.hash.slice(1)
      setSelectedCategory(
        categoryPages.some((category) => category.slug === categoryFromHash) ? categoryFromHash : 'all',
      )
    }

    window.addEventListener('hashchange', syncCategoryFromHash)
    return () => window.removeEventListener('hashchange', syncCategoryFromHash)
  }, [])

  return (
    <div className="site-shell articles-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage="articles" />

      <main id="main-content">
        <section className="library-hero" aria-labelledby="articles-title">
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-grid" aria-hidden="true" />
          <div className="content-container library-hero-content">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Articles</span>
            </nav>
            <p className="section-label">Technical library</p>
            <h1 id="articles-title">ARIS technical articles<br /> <em>built around real problems.</em></h1>
            <p>
              Practical guides, examples and troubleshooting notes for ARIS administrators,
              developers, architects and technical consultants.
            </p>

            <div className="library-search">
              <label className="visually-hidden" htmlFor="article-search">Search technical articles</label>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
              </svg>
              <input
                id="article-search"
                type="search"
                placeholder="Search articles, topics or technical terms..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <span>{publishedArticles.length} guides</span>
            </div>
          </div>
        </section>

        <section className="content-section library-list-section" aria-live="polite">
          <div className="content-container">
            <div className="library-list-heading">
              <div>
                <p className="section-label">{normalizedQuery ? 'Search results' : 'Technical articles'}</p>
                <h2>{activeCategory ? activeCategory.shortTitle : 'All articles'}</h2>
              </div>
              <p>{filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} · Newest first</p>
            </div>

            <div className="article-filter-bar" aria-label="Filter articles by technical area">
              <button
                className={selectedCategory === 'all' ? 'is-active' : ''}
                type="button"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => selectCategory('all')}
              >
                All articles <span>{publishedArticles.length}</span>
              </button>
              {categoryPages.map((category) => {
                const articleCount = publishedArticles.filter((article) => article.category === category.slug).length
                return (
                  <button
                    className={selectedCategory === category.slug ? 'is-active' : ''}
                    type="button"
                    aria-pressed={selectedCategory === category.slug}
                    onClick={() => selectCategory(category.slug)}
                    key={category.slug}
                  >
                    {category.shortTitle} <span>{articleCount}</span>
                  </button>
                )
              })}
            </div>

            {(normalizedQuery || selectedCategory !== 'all') && (
              <div className="active-filter-summary">
                <span>
                  Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}
                  {normalizedQuery && <> for “{searchQuery.trim()}”</>}
                </span>
                <button type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            )}

            {filteredArticles.length > 0 ? (
              <div className="library-article-list unified-article-list">
                {filteredArticles.map((article) => <LibraryArticle article={article} key={article.slug} />)}
              </div>
            ) : (
              <div className="empty-results">
                <span>404</span>
                <h3>No matching articles yet.</h3>
                <p>Try another technical area or a broader term such as API, scripting, LDAP, APG or installation.</p>
              </div>
            )}
          </div>
        </section>

        <section className="library-cta">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="content-container library-cta-content">
            <div>
              <p className="section-label">Professional support</p>
              <h2>Can’t find the answer you need?</h2>
              <p>Tell me about your ARIS technical challenge and I’ll let you know whether I can help.</p>
            </div>
            <a className="button button-primary" href="/contact/">Discuss your project <ArrowIcon /></a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ServicesPage() {
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')

    document.title = 'ARIS Technical Services & Development | Aris Technical'
    description?.setAttribute(
      'content',
      'Professional ARIS services for scripting, Connect Portal customization, Process Governance, integrations, installations, administration, troubleshooting and code improvement.',
    )

    return () => {
      document.title = previousTitle
      if (description && previousDescription) description.setAttribute('content', previousDescription)
    }
  }, [])

  return (
    <div className="site-shell services-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage="services" />

      <main id="main-content">
        <section className="service-hero" aria-labelledby="services-title">
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-grid" aria-hidden="true" />
          <div className="content-container service-hero-layout">
            <div className="service-hero-copy">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Services</span>
              </nav>
              <p className="section-label">ARIS technical services</p>
              <h1 id="services-title">Build what ARIS needs.<br />{' '}<em>Fix what holds it back.</em></h1>
              <p>
                Technical development, improvements and project delivery—together with practical help
                for bugs, difficult platform problems and existing code that needs another look.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#service-areas">Explore services <span aria-hidden="true">↓</span></a>
                <a className="button button-secondary" href="/contact/">Discuss your challenge <ArrowIcon /></a>
              </div>
            </div>

            <div className="service-scope-panel" aria-label="Available ARIS technical support">
              <div className="scope-panel-bar">
                <span><i /><i /><i /></span>
                <small>technical_scope.json</small>
                <b><i /> Available</b>
              </div>
              <div className="scope-panel-content">
                <p><span>01</span><strong>Develop</strong><small>Custom technical solutions</small></p>
                <p><span>02</span><strong>Integrate</strong><small>ARIS and connected systems</small></p>
                <p><span>03</span><strong>Diagnose</strong><small>Bugs and complex problems</small></p>
                <p><span>04</span><strong>Improve</strong><small>Reviews and refactoring</small></p>
              </div>
              <div className="scope-panel-footer"><span>ARIS technical delivery</span><strong>6 service areas</strong></div>
            </div>
          </div>
        </section>

        <section className="content-section service-areas-section" id="service-areas">
          <div className="content-container">
            <SectionHeading
              label="Key services"
              title="Technical expertise, applied to real work."
              description="From focused development tasks to larger technical projects, each service is grounded in practical ARIS implementation experience."
            />
            <div className="service-area-grid">
              {serviceAreas.map((service) => (
                <article className="service-area-card" key={service.number}>
                  <div className="service-area-card-top">
                    <span>{service.number}</span>
                    <i aria-hidden="true" />
                  </div>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <ul aria-label={`${service.title} capabilities`}>
                    {service.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section problem-solving-section">
          <div className="content-container problem-solving-layout">
            <div className="problem-solving-copy">
              <p className="section-label">Problem solving & improvement</p>
              <h2>Not every engagement starts with a new project.</h2>
              <p>
                Sometimes something is broken, unreliable or simply harder to maintain than it should be.
                Existing ARIS solutions can be investigated and improved without rebuilding everything from scratch.
              </p>
              <div className="problem-services">
                <div><span>01</span><h3>Technical problem solving</h3><p>Trace configuration, data, integration and environment issues to their actual cause.</p></div>
                <div><span>02</span><h3>Bug fixing</h3><p>Reproduce unexpected behavior, isolate failures and implement a focused correction.</p></div>
                <div><span>03</span><h3>ARIS code reviews</h3><p>Review scripts, reports and automation for correctness, clarity and maintainability.</p></div>
                <div><span>04</span><h3>Code refactoring</h3><p>Restructure existing code to make future changes safer, clearer and easier to support.</p></div>
              </div>
            </div>

            <div className="review-window" aria-label="Example ARIS code review">
              <div className="code-window-bar"><i /><i /><i /><span>report-script.js · review</span></div>
              <div className="review-summary">
                <span>TECHNICAL REVIEW</span>
                <strong>Existing solution</strong>
                <small>Analysis before change</small>
              </div>
              <pre><code><span className="review-line neutral"><i>01</i> Understand expected behavior</span>{'\n'}<span className="review-line removed"><i>02</i> - repeated query inside loop</span>{'\n'}<span className="review-line added"><i>03</i> + reusable data retrieval</span>{'\n'}<span className="review-line added"><i>04</i> + explicit error handling</span>{'\n'}<span className="review-line neutral"><i>05</i> Verify output and edge cases</span></code></pre>
              <div className="review-result"><span><i /> Review complete</span><strong>Clearer · safer · maintainable</strong></div>
            </div>
          </div>
        </section>

        <section className="service-final-cta" id="service-contact">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="content-container service-final-cta-content">
            <p className="section-label">Start with the problem</p>
            <h2>Have an ARIS technical challenge?</h2>
            <p>Tell me what you are trying to build, improve or fix and I&apos;ll let you know whether I can help.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/contact/">Discuss your project <ArrowIcon /></a>
              <a className="button button-secondary" href="/articles/">Browse technical articles <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ContactPage() {
  const [submitState, setSubmitState] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')

    document.title = 'Discuss Your ARIS Project | Aris Technical'
    description?.setAttribute(
      'content',
      'Get in touch about ARIS administration, scripting, Connect Portal customization, Process Governance, integrations, installations or another technical challenge.',
    )

    return () => {
      document.title = previousTitle
      if (description && previousDescription) description.setAttribute('content', previousDescription)
    }
  }, [])

  const submitContactForm = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    if (formData.get('website')) {
      setSubmitState('success')
      setSubmitMessage('Thank you. Your message has been received.')
      form.reset()
      return
    }

    const inquiry = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      topic: formData.get('topic'),
      message: formData.get('message'),
    }
    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim()
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim()

    setSubmitState('sending')
    setSubmitMessage('Sending your message…')

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(inquiry),
        })

        if (!response.ok) throw new Error('Contact request failed')
        form.reset()
        setSubmitState('success')
        setSubmitMessage('Message successfully sent. Thank you for getting in touch.')
        return
      } catch {
        setSubmitState('error')
        setSubmitMessage('The message could not be sent. Please try again in a moment.')
        return
      }
    }

    if (contactEmail) {
      const subject = encodeURIComponent(`[Aris Technical] ${inquiry.topic} — ${inquiry.name}`)
      const body = encodeURIComponent(
        `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nCompany: ${inquiry.company || 'Not provided'}\nTopic: ${inquiry.topic}\n\n${inquiry.message}`,
      )
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
      setSubmitState('success')
      setSubmitMessage('Your email application should now open with the project details prepared.')
      return
    }

    setSubmitState('error')
    setSubmitMessage('Email delivery is not configured yet. Add the contact endpoint or recipient email before publishing this form.')
  }

  return (
    <div className="site-shell contact-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage="contact" />

      <main id="main-content">
        <section className="contact-section" aria-labelledby="contact-title">
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-grid" aria-hidden="true" />
          <div className="content-container contact-layout">
            <div className="contact-copy">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Contact</span>
              </nav>
              <p className="section-label">Discuss your ARIS challenge</p>
              <h1 id="contact-title">Let&apos;s talk about your<br />{' '}<em>ARIS challenge.</em></h1>
              <p>
                Need help with administration, scripting, automation, integrations or another technical problem?
                Share the context and what you are trying to achieve.
              </p>

              <div className="contact-expectations" aria-label="What happens next">
                <div><span>01</span><p><strong>Describe the challenge</strong><small>A short overview is enough to start.</small></p></div>
                <div><span>02</span><p><strong>I&apos;ll review the context</strong><small>You&apos;ll hear whether and how I can help.</small></p></div>
                <div><span>03</span><p><strong>Define the next step</strong><small>No generic proposal before the problem is clear.</small></p></div>
              </div>
            </div>

            <div className="contact-form-panel">
              <div className="contact-form-heading">
                <span>Technical request</span>
                <i><b /> Direct inquiry</i>
              </div>
              <form className="contact-form" onSubmit={submitContactForm}>
                <div className="contact-form-row">
                  <label>
                    <span className="contact-field-label">Name <i aria-hidden="true">*</i></span>
                    <input name="name" type="text" autoComplete="name" placeholder="Your name" minLength="2" maxLength="100" required />
                  </label>
                  <label>
                    <span className="contact-field-label">Email <i aria-hidden="true">*</i></span>
                    <input name="email" type="email" autoComplete="email" placeholder="you@email.com" maxLength="254" required />
                  </label>
                </div>
                <label>
                  Company (optional)
                  <input name="company" type="text" autoComplete="organization" placeholder="Company or organization" maxLength="120" />
                </label>
                <label>
                  <span className="contact-field-label">What do you need help with? <i aria-hidden="true">*</i></span>
                  <select name="topic" defaultValue="" required>
                    <option value="" disabled>Select a technical area</option>
                    {contactTopics.map((topic) => <option value={topic} key={topic}>{topic}</option>)}
                  </select>
                </label>
                <label>
                  <span className="contact-field-label">Tell me about the challenge <i aria-hidden="true">*</i></span>
                  <textarea
                    name="message"
                    rows="7"
                    minLength="20"
                    maxLength="5000"
                    placeholder="Tell me about the current situation, the expected result and anything that may help explain the challenge."
                    required
                  />
                </label>
                <label className="contact-honeypot" aria-hidden="true">
                  Website
                  <input name="website" type="text" tabIndex="-1" autoComplete="off" />
                </label>
                <div className="contact-form-footer">
                  <p>Your details will only be used to respond to this inquiry.</p>
                  <button className="button button-primary" type="submit" disabled={submitState === 'sending'}>
                    {submitState === 'sending' ? 'Sending…' : 'Send message'} <ArrowIcon />
                  </button>
                </div>
                {submitMessage && (
                  <p className={`contact-form-status is-${submitState}`} role="status" aria-live="polite">{submitMessage}</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  const path = window.location.pathname
  if (path === '/admin' || path.startsWith('/admin/')) return <AdminPage />
  if (path === '/articles' || path.startsWith('/articles/')) return <ArticlesPage />
  if (path === '/services' || path.startsWith('/services/')) return <ServicesPage />
  if (path === '/contact' || path.startsWith('/contact/')) return <ContactPage />
  return <HomePage />
}

export default App
