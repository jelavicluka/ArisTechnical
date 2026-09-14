import type { LibraryCategory } from '@/utilities/getArticleLibrary'

type Props = {
  categories: LibraryCategory[]
}

const BrandMark = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 8 8 54h12.5L32 31.8 43.5 54H56L32 8Z" fill="currentColor" />
    <path d="M32 31.8 43.5 54H33.8L27.1 41.1 32 31.8Z" fill="var(--violet)" />
  </svg>
)

export function SiteFooter({ categories }: Props) {
  return (
    <footer className="site-footer">
      <div className="content-container footer-main">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="Home">
            <span className="brand-mark">
              <BrandMark />
            </span>
          </a>
          <p>Independent technical guidance and professional consulting for ARIS environments.</p>
        </div>
        <div className="footer-links">
          <div>
            <h3>Navigate</h3>
            <a href="/">Home</a>
            <a href="/articles">Articles</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
          </div>
          <div>
            <h3>Technical areas</h3>
            {categories.map((category) => (
              <a href={`/articles#${category.slug}`} key={category.slug}>
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="content-container footer-bottom">
        <span>© {new Date().getFullYear()}. All rights reserved.</span>
        <p className="trademark-disclaimer">
          ARIS is a trademark or registered trademark of SAG Aris GmbH and/or its affiliates or
          licensors. This independent website is not affiliated with, endorsed by, or sponsored by
          SAG Aris GmbH.
        </p>
      </div>
    </footer>
  )
}
