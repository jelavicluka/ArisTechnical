import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Article, Media } from '@/payload-types'

import { ArticleCodeBlock } from './ArticleCodeBlock'
import styles from './article.module.css'

type Props = {
  blocks: Article['content']
}

const isMedia = (value: number | Media): value is Media => typeof value === 'object'

export const ArticleContent = ({ blocks }: Props) => (
  <div className={styles.articleContent}>
    {blocks.map((block, index) => {
      const key = block.id || `${block.blockType}-${index}`

      if (block.blockType === 'richText') {
        return <RichText className={styles.richText} data={block.body} key={key} />
      }

      if (block.blockType === 'code') {
        return <ArticleCodeBlock {...block} key={key} />
      }

      if (block.blockType === 'image' && isMedia(block.image) && block.image.url) {
        return (
          <figure className={`${styles.articleImage} ${styles[`image-${block.displayWidth}`]}`} key={key}>
            <img
              alt={block.image.alt}
              height={block.image.height || undefined}
              loading="lazy"
              src={block.image.sizes?.article?.url || block.image.url}
              width={block.image.width || undefined}
            />
            {block.caption || block.image.caption ? (
              <figcaption>{block.caption || block.image.caption}</figcaption>
            ) : null}
          </figure>
        )
      }

      return null
    })}
  </div>
)
