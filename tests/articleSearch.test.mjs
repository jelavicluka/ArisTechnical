import assert from 'node:assert/strict'
import fs from 'node:fs'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

import { defaultCategories } from '../src/data/defaultCategories.ts'
import { reportApiFlow } from '../src/data/reportApiFlow.ts'
import { searchArticles } from '../src/utilities/articleSearch.ts'

const articles = ['articles', 'knowledgeBaseArticles'].flatMap(name => JSON.parse(fs.readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8')))
  .map((article, index) => ({
    id: index + 1, title: article.title, summary: article.description, slug: article.slug,
    _status: article.status, publishedAt: `${article.date}T12:00:00Z`,
    category: defaultCategories.find(category => category.slug === article.category),
    content: article.content.map(block => {
      if (block.type === 'richText') return { blockType: 'richText', body: { root: { children: [{ text: new JSDOM(block.html).window.document.body.textContent }] } } }
      if (block.type === 'code') return { ...block, blockType: 'code' }
      return { blockType: 'image', image: { alt: block.alt }, caption: block.caption }
    }),
  }))
articles[0].content.push({ ...reportApiFlow, steps: reportApiFlow.steps.map(step => ({ ...step, endpoint: '/confidential/secret-endpoint-8341' })) })

const top = (query, slug) => assert.equal(searchArticles(articles, query)[0]?.slug, slug, query)
const excel = 'export-selected-model-names-to-excel'
const external = 'run-aris-reports-from-external-applications'
const navigation = 'change-active-navigation-color-in-aris-connect'
const database = 'hide-database-switcher-in-aris-connect'

test('finds tasks regardless of word order and common filler words', () => {
  for (const query of ['excel export', 'export excel', 'how can I export model names to excel', 'download selected models as xlsx', 'spreadsheet list of model names']) top(query, excel)
})
test('understands related terms and task descriptions in English and Croatian', () => {
  for (const query of ['trigger report from another app', 'pokreni report izvana']) top(query, external)
  for (const query of ['hide database dropdown', 'makni odabir baze']) top(query, database)
  for (const query of ['change menu colour', 'promjena boje navigacije']) top(query, navigation)
  top('koliko funkcija', 'count-function-occurrences-in-models')
})
test('tolerates misspellings and swapped letters', () => {
  top('excle export', excel)
  top('hide database swticher', database)
  top('menu higlight colur', navigation)
  assert.equal(searchArticles(articles, 'excle export')[0].matchType, 'typo')
})
test('preserves exact technical identifiers, searchable code and API examples', () => {
  top('Utilities.getNetUtils().doRestCall', 'call-rest-api-from-aris-report')
  top('ObjOccListFilter', 'count-function-occurrences-in-models')
  top('run_demo_1042', external)
  assert.equal(searchArticles(articles, 'run_demo_1042')[0].matchSource, 'Code')
  assert.deepEqual(searchArticles(articles, 'APIs').map(result => result.slug), searchArticles(articles, 'API').map(result => result.slug))
})
test('does not invent matches for unrelated or unsupported requests', () => {
  for (const query of ['quantum physics', 'kubernetes cluster', 'ldap password', 'excel unicorn', 'a the how to', '...', 'zzzzzzzz']) assert.deepEqual(searchArticles(articles, query), [], query)
})
test('keeps private endpoints and unpublished articles out of results', () => {
  assert.deepEqual(searchArticles(articles, 'secret-endpoint-8341'), [])
  const draft = { ...articles[0], title: 'Unpublished zebracorn', slug: 'private-draft', _status: 'draft' }
  assert.deepEqual(searchArticles([...articles, draft], 'zebracorn'), [])
  for (const result of searchArticles(articles, 'external report')) assert.ok(!JSON.stringify(result).includes('/confidential/'))
})
test('ranks a direct title above a long body with repeated keywords', () => {
  const noisy = { ...articles[0], slug: 'noisy-example', title: 'General notes', summary: 'Technical reference', content: [{ blockType: 'code', code: 'excel export '.repeat(2000) }] }
  top('export selected model names', excel)
  assert.equal(searchArticles([...articles, noisy], 'excel export')[0].slug, excel)
})
test('returns matched evidence, useful labels and a bounded number of results', () => {
  const related = searchArticles(articles, 'change menu colour')[0]
  assert.equal(related.matchType, 'related')
  assert.ok(related.matchedTerms.some(term => /navigation/i.test(term)))
  assert.ok(related.snippet.length <= 192)
  assert.equal(searchArticles(articles, 'aris', 2).length, 2)
  assert.ok(searchArticles(articles, 'ex').length > 0)
})
