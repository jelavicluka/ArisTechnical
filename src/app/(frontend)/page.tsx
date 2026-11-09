import type { Metadata } from 'next'

import { HomeArticleSearch } from '@/components/home/HomeArticleSearch'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { isFeaturedArticle } from '@/utilities/featuredArticle'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'
import { buildPageMetadata, getSiteSettings } from '@/utilities/siteSettings'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return buildPageMetadata({
    absoluteTitle: true,
    description: settings.defaultSEODescription,
    path: '/',
    title: settings.defaultSEOTitle,
  })
}

const topicsByCategory: Record<string, string[]> = {
  administration: ['Method & filters', 'Model & object types', 'Databases', 'Access & troubleshooting'],
  scripting: ['Custom reports', 'Macros', 'JavaScript', 'Version compatibility'],
  'apg-automation': ['Approval workflows', 'APG development', 'Escalations', 'Automation'],
  'rest-api-integrations': ['REST APIs', 'Power BI & Tableau', 'CMDB systems', 'Data synchronization'],
  'installation-setup': ['Installation', 'Configuration', 'Upgrades', 'Environment setup'],
  'connect-customization': ['Connect', 'Customization', 'CSS', 'Navigation'],
}

const topicLinks = [
  ['REST API authentication', 'rest-api-integrations'],
  ['LDAP synchronization', 'administration'],
  ['ARIS report scripting', 'scripting'],
  ['APG workflows', 'apg-automation'],
  ['User & permission management', 'administration'],
  ['Power BI integrations', 'rest-api-integrations'],
  ['Installation troubleshooting', 'installation-setup'],
  ['Repository API', 'rest-api-integrations'],
]

const formatDate = (date: string | null | undefined) =>
  date
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(
        new Date(date),
      )
    : 'Recently published'

export default async function HomePage() {
  const { articles, categories } = await getArticleLibrary()
  const featured = articles.find(isFeaturedArticle) || articles[0]
  const latestArticles = articles.filter((article) => article.slug !== featured?.slug).slice(0, 4)
  const featuredImage = featured?.featuredImage && typeof featured.featuredImage === 'object'
    ? featured.featuredImage
    : null

  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader categories={categories} currentPage="home" />

      <main id="main-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-grid" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">ARIS knowledge & consulting</p>
            <h1 id="hero-title">Technical solutions for<br /> <em>ARIS environments.</em></h1>
            <p className="intro-copy">
              Practical technical guides, solutions and professional support for ARIS administration,
              development, automation and integration.
            </p>
            <HomeArticleSearch />
            <div className="hero-actions">
              <a className="button button-primary" href="/articles">Explore technical articles <span aria-hidden="true">→</span></a>
              <a className="button button-secondary" href="/contact">Discuss your project <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-topics" aria-label="Core areas of expertise">
              <span>Administration</span><i /><span>Scripting</span><i /><span>APG</span><i />
              <span>REST API</span><i /><span>Integrations</span>
            </div>
          </div>
        </section>

        {featured ? (
          <section className="content-section featured-section" aria-labelledby="featured-title">
            <div className="content-container">
              <article className="featured-article">
                {featuredImage?.url ? (
                  <div className="featured-code featured-diagram">
                    <img src={featuredImage.url} alt={featuredImage.alt} width={featuredImage.width || undefined} height={featuredImage.height || undefined} />
                  </div>
                ) : <div className="featured-code" aria-hidden="true">
                  <div className="code-window-bar"><i /><i /><i /><span>authentication.js</span></div>
                  <pre><code><span className="code-violet">const</span> response = <span className="code-violet">await</span> fetch(<br />  <span className="code-green">&apos;/aris/api/repository&apos;</span>,<br />  {'{'}<br />    method: <span className="code-green">&apos;GET&apos;</span>,<br />    headers: {'{'}<br />      Authorization: <span className="code-blue">{'`Bearer ${token}`'}</span><br />    {'}'}<br />  {'}'}<br />)</code></pre>
                  <span className="status-line"><i /> 200 OK · application/json</span>
                </div>}
                <div className="featured-copy">
                  <span className="featured-badge"><span aria-hidden="true">★</span> Featured guide</span>
                  <p className="article-category">{featured.category.shortTitle}</p>
                  <h2 id="featured-title">{featured.title}</h2>
                  <p>{featured.summary}</p>
                  <div className="article-meta">
                    <span>{featured.readingTime || 1} min read</span>
                    <span>Updated {formatDate(featured.publishedAt)}</span>
                  </div>
                  <a className="button button-primary" href={`/articles/${featured.slug}`}>Read the complete guide <span aria-hidden="true">→</span></a>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="content-section expertise-section" id="expertise">
          <div className="content-container">
            <div className="section-heading">
              <div>
                <p className="section-label">Technical expertise</p>
                <h2>Focused on the technical side of ARIS.</h2>
                <p className="section-description">Explore practical guidance across the technical areas at the core of reliable ARIS environments.</p>
              </div>
            </div>
            <div className="expertise-grid">
              {categories.map((category, index) => (
                <a className={`expertise-card expertise-card-${index + 1}`} id={`category-${index + 1}`} href={`/articles#${category.slug}`} key={category.slug}>
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <ul aria-label={`${category.title} topics`}>
                    {(topicsByCategory[category.slug] || []).map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                  <span className="card-link">Explore this area <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section articles-section" id="articles">
          <div className="content-container">
            <div className="section-heading">
              <div>
                <p className="section-label">From the technical library</p>
                <h2>Latest technical articles for ARIS</h2>
                <p className="section-description">Practical answers to real administration, development and integration challenges.</p>
              </div>
              <a className="text-link" href="/articles">View all articles <span aria-hidden="true">→</span></a>
            </div>
            <div className="articles-grid">
              {latestArticles.map((article, index) => (
                <article className="article-card" key={article.slug}>
                  <div className="article-card-top">
                    <span className="article-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="article-category">{article.category.shortTitle}</span>
                  </div>
                  <h3><a href={`/articles/${article.slug}`}>{article.title}</a></h3>
                  <p>{article.summary}</p>
                  <div className="article-card-footer">
                    <span>{formatDate(article.publishedAt)} · {article.readingTime || 1} min read</span>
                    <a href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}>↗</a>
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
              <h2>Need technical help with ARIS?</h2>
              <p>I provide focused technical consulting and development for integrations, automation, scripting, administration and custom ARIS solutions.</p>
              <a className="button button-primary" href="/services">Explore services <span aria-hidden="true">↗</span></a>
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
            <div className="section-heading">
              <div>
                <p className="section-label">Explore by topic</p>
                <h2>Find the technical answer you need.</h2>
                <p className="section-description">Start with a common ARIS topic or browse the complete technical library.</p>
              </div>
            </div>
            <div className="topic-links">
              {topicLinks.map(([label, category]) => <a href={`/articles#${category}`} key={label}>{label} <span aria-hidden="true">↗</span></a>)}
            </div>
          </div>
        </section>

        <section className="final-cta" id="contact">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="content-container final-cta-content">
            <p className="section-label">Let&apos;s solve it</p>
            <h2>Have a technical problem in ARIS?</h2>
            <p>Tell me what you&apos;re trying to achieve and I&apos;ll let you know whether I can help.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/contact">Discuss your project <span aria-hidden="true">↗</span></a>
              <a className="button button-secondary" href="/articles">Browse articles <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter categories={categories} />
    </div>
  )
}
