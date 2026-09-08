import config from '@payload-config'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import type { Article, Category, RichTextContentBlock } from '@/payload-types'

export const dynamic = 'force-dynamic'

type MatchSource = 'Article text' | 'Code' | 'Summary' | 'Title'

type SearchResult = {
  category: string
  matchSource: MatchSource
  publishedAt: string | null
  readingTime: number | null
  score: number
  slug: string
  snippet: string
  title: string
}

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()

const collectText = (value: unknown, output: string[] = []): string[] => {
  if (Array.isArray(value)) value.forEach((entry) => collectText(entry, output))
  else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => {
      if (key === 'text' && typeof entry === 'string') output.push(entry)
      else if (typeof entry === 'object') collectText(entry, output)
    })
  }

  return output
}

const excerpt = (value: string, query: string, maximumLength = 190) => {
  const text = normalize(value)
  if (text.length <= maximumLength) return text

  const matchIndex = text.toLocaleLowerCase().indexOf(query)
  const start = Math.max(0, matchIndex > -1 ? matchIndex - 62 : 0)
  const end = Math.min(text.length, start + maximumLength)

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

const getCategoryName = (category: number | Category) =>
  typeof category === 'object' ? category.shortTitle || category.title : 'Technical article'

const findMatch = (article: Article, query: string): SearchResult | null => {
  const title = article.title.toLocaleLowerCase()
  const summary = article.summary.toLocaleLowerCase()
  const richText = article.content
    .filter((block): block is RichTextContentBlock => block.blockType === 'richText')
    .flatMap((block) => collectText(block.body))
    .join(' ')
  const code = article.content
    .filter((block) => block.blockType === 'code')
    .map((block) => block.code)
    .join('\n')
  const normalizedRichText = richText.toLocaleLowerCase()
  const normalizedCode = code.toLocaleLowerCase()

  let matchSource: MatchSource
  let score: number
  let snippet: string

  if (title.startsWith(query)) {
    matchSource = 'Title'
    score = 100
    snippet = article.summary
  } else if (title.includes(query)) {
    matchSource = 'Title'
    score = 90
    snippet = article.summary
  } else if (summary.includes(query)) {
    matchSource = 'Summary'
    score = 70
    snippet = excerpt(article.summary, query)
  } else if (normalizedRichText.includes(query)) {
    matchSource = 'Article text'
    score = 50
    snippet = excerpt(richText, query)
  } else if (normalizedCode.includes(query)) {
    matchSource = 'Code'
    score = 40
    snippet = excerpt(code, query)
  } else {
    return null
  }

  return {
    category: getCategoryName(article.category),
    matchSource,
    publishedAt: article.publishedAt || null,
    readingTime: article.readingTime || null,
    score,
    slug: article.slug,
    snippet,
    title: article.title,
  }
}

export async function GET(request: NextRequest) {
  const query = normalize(request.nextUrl.searchParams.get('q') || '').slice(0, 80).toLocaleLowerCase()

  if (query.length < 2) {
    return NextResponse.json({ query, results: [] })
  }

  const payload = await getPayload({ config })
  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 250,
    pagination: false,
    sort: '-publishedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const results = articles.docs
    .map((article) => findMatch(article, query))
    .filter((result): result is SearchResult => Boolean(result))
    .sort((left, right) => right.score - left.score)
    .slice(0, 6)
    .map(({ score: _score, ...result }) => result)

  return NextResponse.json({ query, results }, { headers: { 'Cache-Control': 'no-store' } })
}
