import type { Metadata } from 'next'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'
import { buildPageMetadata } from '@/utilities/siteSettings'

export const dynamic = 'force-dynamic'

export const generateMetadata = (): Promise<Metadata> =>
  buildPageMetadata({
    description:
      'Professional ARIS services for scripting, Connect Portal customization, Process Governance, integrations, installations, administration, troubleshooting and code improvement.',
    path: '/services',
    title: 'Technical Services & Development for ARIS',
  })

const serviceAreas = [
  {
    number: '01',
    title: 'ARIS custom reports & scripts',
    description:
      'Purpose-built reports, macros and JavaScript solutions, including adaptations that keep existing reports working across ARIS version changes.',
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
    description:
      'ARIS Method and filter configuration covering model and object types, filters, symbols and modeling conventions—alongside database administration and platform support.',
    outcomes: ['ARIS Method & filters', 'Model & object types', 'Symbols & conventions', 'Database administration', 'Access & troubleshooting'],
  },
]

export default async function ServicesPage() {
  const { categories } = await getArticleLibrary()

  return (
    <div className="site-shell services-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader categories={categories} currentPage="services" />

      <main id="main-content">
        <section className="service-hero" aria-labelledby="services-title">
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-grid" aria-hidden="true" />
          <div className="content-container service-hero-layout">
            <div className="service-hero-copy">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Services</span>
              </nav>
              <p className="section-label">Technical services for ARIS</p>
              <h1 id="services-title">Build what ARIS needs.<br /> <em>Fix what holds it back.</em></h1>
              <p>
                Technical development, improvements and project delivery—together with practical help
                for bugs, difficult platform problems and existing code that needs another look.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#service-areas">Explore services <span aria-hidden="true">↓</span></a>
                <a className="button button-secondary" href="/contact">Discuss your challenge <span aria-hidden="true">↗</span></a>
              </div>
            </div>

            <div className="service-scope-panel" aria-label="Available technical support for ARIS">
              <div className="scope-panel-bar">
                <span><i /><i /><i /></span><small>technical_scope.json</small><b><i /> Available</b>
              </div>
              <div className="scope-panel-content">
                <p><span>01</span><strong>Develop</strong><small>Custom technical solutions</small></p>
                <p><span>02</span><strong>Integrate</strong><small>ARIS and connected systems</small></p>
                <p><span>03</span><strong>Diagnose</strong><small>Bugs and complex problems</small></p>
                <p><span>04</span><strong>Improve</strong><small>Reviews and refactoring</small></p>
              </div>
              <div className="scope-panel-footer"><span>Technical delivery for ARIS</span><strong>6 service areas</strong></div>
            </div>
          </div>
        </section>

        <section className="content-section service-areas-section" id="service-areas">
          <div className="content-container">
            <div className="section-heading">
              <div>
                <p className="section-label">Key services</p>
                <h2>Technical expertise, applied to real work.</h2>
                <p className="section-description">From focused development tasks to larger technical projects, each service is grounded in practical ARIS implementation experience.</p>
              </div>
            </div>
            <div className="service-area-grid">
              {serviceAreas.map((service) => (
                <article className="service-area-card" key={service.number}>
                  <div className="service-area-card-top"><span>{service.number}</span><i aria-hidden="true" /></div>
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
              <p>Sometimes something is broken, unreliable or simply harder to maintain than it should be. Existing ARIS solutions can be investigated and improved without rebuilding everything from scratch.</p>
              <div className="problem-services">
                <div><span>01</span><h3>Technical problem solving</h3><p>Trace configuration, data, integration and environment issues to their actual cause.</p></div>
                <div><span>02</span><h3>Bug fixing</h3><p>Reproduce unexpected behavior, isolate failures and implement a focused correction.</p></div>
                <div><span>03</span><h3>ARIS code reviews</h3><p>Review scripts, reports and automation for correctness, clarity and maintainability.</p></div>
                <div><span>04</span><h3>Code refactoring</h3><p>Restructure existing code to make future changes safer, clearer and easier to support.</p></div>
              </div>
            </div>

            <div className="review-window" aria-label="Example ARIS code review">
              <div className="code-window-bar"><i /><i /><i /><span>report-script.js · review</span></div>
              <div className="review-summary"><span>TECHNICAL REVIEW</span><strong>Existing solution</strong><small>Analysis before change</small></div>
              <pre><code><span className="review-line neutral"><i>01</i> Understand expected behavior</span>{'\n'}<span className="review-line removed"><i>02</i> - repeated query inside loop</span>{'\n'}<span className="review-line added"><i>03</i> + reusable data retrieval</span>{'\n'}<span className="review-line added"><i>04</i> + explicit error handling</span>{'\n'}<span className="review-line neutral"><i>05</i> Verify output and edge cases</span></code></pre>
              <div className="review-result"><span><i /> Review complete</span><strong>Clearer · safer · maintainable</strong></div>
            </div>
          </div>
        </section>

        <section className="service-final-cta" id="service-contact">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="content-container service-final-cta-content">
            <p className="section-label">Start with the problem</p>
            <h2>Have a technical challenge in ARIS?</h2>
            <p>Tell me what you are trying to build, improve or fix and I&apos;ll let you know whether I can help.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/contact">Discuss your project <span aria-hidden="true">↗</span></a>
              <a className="button button-secondary" href="/articles">Browse technical articles <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter categories={categories} />
    </div>
  )
}
