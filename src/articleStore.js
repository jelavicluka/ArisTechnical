const STORAGE_KEY = 'aris-technical-articles-v1'

export const articleCategoryOptions = [
  { value: 'administration', label: 'ARIS Administration' },
  { value: 'scripting', label: 'ARIS Scripting' },
  { value: 'apg-automation', label: 'APG & Automation' },
  { value: 'rest-api-integrations', label: 'REST API & Integrations' },
  { value: 'installation-setup', label: 'Installation & Setup' },
]

export const defaultArticles = [
  {
    id: 'repository-api-authentication',
    category: 'rest-api-integrations',
    title: 'ARIS Repository API Authentication: Guide and Examples',
    description: 'Understand authentication flows, structure requests correctly and diagnose common authorization failures.',
    date: '2026-08-18',
    readTime: '14 min read',
    slug: 'repository-api-authentication',
    status: 'published',
  },
  {
    id: 'retrieve-models-rest-api',
    category: 'rest-api-integrations',
    title: 'How to Retrieve ARIS Models Using the REST API',
    description: 'A practical walkthrough of repository access, model queries and response handling.',
    date: '2026-08-14',
    readTime: '9 min read',
    slug: 'retrieve-models-rest-api',
    status: 'published',
  },
  {
    id: 'ldap-user-synchronization',
    category: 'administration',
    title: 'How to Configure LDAP User Synchronization in ARIS',
    description: 'Configure directory mappings, synchronization settings and the checks required for reliable user imports.',
    date: '2026-08-12',
    readTime: '11 min read',
    slug: 'ldap-user-synchronization',
    status: 'published',
  },
  {
    id: 'user-group-permissions',
    category: 'administration',
    title: 'ARIS User and Group Permissions: A Practical Guide',
    description: 'Learn how privileges, access rights and group structures work together across an ARIS environment.',
    date: '2026-08-08',
    readTime: '12 min read',
    slug: 'user-group-permissions',
    status: 'published',
  },
  {
    id: 'export-model-data-excel',
    category: 'scripting',
    title: 'Export ARIS Model Data to Excel with a Report Script',
    description: 'Build a reusable report script that turns model and object data into a structured Excel export.',
    date: '2026-08-04',
    readTime: '13 min read',
    slug: 'export-model-data-excel',
    status: 'published',
  },
  {
    id: 'reliable-report-script-patterns',
    category: 'scripting',
    title: 'Five Useful Patterns for More Reliable ARIS Report Scripts',
    description: 'Practical JavaScript patterns for validation, logging, error handling and maintainable report code.',
    date: '2026-07-31',
    readTime: '8 min read',
    slug: 'reliable-report-script-patterns',
    status: 'published',
  },
  {
    id: 'apg-approval-workflow',
    category: 'apg-automation',
    title: 'Building an Approval Workflow with ARIS Process Governance',
    description: 'A technical introduction to workflow structure, roles, triggers and error handling in APG.',
    date: '2026-07-27',
    readTime: '10 min read',
    slug: 'apg-approval-workflow',
    status: 'published',
  },
  {
    id: 'troubleshoot-stalled-apg-workflow',
    category: 'apg-automation',
    title: 'How to Troubleshoot a Stalled APG Workflow',
    description: 'Trace workflow state, inspect execution context and isolate the most frequent causes of stalled processes.',
    date: '2026-07-21',
    readTime: '9 min read',
    slug: 'troubleshoot-stalled-apg-workflow',
    status: 'published',
  },
  {
    id: 'server-installation-checklist',
    category: 'installation-setup',
    title: 'Planning an ARIS Server Installation: Technical Checklist',
    description: 'Review infrastructure, sizing, connectivity and configuration decisions before installation begins.',
    date: '2026-07-15',
    readTime: '12 min read',
    slug: 'server-installation-checklist',
    status: 'published',
  },
  {
    id: 'common-installation-problems',
    category: 'installation-setup',
    title: 'Common ARIS Installation Problems and How to Diagnose Them',
    description: 'A methodical guide to reading logs and resolving connectivity, service and configuration failures.',
    date: '2026-07-09',
    readTime: '15 min read',
    slug: 'common-installation-problems',
    status: 'published',
  },
]

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
    const articles = savedArticles ? JSON.parse(savedArticles) : defaultArticles
    return articles.map(normalizeArticle)
  } catch {
    return defaultArticles.map(normalizeArticle)
  }
}

export function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
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
