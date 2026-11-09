export const FEATURED_ARTICLE_SLUG = 'run-aris-reports-from-external-applications'

export const isFeaturedArticle = (article: { slug: string }) =>
  article.slug === FEATURED_ARTICLE_SLUG
