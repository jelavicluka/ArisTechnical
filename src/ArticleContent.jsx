import { useState } from 'react'
import './ArticleContent.css'

function ArticleCode({ block }) {
  const [copyState, setCopyState] = useState('Copy')

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(block.code)
      setCopyState('Copied')
    } catch {
      setCopyState('Select code to copy')
    }
    window.setTimeout(() => setCopyState('Copy'), 2400)
  }

  return (
    <div className="article-code">
      <div className="article-code-bar">
        <span>{block.filename || block.language}</span>
        <button type="button" onClick={copyCode} aria-label={`Copy ${block.filename || block.language}`}>
          <span aria-live="polite">{copyState}</span>
        </button>
      </div>
      <pre><code className={`language-${block.language}`}>{block.code}</code></pre>
    </div>
  )
}

export default function ArticleContent({ article }) {
  return (
    <div className="article-body">
      {article.content.map((block) => {
        if (block.type === 'code') return <ArticleCode block={block} key={block.id} />
        if (block.type === 'image') {
          return block.src ? (
            <figure key={block.id}>
              <img src={block.src} alt={block.alt || ''} />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          ) : null
        }
        return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.html }} />
      })}
    </div>
  )
}
