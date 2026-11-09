import config from '@payload-config'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { searchArticles } from '@/utilities/articleSearch'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get('q') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
  if (query.length < 2) return NextResponse.json({ query, results: [] })

  const payload = await getPayload({ config })
  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 250,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  return NextResponse.json({ query, results: searchArticles(articles.docs, query) }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
