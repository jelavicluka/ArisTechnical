import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '@payload-config'
import { JSDOM } from 'jsdom'
import path from 'node:path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import integrationArticles from '@/data/articles.json'
import { defaultCategories } from '@/data/defaultCategories'
import knowledgeBaseArticles from '@/data/knowledgeBaseArticles.json'
import type { Article, CodeContentBlock } from '@/payload-types'

type LegacyBlock =
  | { type: 'richText'; html: string }
  | { type: 'code'; language: CodeContentBlock['language']; filename: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

type LegacyArticle = {
  title: string
  description: string
  slug: string
  category: string
  date: string
  status: 'published' | 'draft'
  content: LegacyBlock[]
}

const payload = await getPayload({ config })

try {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const categories = new Map<string, number>()

  for (const category of defaultCategories) {
    const existing = await payload.find({
      collection: 'categories',
      limit: 1,
      where: { slug: { equals: category.slug } },
    })
    const document = existing.docs[0] || await payload.create({
      collection: 'categories',
      data: category,
    })
    categories.set(category.slug, document.id)
  }

  let created = 0
  let skipped = 0
  const sources = [...knowledgeBaseArticles, ...integrationArticles] as LegacyArticle[]

  for (const source of sources) {
    const existing = await payload.find({
      collection: 'articles',
      draft: true,
      limit: 1,
      where: { slug: { equals: source.slug } },
    })

    // Never overwrite CMS edits or republish an existing draft on a repeat import.
    if (existing.docs.length) {
      skipped++
      continue
    }

    const category = categories.get(source.category)
    if (!category) throw new Error(`Unknown category: ${source.category}`)

    const content: Article['content'] = []
    let featuredImage: number | undefined

    for (const block of source.content) {
      if (block.type === 'richText') {
        content.push({
          blockType: 'richText',
          body: convertHTMLToLexical({ editorConfig, html: block.html, JSDOM }),
        })
      } else if (block.type === 'code') {
        content.push({
          blockType: 'code',
          code: block.code,
          filename: block.filename,
          language: block.language,
        })
      } else if (block.type === 'image') {
        const filename = `${path.parse(block.src).name}.png`
        const existingMedia = await payload.find({
          collection: 'media',
          limit: 1,
          where: { filename: { equals: filename } },
        })
        let media = existingMedia.docs[0]

        if (!media) {
          // Payload accepts raster images; retain the source SVG in public too.
          const data = await sharp(path.join(process.cwd(), 'public', block.src)).png().toBuffer()
          media = await payload.create({
            collection: 'media',
            data: { alt: block.alt, caption: block.caption },
            file: { data, mimetype: 'image/png', name: filename, size: data.length },
          })
        }

        featuredImage ??= media.id
        content.push({ blockType: 'image', image: media.id, caption: block.caption, displayWidth: 'wide' })
      }
    }

    await payload.create({
      collection: 'articles',
      draft: source.status === 'draft',
      data: {
        _status: source.status,
        category,
        content,
        featuredImage,
        publishedAt: new Date(`${source.date}T12:00:00.000Z`).toISOString(),
        slug: source.slug,
        summary: source.description,
        title: source.title,
      },
    })
    created++
    payload.logger.info(`Imported article: ${source.slug}`)
  }

  payload.logger.info(`Article import complete: ${created} created, ${skipped} existing articles preserved.`)
} finally {
  await payload.destroy()
}
