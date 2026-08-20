import { useMemo, useState } from 'react'
import {
  articleCategoryOptions,
  createArticleDraft,
  createContentBlock,
  formatArticleDate,
  loadArticles,
  saveArticles,
} from './articleStore.js'
import './AdminPage.css'

function AdminBrand() {
  return (
    <a className="admin-brand" href="/" aria-label="Aris Technical home">
      <img src="/aris-technical-mark.svg" alt="" />
      <span><strong>ARIS</strong><small>TECHNICAL</small></span>
      <i>ADMIN</i>
    </a>
  )
}

function categoryLabel(value) {
  return articleCategoryOptions.find((category) => category.value === value)?.label ?? value
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function RichTextBlock({ block, onChange }) {
  const runCommand = (command, value) => (event) => {
    event.preventDefault()
    document.execCommand(command, false, value)
  }

  const addLink = (event) => {
    event.preventDefault()
    const url = window.prompt('Enter the link URL')
    if (url) document.execCommand('createLink', false, url)
  }

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar" aria-label="Text formatting">
        <button type="button" onMouseDown={runCommand('formatBlock', 'p')} title="Paragraph">P</button>
        <button type="button" onMouseDown={runCommand('formatBlock', 'h2')} title="Heading 2">H2</button>
        <button type="button" onMouseDown={runCommand('formatBlock', 'h3')} title="Heading 3">H3</button>
        <button type="button" onMouseDown={runCommand('formatBlock', 'blockquote')} title="Quote">Quote</button>
        <span className="toolbar-divider" />
        <button type="button" onMouseDown={runCommand('bold')} title="Bold"><strong>B</strong></button>
        <button type="button" onMouseDown={runCommand('italic')} title="Italic"><em>I</em></button>
        <button type="button" onMouseDown={runCommand('underline')} title="Underline"><u>U</u></button>
        <span className="toolbar-divider" />
        <button type="button" onMouseDown={runCommand('insertUnorderedList')} title="Bullet list">• List</button>
        <button type="button" onMouseDown={runCommand('insertOrderedList')} title="Numbered list">1. List</button>
        <button type="button" onMouseDown={addLink} title="Add link">Link</button>
        <button type="button" onMouseDown={runCommand('removeFormat')} title="Clear formatting">Clear</button>
      </div>
      <div
        className="rich-text-surface"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: block.html }}
        onInput={(event) => onChange({ ...block, html: event.currentTarget.innerHTML })}
      />
    </div>
  )
}

function CodeBlockEditor({ block, onChange }) {
  return (
    <div className="code-block-editor">
      <div className="code-block-settings">
        <label>
          Language
          <select value={block.language} onChange={(event) => onChange({ ...block, language: event.target.value })}>
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="bash">Command line</option>
            <option value="sql">SQL</option>
            <option value="text">Plain text / logs</option>
          </select>
        </label>
        <label>
          Filename or label
          <input value={block.filename} onChange={(event) => onChange({ ...block, filename: event.target.value })} placeholder="example.js" />
        </label>
      </div>
      <div className="admin-code-window">
        <div className="admin-code-bar"><span><i /><i /><i /></span><strong>{block.filename || block.language}</strong><small>{block.language}</small></div>
        <textarea
          value={block.code}
          onChange={(event) => onChange({ ...block, code: event.target.value })}
          spellCheck="false"
          aria-label="Code"
        />
      </div>
    </div>
  )
}

function ImageBlockEditor({ block, onChange }) {
  const uploadImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 1_500_000) {
      window.alert('For this browser prototype, please use an image smaller than 1.5 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => onChange({ ...block, src: String(reader.result), alt: block.alt || file.name.replace(/\.[^.]+$/, '') })
    reader.readAsDataURL(file)
  }

  return (
    <div className="image-block-editor">
      <div className="image-source-fields">
        <label className="image-upload-button">
          Upload image
          <input type="file" accept="image/*" onChange={uploadImage} />
        </label>
        <span>or</span>
        <label>
          Image URL
          <input value={block.src.startsWith('data:') ? '' : block.src} onChange={(event) => onChange({ ...block, src: event.target.value })} placeholder="https://..." />
        </label>
      </div>
      {block.src ? (
        <div className="image-block-preview"><img src={block.src} alt={block.alt || ''} /></div>
      ) : (
        <div className="image-placeholder"><span>▧</span><p>No image selected</p></div>
      )}
      <div className="image-details">
        <label>Alternative text<input value={block.alt} onChange={(event) => onChange({ ...block, alt: event.target.value })} placeholder="Describe the image for accessibility" /></label>
        <label>Caption — optional<input value={block.caption} onChange={(event) => onChange({ ...block, caption: event.target.value })} placeholder="Image caption" /></label>
      </div>
    </div>
  )
}

function ContentPreview({ article }) {
  return (
    <article className="admin-article-preview">
      <p className="preview-category">{categoryLabel(article.category)}</p>
      <h1>{article.title || 'Untitled article'}</h1>
      <p className="preview-summary">{article.description || 'Add a short article summary.'}</p>
      <div className="preview-meta"><span>{formatArticleDate(article.date)}</span><span>{article.readTime}</span></div>
      <div className="preview-content">
        {article.content.map((block) => {
          if (block.type === 'code') {
            return (
              <div className="preview-code" key={block.id}>
                <div><span><i /><i /><i /></span><strong>{block.filename || block.language}</strong><small>{block.language}</small></div>
                <pre><code>{block.code}</code></pre>
              </div>
            )
          }
          if (block.type === 'image') {
            return block.src ? (
              <figure key={block.id}><img src={block.src} alt={block.alt || ''} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>
            ) : null
          }
          return <div className="preview-rich-text" dangerouslySetInnerHTML={{ __html: block.html }} key={block.id} />
        })}
      </div>
    </article>
  )
}

function ArticleEditor({ article, onCancel, onSave }) {
  const [draft, setDraft] = useState(() => structuredClone(article))
  const [mode, setMode] = useState('edit')
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
      ...(field === 'title' && !current.slug ? { slug: slugify(value) } : {}),
    }))
  }

  const updateBlock = (updatedBlock) => {
    setDraft((current) => ({
      ...current,
      content: current.content.map((block) => block.id === updatedBlock.id ? updatedBlock : block),
    }))
  }

  const moveBlock = (index, direction) => {
    const destination = index + direction
    if (destination < 0 || destination >= draft.content.length) return
    setDraft((current) => {
      const content = [...current.content]
      const [block] = content.splice(index, 1)
      content.splice(destination, 0, block)
      return { ...current, content }
    })
  }

  const removeBlock = (id) => {
    if (draft.content.length === 1) return
    setDraft((current) => ({ ...current, content: current.content.filter((block) => block.id !== id) }))
  }

  const addBlock = (type) => {
    setDraft((current) => ({ ...current, content: [...current.content, createContentBlock(type)] }))
  }

  const save = (status) => {
    if (!draft.title.trim()) return setError('Article title is required.')
    if (!draft.slug.trim()) return setError('URL slug is required.')
    if (!draft.description.trim()) return setError('Article summary is required.')
    setError('')
    onSave({ ...draft, slug: slugify(draft.slug), status, updatedAt: new Date().toISOString() })
  }

  return (
    <div className="admin-editor-page">
      <header className="admin-header">
        <AdminBrand />
        <div className="editor-header-actions">
          <button className="admin-ghost-button" type="button" onClick={onCancel}>Cancel</button>
          <button className="admin-secondary-button" type="button" onClick={() => save('draft')}>Save draft</button>
          <button className="admin-primary-button" type="button" onClick={() => save('published')}>Publish article</button>
        </div>
      </header>

      <main className="editor-main">
        <div className="editor-title-row">
          <div><button className="back-button" type="button" onClick={onCancel}>← Articles</button><h1>{article.title ? 'Edit article' : 'Create a new article'}</h1></div>
          <div className="editor-mode-switch" aria-label="Editor mode">
            <button className={mode === 'edit' ? 'is-active' : ''} type="button" onClick={() => setMode('edit')}>Edit</button>
            <button className={mode === 'preview' ? 'is-active' : ''} type="button" onClick={() => setMode('preview')}>Preview</button>
          </div>
        </div>

        {error && <div className="admin-error" role="alert">{error}</div>}

        {mode === 'preview' ? <ContentPreview article={draft} /> : (
          <div className="editor-layout">
            <div className="editor-document">
              <section className="admin-panel article-basics">
                <div className="panel-heading"><span>01</span><div><h2>Article details</h2><p>Title, summary and URL information shown across the website.</p></div></div>
                <label>Article title<input className="title-input" value={draft.title} onChange={(event) => updateField('title', event.target.value)} placeholder="How to solve an ARIS technical problem" /></label>
                <label>Short summary<textarea value={draft.description} onChange={(event) => updateField('description', event.target.value)} rows="3" placeholder="A concise description used in article cards and search results." /></label>
                <label>URL slug<div className="slug-field"><span>/articles/{draft.category}/</span><input value={draft.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="article-url-slug" /></div></label>
              </section>

              <section className="admin-panel content-builder">
                <div className="panel-heading"><span>02</span><div><h2>Article content</h2><p>Build the article from formatted text, code examples and images.</p></div></div>
                <div className="content-blocks">
                  {draft.content.map((block, index) => (
                    <section className={`content-block content-block-${block.type}`} key={block.id}>
                      <div className="content-block-header">
                        <span>{String(index + 1).padStart(2, '0')} · {block.type === 'richText' ? 'Formatted text' : block.type}</span>
                        <div>
                          <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label="Move block up">↑</button>
                          <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === draft.content.length - 1} aria-label="Move block down">↓</button>
                          <button className="remove-block" type="button" onClick={() => removeBlock(block.id)} disabled={draft.content.length === 1}>Remove</button>
                        </div>
                      </div>
                      {block.type === 'richText' && <RichTextBlock block={block} onChange={updateBlock} />}
                      {block.type === 'code' && <CodeBlockEditor block={block} onChange={updateBlock} />}
                      {block.type === 'image' && <ImageBlockEditor block={block} onChange={updateBlock} />}
                    </section>
                  ))}
                </div>
                <div className="add-block-row">
                  <span>Add content block</span>
                  <button type="button" onClick={() => addBlock('richText')}><strong>T</strong> Formatted text</button>
                  <button type="button" onClick={() => addBlock('code')}><strong>&lt;/&gt;</strong> Code section</button>
                  <button type="button" onClick={() => addBlock('image')}><strong>▧</strong> Image</button>
                </div>
              </section>
            </div>

            <aside className="editor-sidebar">
              <section className="admin-panel publication-panel">
                <h2>Publication</h2>
                <div className={`status-chip status-${draft.status}`}><i /> {draft.status}</div>
                <label>Technical area<select value={draft.category} onChange={(event) => updateField('category', event.target.value)}>{articleCategoryOptions.map((category) => <option value={category.value} key={category.value}>{category.label}</option>)}</select></label>
                <label>Publication date<input type="date" value={draft.date} onChange={(event) => updateField('date', event.target.value)} /></label>
                <label>Reading time<input value={draft.readTime} onChange={(event) => updateField('readTime', event.target.value)} placeholder="10 min read" /></label>
              </section>
              <section className="admin-panel editor-help">
                <h2>Editor notes</h2>
                <p>Use formatted text for explanations, code sections for technical examples and image blocks for screenshots or diagrams.</p>
                <p>Uploaded images are saved in this browser for the prototype and should remain below 1.5 MB.</p>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

function AdminPage() {
  const [articles, setArticles] = useState(loadArticles)
  const [editingArticle, setEditingArticle] = useState(() => (
    window.location.pathname === '/admin/new' ? createArticleDraft() : null
  ))
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [notice, setNotice] = useState('')

  const visibleArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return articles.filter((article) => {
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter
      const matchesSearch = !query || [article.title, article.description, article.slug, categoryLabel(article.category)].join(' ').toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [articles, searchQuery, statusFilter])

  const persistArticles = (nextArticles, message) => {
    try {
      saveArticles(nextArticles)
      setArticles(nextArticles)
      setNotice(message)
      window.setTimeout(() => setNotice(''), 2600)
      return true
    } catch {
      setNotice('Unable to save. Browser storage may be full; remove large uploaded images and try again.')
      return false
    }
  }

  const saveArticle = (article) => {
    const exists = articles.some((item) => item.id === article.id)
    const nextArticles = exists
      ? articles.map((item) => item.id === article.id ? article : item)
      : [article, ...articles]
    if (persistArticles(nextArticles, article.status === 'published' ? 'Article published.' : 'Draft saved.')) setEditingArticle(null)
  }

  const deleteArticle = (article) => {
    if (!window.confirm(`Remove “${article.title}”? This cannot be undone in the prototype.`)) return
    persistArticles(articles.filter((item) => item.id !== article.id), 'Article removed.')
  }

  if (editingArticle) {
    return <ArticleEditor article={editingArticle} onCancel={() => setEditingArticle(null)} onSave={saveArticle} />
  }

  const publishedCount = articles.filter((article) => article.status === 'published').length
  const draftCount = articles.filter((article) => article.status === 'draft').length

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <AdminBrand />
        <nav aria-label="Admin navigation"><a className="is-active" href="/admin/">Articles</a><a href="/articles/">View website ↗</a></nav>
        <div className="local-admin-label"><i /> Local prototype</div>
      </header>

      <main className="admin-main">
        {notice && <div className="admin-notice" role="status">{notice}</div>}
        <div className="admin-page-heading">
          <div><p>Content management</p><h1>Articles</h1><span>Create, edit and publish ARIS technical knowledge.</span></div>
          <button className="admin-primary-button" type="button" onClick={() => setEditingArticle(createArticleDraft())}>+ New article</button>
        </div>

        <div className="admin-stats">
          <div><span>Total articles</span><strong>{articles.length}</strong></div>
          <div><span>Published</span><strong>{publishedCount}</strong></div>
          <div><span>Drafts</span><strong>{draftCount}</strong></div>
          <div><span>Technical areas</span><strong>{articleCategoryOptions.length}</strong></div>
        </div>

        <section className="admin-panel admin-article-manager">
          <div className="admin-list-toolbar">
            <div className="admin-search"><span>⌕</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search articles..." /></div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select>
            <span>{visibleArticles.length} results</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-articles-table">
              <thead><tr><th>Article</th><th>Technical area</th><th>Status</th><th>Updated</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
              <tbody>
                {visibleArticles.map((article) => (
                  <tr key={article.id}>
                    <td><strong>{article.title || 'Untitled article'}</strong><small>/{article.slug || 'no-slug'}</small></td>
                    <td><span className="table-category">{categoryLabel(article.category)}</span></td>
                    <td><span className={`table-status status-${article.status}`}><i /> {article.status}</span></td>
                    <td>{formatArticleDate(article.date)}</td>
                    <td><div className="table-actions"><button type="button" onClick={() => setEditingArticle(article)}>Edit</button><button className="delete-action" type="button" onClick={() => deleteArticle(article)}>Remove</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visibleArticles.length === 0 && <div className="admin-empty">No articles match the current filters.</div>}
        </section>
      </main>
    </div>
  )
}

export default AdminPage
