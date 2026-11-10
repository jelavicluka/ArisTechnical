import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '@payload-config'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'

import articles from '@/data/articles.json'
import { REPORT_ARTICLE_SLUG } from '@/data/reportApiFlow'
import { reportJourney } from '@/data/reportJourney'
import type { Article } from '@/payload-types'

const payload = await getPayload({ config })

try {
  const source = articles.find((article) => article.slug === REPORT_ARTICLE_SLUG)
  if (!source) throw new Error('Report article source not found.')

  const result = await payload.find({
    collection: 'articles', depth: 0, draft: true, limit: 1,
    where: { slug: { equals: REPORT_ARTICLE_SLUG } },
  })
  const article = result.docs[0]
  if (!article) throw new Error('Import the report integration article before applying the rewrite.')

  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const content: Article['content'] = source.content.map((block) => {
    if (block.type === 'reportJourney') return reportJourney
    if (block.type === 'richText' && 'html' in block && typeof block.html === 'string') return {
      blockType: 'richText' as const,
      body: convertHTMLToLexical({ editorConfig, html: block.html, JSDOM }),
    }
    throw new Error(`Unexpected block in report article: ${block.type}`)
  })

  // Replacing this article's text is intentional. Payload retains its revision history.
  // Keep the URL, category, publication date and current draft/published state.
  await payload.update({
    collection: 'articles', id: article.id, draft: article._status !== 'published',
    data: {
      _status: article._status,
      title: source.title,
      summary: source.description,
      content,
      seo: {
        ...article.seo,
        title: source.title,
        description: 'Our discovery connects external applications to ARIS report scripting: run custom tasks and get results back, beyond the standard REST API.',
      },
    },
  })
  payload.logger.info('Rewrote the report article and replaced API examples with the interactive integration demo. URL and publication status preserved.')
} finally {
  await payload.destroy()
}
