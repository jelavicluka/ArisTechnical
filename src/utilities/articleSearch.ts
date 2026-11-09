import type { Article } from '@/payload-types'

export type SearchResult = {
  category: string
  matchSource: 'Article text' | 'Code' | 'Summary' | 'Title' | 'Topic'
  matchType: 'exact' | 'related' | 'typo' | 'partial'
  matchedTerms: string[]
  publishedAt: string | null
  readingTime: number | null
  slug: string
  snippet: string
  title: string
}

// Topic vocabulary is independent of individual articles and expands queries only.
const concepts: Record<string, string[]> = {
  spreadsheet: ['excel', 'spreadsheet', 'xlsx', 'xls', 'workbook', 'worksheet', 'sheet', 'tablica', 'tablice', 'proracunska tablica'],
  export: ['export', 'extract', 'download', 'izvoz', 'izvesti', 'izvezi', 'preuzmi', 'preuzimanje'],
  name: ['name', 'names', 'naziv', 'nazivi', 'naziva', 'ime', 'imena'],
  count: ['count', 'counting', 'number', 'quantity', 'koliko', 'broj', 'brojanje', 'prebroji', 'prebrojati'],
  function: ['function', 'activity', 'activities', 'task', 'aktivnost', 'aktivnosti', 'funkcija', 'funkcije'],
  occurrence: ['occurrence', 'instance', 'pojavljivanje', 'pojavljivanja'],
  model: ['model', 'diagram', 'process', 'processes', 'process model', 'process diagram', 'modela', 'modeli', 'dijagram'],
  execute: ['run', 'running', 'launch', 'execute', 'execution', 'trigger', 'start', 'invoke', 'call', 'calling', 'pokreni', 'pokretanje', 'pokrenuti', 'izvrsi', 'izvrsavanje'],
  external: ['external', 'externally', 'outside', 'remote', 'third party', 'another application', 'another app', 'izvana', 'vanjski', 'vanjska', 'izvan'],
  report: ['report', 'izvjestaj', 'izvjestaji', 'izvjestaja', 'izvjesce', 'reporta'],
  script: ['script', 'scripting', 'javascript', 'js', 'skripta', 'skripte', 'skripti'],
  api: ['api', 'rest', 'http', 'integration', 'integrate', 'integrating', 'web service', 'connect systems', 'integracija', 'integracije', 'povezivanje', 'povezi'],
  connect: ['connect', 'portal'],
  hide: ['hide', 'hiding', 'remove', 'disable', 'conceal', 'sakrij', 'sakriti', 'ukloni', 'makni', 'iskljuci'],
  database: ['database', 'db', 'baza', 'baze', 'bazu', 'odabir baze', 'izbor baze'],
  switcher: ['switcher', 'selector', 'dropdown', 'picker', 'selection'],
  navigation: ['navigation', 'menu', 'navbar', 'nav', 'navigacija', 'navigacije', 'izbornik'],
  styling: ['customization', 'customisation', 'customize', 'customise', 'style', 'styles', 'styling', 'appearance', 'theme', 'design', 'prilagodba', 'izgled'],
  color: ['color', 'colour', 'accent', 'purple', 'boja', 'boje', 'boju', 'ljubicasta'],
  change: ['change', 'modify', 'update', 'adjust', 'promijeni', 'promjena', 'promjeniti', 'izmjena'],
  active: ['active', 'selected', 'current', 'highlight', 'aktivno', 'aktivni', 'odabrani'],
  authentication: ['authentication', 'authorization', 'login', 'sign in', 'signin', 'authenticate', 'bearer', 'token', 'credentials', 'prijava', 'autentifikacija'],
  automation: ['automation', 'automate', 'automated', 'schedule', 'scheduled', 'scheduler', 'cron', 'automatizacija', 'automatizirati', 'zakazivanje'],
  error: ['error', 'failure', 'failed', 'troubleshoot', 'problem', 'greska', 'greske', 'ne radi'],
}

const stopWords = new Set(('a an the how do does did i we you can could would should please want need my your our ' +
  'me this that these those to from for of in on at with without by as and or is are be been it its some ' +
  'get find show help about using use into through there any something ' +
  'kako mogu moze molim trebam zelim mi se u na iz za sa s od do je su to sto ovaj ove ovu nesto clanak').split(' '))

const normalize = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase()
const tokens = (value: string): string[] => normalize(value).match(/[\p{L}\p{N}_]+/gu) || []
const stem = (word: string) => {
  if (word === 'apis') return 'api'
  if (word.length > 5 && word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (word.length > 5 && word.endsWith('sses')) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith('s') && !/(ss|is|us)$/.test(word)) return word.slice(0, -1)
  return word
}
const aliases = Object.entries(concepts).flatMap(([concept, values]) => values.map((value) => ({
  concept, words: tokens(value).map(stem),
}))).sort((left, right) => right.words.length - left.words.length)
const wordConcepts = new Map(aliases.filter((alias) => alias.words.length === 1).map((alias) => [alias.words[0], alias.concept]))

// Bounded Damerau-Levenshtein distance handles swaps too: excle → excel.
const distance = (left: string, right: string, maximum: number): number => {
  if (Math.abs(left.length - right.length) > maximum) return maximum + 1
  let previousPrevious: number[] = []
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row++) {
    const current = [row]
    for (let column = 1; column <= right.length; column++) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1
      current[column] = Math.min(previous[column] + 1, current[column - 1] + 1, previous[column - 1] + cost)
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) current[column] = Math.min(current[column], previousPrevious[column - 2] + 1)
    }
    if (Math.min(...current) > maximum) return maximum + 1
    previousPrevious = previous
    previous = current
  }
  return previous[right.length]
}

type QueryTerm = { term: string; concept?: string; corrected?: boolean; prefix?: boolean }
type Match = { quality: number; kind: SearchResult['matchType']; text: string }
type SearchField = {
  source: SearchResult['matchSource']; text: string; normalized: string; weight: number
  words: Map<string, string>; concepts: Map<string, string>
}

const queryTerms = (query: string): QueryTerm[] => {
  const words = tokens(query).map(stem)
  const result: QueryTerm[] = []
  for (let index = 0; index < words.length; index++) {
    const alias = aliases.find((entry) => entry.words.length > 1 && entry.words.every((word, offset) => words[index + offset] === word))
    if (alias) {
      result.push({ term: alias.words.join(' '), concept: alias.concept })
      index += alias.words.length - 1
    } else if (!stopWords.has(words[index]) && (words[index] !== 'aris' || words.length === 1)) {
      const term = words[index]
      let concept = wordConcepts.get(term)
      let corrected = false
      if (!concept && /^[a-z]{5,32}$/.test(term)) {
        const maximum = term.length >= 8 ? 2 : 1
        const candidates = [...wordConcepts].map(([word, id]) => ({ id, edits: distance(term, word, maximum) }))
          .filter((candidate) => candidate.edits <= maximum && candidate.edits / term.length <= 0.25)
          .sort((left, right) => left.edits - right.edits)
        const best = candidates[0]
        if (best && candidates.filter((candidate) => candidate.edits === best.edits).every((candidate) => candidate.id === best.id)) {
          concept = best.id
          corrected = true
        }
      }
      result.push({ term, concept, corrected })
    }
  }
  const unique = result.filter((entry, index) => result.findIndex((other) => (other.concept || other.term) === (entry.concept || entry.term)) === index).slice(0, 12)
  if (unique.length) unique[unique.length - 1].prefix = true
  return unique
}

const field = (text: string, source: SearchField['source'], weight: number): SearchField => {
  const words = new Map<string, string>()
  // Keep whole identifiers and camelCase components searchable.
  for (const value of [text, text.replace(/([a-z\d])([A-Z])/g, '$1 $2')]) {
    for (const word of value.match(/[\p{L}\p{N}_]+/gu) || []) words.set(stem(normalize(word)), word)
  }
  const normalized = tokens(text).map(stem).join(' ')
  const stemmed = ` ${normalized} `
  const foundConcepts = new Map<string, string>()
  for (const alias of aliases) {
    if (alias.words.length === 1 && words.has(alias.words[0])) foundConcepts.set(alias.concept, words.get(alias.words[0])!)
    else if (alias.words.length > 1 && stemmed.includes(` ${alias.words.join(' ')} `)) foundConcepts.set(alias.concept, alias.words.join(' '))
  }
  return { source, text, normalized, weight, words, concepts: foundConcepts }
}

const collectText = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(collectText)
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, entry]) => key === 'text' && typeof entry === 'string' ? [entry] : typeof entry === 'object' ? collectText(entry) : [])
}

const articleFields = (article: Article): SearchField[] => {
  const text: string[] = []
  const code: string[] = []
  for (const block of article.content) {
    if (block.blockType === 'richText') text.push(...collectText(block.body))
    if (block.blockType === 'code') code.push(block.code)
    if (block.blockType === 'image') {
      if (block.caption) text.push(block.caption)
      if (typeof block.image === 'object') text.push(block.image.alt)
    }
    if (block.blockType === 'apiFlow') {
      text.push(block.title, block.intro, block.note)
      for (const step of block.steps) {
        text.push(step.title, step.description, step.takeaway)
        // Private endpoint fields must never enter the public search index.
        code.push(step.requestBody || '', step.responseBody)
      }
    }
  }
  const category = typeof article.category === 'object' ? article.category : null
  return [
    field(article.title, 'Title', 8),
    field(article.summary, 'Summary', 4),
    field(category ? `${category.title} ${category.shortTitle}` : '', 'Topic', 2.5),
    field(text.join(' '), 'Article text', 1.5),
    field(code.join('\n'), 'Code', 1),
  ]
}

const excerpt = (text: string, terms: string[], maximum = 190) => {
  const compact = text.replace(/\s+/g, ' ').trim()
  if (compact.length <= maximum) return compact
  const positions = terms.map((term) => normalize(compact).indexOf(normalize(term))).filter((index) => index >= 0)
  const start = Math.max(0, positions.length ? Math.min(...positions) - 55 : 0)
  const end = Math.min(compact.length, start + maximum)
  return `${start ? '…' : ''}${compact.slice(start, end).trim()}${end < compact.length ? '…' : ''}`
}

export const searchArticles = (articles: Article[], query: string, limit = 6): SearchResult[] => {
  const terms = queryTerms(query.trim().slice(0, 80))
  if (!terms.length) return []
  const queryPhrase = tokens(query.trim().slice(0, 80)).map(stem).join(' ')
  const documents = articles.filter((article) => article._status === 'published').map((article) => ({ article, fields: articleFields(article) }))
  const vocabulary = new Set(documents.flatMap((document) => document.fields.flatMap((entry) => [...entry.words.keys()])))
  // Expand against the corpus once per term, not once per article field.
  const variants = terms.map((term) => {
    const matches = new Map<string, Omit<Match, 'text'>>([[term.term, { quality: 1, kind: 'exact' }]])
    for (const word of vocabulary) {
      if (word === term.term) continue
      if (term.prefix && term.term.length >= 2 && word.startsWith(term.term)) matches.set(word, { quality: 0.86, kind: 'exact' })
      else if (/^[a-z]{5,32}$/.test(term.term) && /^[a-z]{4,34}$/.test(word)) {
        const maximum = term.term.length >= 8 ? 2 : 1
        const edits = distance(term.term, word, maximum)
        if (edits <= maximum && edits / Math.max(word.length, term.term.length) <= 0.25) matches.set(word, { quality: 0.7 - edits * 0.05, kind: 'typo' })
      }
    }
    return [...matches].sort((left, right) => right[1].quality - left[1].quality).slice(0, 32)
  })

  const matches = documents.map((document) => {
    const termMatches = terms.map((term, termIndex) => document.fields.flatMap((entry) => {
      const found: (Match & { field: SearchField })[] = []
      for (const [word, match] of variants[termIndex]) {
        const text = entry.words.get(word)
        if (text) found.push({ ...match, text, field: entry })
      }
      if (term.term.includes(' ') && entry.normalized.includes(term.term)) found.push({ quality: 1, kind: 'exact', text: term.term, field: entry })
      const related = term.concept && entry.concepts.get(term.concept)
      if (related) found.push({ quality: term.corrected ? 0.62 : 0.76, kind: term.corrected ? 'typo' : 'related', text: related, field: entry })
      return found
    }).sort((left, right) => right.quality * right.field.weight - left.quality * left.field.weight)[0] || null)
    return { ...document, termMatches }
  })
  const frequencies = terms.map((_, index) => matches.filter((document) => document.termMatches[index]).length)
  const minimum = terms.length <= 2 ? terms.length : Math.ceil(terms.length * 0.65)
  const ranked = matches.flatMap(({ article, fields, termMatches }) => {
    const found = termMatches.filter((match) => match !== null)
    if (found.length < minimum) return []
    const coverage = found.length / terms.length
    const score = termMatches.reduce((total, match, index) => match
      ? total + match.quality * match.field.weight * Math.log(1 + documents.length / (1 + frequencies[index]))
      : total, 0) + 30 * coverage * coverage + fields.reduce((bonus, entry) =>
      bonus + (entry.normalized.includes(queryPhrase) ? entry.weight * 3 : 0), 0)
    const strongest = [...found].sort((left, right) => right.quality * right.field.weight - left.quality * left.field.weight)[0]
    const matchedTerms = [...new Set(found.map((match) => match.text))]
    const matchType = coverage < 1 ? 'partial' : found.some((match) => match.kind === 'typo') ? 'typo' : found.some((match) => match.kind === 'related') ? 'related' : 'exact'
    const snippet = ['Title', 'Topic'].includes(strongest.field.source) ? article.summary : strongest.field.text
    return [{ score, result: {
      category: typeof article.category === 'object' ? article.category.shortTitle : 'Technical article',
      matchSource: strongest.field.source, matchType, matchedTerms,
      publishedAt: article.publishedAt || null, readingTime: article.readingTime || null,
      slug: article.slug, snippet: excerpt(snippet, matchedTerms), title: article.title,
    } satisfies SearchResult }]
  })
  return ranked.sort((left, right) => right.score - left.score ||
    (right.result.publishedAt || '').localeCompare(left.result.publishedAt || '') || left.result.title.localeCompare(right.result.title))
    .slice(0, limit).map((entry) => entry.result)
}
