import config from '@payload-config'
import { getPayload } from 'payload'

import { defaultCategories } from '@/data/defaultCategories'

const payload = await getPayload({ config })

for (const category of defaultCategories) {
  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    where: {
      slug: {
        equals: category.slug,
      },
    },
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'categories',
      id: existing.docs[0].id,
      data: category,
    })
  } else {
    await payload.create({
      collection: 'categories',
      data: category,
    })
  }
}

payload.logger.info(`Seeded ${defaultCategories.length} article categories.`)
process.exit(0)
