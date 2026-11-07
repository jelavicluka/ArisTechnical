import importedArticles from './data/articles.json'
import knowledgeBaseArticles from './data/knowledgeBaseArticles.json'

const STORAGE_KEY = 'aris-technical-articles-v2'
const KNOWLEDGE_BASE_IMPORT_KEY = `${STORAGE_KEY}-knowledge-base-2026-11-07`

export const articleCategoryOptions = [
  { value: 'administration', label: 'ARIS Administration' },
  { value: 'scripting', label: 'ARIS Scripting' },
  { value: 'apg-automation', label: 'APG & Automation' },
  { value: 'rest-api-integrations', label: 'REST API & Integrations' },
  { value: 'installation-setup', label: 'Installation & Setup' },
  { value: 'connect-customization', label: 'ARIS Connect Customization' },
]

export const defaultArticles = [...knowledgeBaseArticles, ...importedArticles]

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function starterContent(article) {
  return [
    {
      id: createId(),
      type: 'richText',
      html: `<p>${article.description}</p>`,
    },
  ]
}

function normalizeArticle(article) {
  return {
    ...article,
    id: article.id || article.slug || createId(),
    status: article.status || 'draft',
    content: Array.isArray(article.content) && article.content.length > 0
      ? article.content
      : starterContent(article),
  }
}

export function loadArticles() {
  try {
    const savedArticles = localStorage.getItem(STORAGE_KEY)
    let articles = savedArticles ? JSON.parse(savedArticles) : defaultArticles
    if (!Array.isArray(articles)) return defaultArticles.map(normalizeArticle)

    if (savedArticles && !localStorage.getItem(KNOWLEDGE_BASE_IMPORT_KEY)) {
      const savedIds = new Set(articles.map((article) => article.id))
      articles = [...knowledgeBaseArticles.filter((article) => !savedIds.has(article.id)), ...articles]
      // Import this batch once, retaining existing edits and subsequent removals.
      try {
        saveArticles(articles)
      } catch {
        // Still show the merged articles if browser storage cannot be written.
      }
    }

    return articles.map(normalizeArticle)
  } catch {
    return defaultArticles.map(normalizeArticle)
  }
}

export function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  localStorage.setItem(KNOWLEDGE_BASE_IMPORT_KEY, '1')
}

export function createArticleDraft() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: createId(),
    title: '',
    slug: '',
    category: 'administration',
    description: '',
    date: today,
    readTime: '5 min read',
    status: 'draft',
    content: [
      {
        id: createId(),
        type: 'richText',
        html: '<h2>Introduction</h2><p>Start writing your article here...</p>',
      },
    ],
  }
}

export function createContentBlock(type) {
  if (type === 'code') {
    return {
      id: createId(),
      type: 'code',
      language: 'javascript',
      filename: 'example.js',
      code: '// Add your code here\n',
    }
  }

  if (type === 'image') {
    return {
      id: createId(),
      type: 'image',
      src: '',
      alt: '',
      caption: '',
    }
  }

  return {
    id: createId(),
    type: 'richText',
    html: '<p>Continue writing...</p>',
  }
}

export function formatArticleDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
