import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Article } from '@/payload-types'

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return result.docs[0] ?? null
})
