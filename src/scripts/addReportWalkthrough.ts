import config from '@payload-config'
import { getPayload } from 'payload'

import { REPORT_ARTICLE_SLUG } from '@/data/reportApiFlow'
import { addReportApiFlow } from '@/utilities/addReportApiFlow'

const payload = await getPayload({ config })

try {
  const result = await payload.find({
    collection: 'articles',
    depth: 0,
    draft: true,
    limit: 1,
    where: { slug: { equals: REPORT_ARTICLE_SLUG } },
  })
  const article = result.docs[0]
  if (!article) throw new Error('Import the report integration article before adding its walkthrough.')

  const content = addReportApiFlow(article.content)
  if (content === article.content) {
    payload.logger.info('The article already contains a walkthrough or the new integration demo. No changes made.')
  } else {
    await payload.update({
      collection: 'articles',
      id: article.id,
      draft: article._status !== 'published',
      data: { content, _status: article._status },
    })
    payload.logger.info('Updated the API walkthrough with hidden endpoints; existing article content and publication status preserved.')
  }
} finally {
  await payload.destroy()
}
