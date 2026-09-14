import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getArticleLibrary } from '@/utilities/getArticleLibrary'
import { buildPageMetadata } from '@/utilities/siteSettings'

export const dynamic = 'force-dynamic'

export const generateMetadata = (): Promise<Metadata> =>
  buildPageMetadata({
    description:
      'Get in touch about ARIS administration, scripting, Connect Portal customization, Process Governance, integrations, installations or another technical challenge.',
    path: '/contact',
    title: 'Discuss Your ARIS Project',
  })

export default async function ContactPage() {
  const { categories } = await getArticleLibrary()

  return (
    <div className="site-shell contact-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader categories={categories} currentPage="contact" />

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
              <h1 id="contact-title">Let&apos;s talk about your<br /> <em>ARIS challenge.</em></h1>
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
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter categories={categories} />
    </div>
  )
}
