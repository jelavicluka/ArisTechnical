import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Article, Category } from '@/payload-types'

export type LibraryArticle = Pick<
  Article,
  'publishedAt' | 'readingTime' | 'slug' | 'summary' | 'title'
> & {
  category: Pick<Category, 'shortTitle' | 'slug' | 'title'>
}

export type LibraryCategory = Pick<Category, 'description' | 'shortTitle' | 'slug' | 'title'>

const hasCategory = (category: number | Category): category is Category => typeof category === 'object'

export const getArticleLibrary = cache(async () => {
  const payload = await getPayload({ config })
  const [articleResult, categoryResult] = await Promise.all([
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 100,
      pagination: false,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 20,
      pagination: false,
      sort: 'sortOrder',
    }),
  ])

  const articles = articleResult.docs.flatMap<LibraryArticle>((article) => {
    if (!hasCategory(article.category)) return []

    return [
      {
        category: {
          shortTitle: article.category.shortTitle,
          slug: article.category.slug,
          title: article.category.title,
        },
        publishedAt: article.publishedAt,
        readingTime: article.readingTime,
        slug: article.slug,
        summary: article.summary,
        title: article.title,
      },
    ]
  })

  const categories: LibraryCategory[] = categoryResult.docs.map((category) => ({
    description: category.description,
    shortTitle: category.shortTitle,
    slug: category.slug,
    title: category.title,
  }))

  return { articles, categories }
})
