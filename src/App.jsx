import { useEffect, useState } from 'react'
import './App.css'

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
    description: 'Configuration, users, permissions, authentication and practical troubleshooting for stable ARIS environments.',
    topics: ['Access control', 'LDAP & SSO', 'Troubleshooting'],
  },
  {
    number: '02',
    title: 'ARIS Scripting',
    description: 'Report scripts, macros and JavaScript solutions that turn repetitive tasks into reliable workflows.',
    topics: ['Report scripts', 'Macros', 'JavaScript'],
  },
  {
    number: '03',
    title: 'APG & Automation',
    description: 'ARIS Process Governance workflows and automation designed around real business processes.',
    topics: ['APG workflows', 'Approvals', 'Automation'],
  },
  {
    number: '04',
    title: 'REST API & Integrations',
    description: 'Connect ARIS to enterprise applications through APIs, synchronized data and custom integrations.',
    topics: ['REST APIs', 'Repository data', 'System integration'],
  },
  {
    number: '05',
    title: 'Installation & Setup',
    description: 'Infrastructure planning, installation, configuration and technical setup of ARIS environments.',
    topics: ['Installation', 'Infrastructure', 'Configuration'],
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

function BrandMark() {
  return (
    <svg viewBox="0 0 38 38" aria-hidden="true">
      <path d="M13 8H8v22h5M25 8h5v22h-5" />
      <path d="m14 25 5-13 5 13M16.2 20h5.6" />
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

function Header() {
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
        <a className="brand" href="#top" aria-label="Aris Technical home" onClick={closeNavigation}>
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
          <a className="nav-link is-active" href="#top" aria-current="page" onClick={closeNavigation}>Home</a>

          <div className={`nav-dropdown${articlesOpen ? ' is-open' : ''}`}>
            <button
              className="nav-link dropdown-toggle"
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
                <a className="view-all-link" href="#articles" onClick={closeNavigation}>
                  View all articles <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="category-list">
                {articleCategories.map(([title, description], index) => (
                  <a href={`#category-${index + 1}`} key={title} onClick={closeNavigation}>
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

          <a className="nav-link" href="#services" onClick={closeNavigation}>Services</a>
          <a className="contact-link" href="#contact" onClick={closeNavigation}>
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

function App() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />

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
              <a className="button button-primary" href="#articles">Explore technical articles <span aria-hidden="true">→</span></a>
              <a className="button button-secondary" href="#contact">Discuss your project <ArrowIcon /></a>
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
                <a className={`expertise-card expertise-card-${index + 1}`} id={`category-${index + 1}`} href="#articles" key={area.title}>
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
              action={{ label: 'View all articles', href: '#articles' }}
            />
            <div className="articles-grid">
              {latestArticles.map((article, index) => (
                <article className="article-card" key={article.title}>
                  <div className="article-card-top">
                    <span className="article-index">0{index + 1}</span>
                    <span className="article-category">{article.category}</span>
                  </div>
                  <h3><a href={`#article-${index + 1}`}>{article.title}</a></h3>
                  <p>{article.description}</p>
                  <div className="article-card-footer">
                    <span>{article.date} · {article.readTime}</span>
                    <a href={`#article-${index + 1}`} aria-label={`Read ${article.title}`}><ArrowIcon /></a>
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
              <a className="button button-primary" href="#contact">Discuss your project <ArrowIcon /></a>
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
              {topicLinks.map((topic) => <a href="#articles" key={topic}>{topic} <ArrowIcon /></a>)}
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
              <a className="button button-primary" href="#contact">Discuss your project <ArrowIcon /></a>
              <a className="button button-secondary" href="#articles">Browse articles <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-main">
          <div className="footer-brand">
            <a className="brand" href="#top" aria-label="Aris Technical home">
              <span className="brand-mark"><BrandMark /></span>
              <span className="brand-name"><strong>ARIS</strong><span>TECHNICAL</span></span>
            </a>
            <p>Practical ARIS technical knowledge and professional consulting.</p>
          </div>
          <div className="footer-links">
            <div><h3>Navigate</h3><a href="#top">Home</a><a href="#articles">Articles</a><a href="#services">Services</a><a href="#contact">Contact</a></div>
            <div><h3>Technical areas</h3>{articleCategories.map(([title], index) => <a href={`#category-${index + 1}`} key={title}>{title}</a>)}</div>
          </div>
        </div>
        <div className="content-container footer-bottom">
          <span>© 2026 Aris Technical</span>
          <span>Built around useful technical knowledge.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
