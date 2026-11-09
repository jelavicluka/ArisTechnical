import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import React, { act } from 'react'
import ts from 'typescript'

test('search suggestions handle highlights, keyboard navigation, stale requests and empty results', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:3000' })
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator })
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const requests = []
  globalThis.fetch = (url, options) => new Promise(resolve => requests.push({ url, options, resolve }))

  const scratch = path.resolve('.payload-source')
  fs.mkdirSync(scratch, { recursive: true })
  const output = path.join(scratch, 'HomeArticleSearch.test.cjs')
  const source = fs.readFileSync(new URL('../src/components/home/HomeArticleSearch.tsx', import.meta.url), 'utf8')
  fs.writeFileSync(output, ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText)
  const require = createRequire(import.meta.url)
  const { HomeArticleSearch } = require(output)
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(document.getElementById('root'))
  const waitForRequest = async () => act(async () => { await new Promise(resolve => setTimeout(resolve, 245)) })
  const enterQuery = async value => act(async () => {
    const input = document.querySelector('input')
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(input, value)
    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
  const respond = async (request, results) => act(async () => request.resolve({ ok: true, json: async () => ({ results }) }))
  const key = async value => act(async () => document.querySelector('input').dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: value, bubbles: true })))
  const result = {
    title: 'Export model names to Excel', snippet: 'Create an Excel workbook.', slug: 'export-models',
    category: 'Reports & Scripts', matchSource: 'Title', matchType: 'typo', matchedTerms: ['Export', 'Excel'],
  }

  try {
    await act(async () => root.render(React.createElement(HomeArticleSearch)))
    await enterQuery('excle export')
    await waitForRequest()
    assert.equal(requests.length, 1)
    assert.ok(requests[0].url.includes('excle%20export'))
    await respond(requests[0], [result, { ...result, slug: 'another-models-guide' }])
    assert.equal(document.querySelectorAll('[role="option"]').length, 2)
    assert.ok(document.querySelector('mark').textContent.includes('Export'))
    assert.ok(document.body.textContent.includes('Close spelling'))
    await key('ArrowDown')
    assert.equal(document.querySelector('input').getAttribute('aria-activedescendant'), 'home-search-result-1')
    await key('Escape')
    assert.equal(document.querySelector('[role="listbox"]'), null)

    await enterQuery('menu colour')
    assert.equal(document.querySelectorAll('[role="option"]').length, 0, 'Old results clear immediately')
    await waitForRequest()
    const obsolete = requests[1]
    await enterQuery('external report')
    await waitForRequest()
    assert.equal(obsolete.options.signal.aborted, true)
    await respond(obsolete, [{ ...result, title: 'Stale result must never appear' }])
    assert.ok(!document.body.textContent.includes('Stale result'))
    await key('Escape')
    await respond(requests[2], [result])
    assert.equal(document.querySelector('[role="listbox"]'), null, 'A late response must not reopen a dismissed dropdown')

    await enterQuery('quantum physics')
    await waitForRequest()
    await respond(requests[3], [])
    assert.ok(document.body.textContent.includes('No close matches yet'))
    const example = [...document.querySelectorAll('.home-search-empty button')][0]
    await act(async () => example.click())
    assert.equal(document.querySelector('input').value, 'Export to Excel')
    await act(async () => document.querySelector('[aria-label="Clear search"]').click())
    assert.equal(document.querySelector('input').value, '')
    assert.equal(document.querySelector('[role="listbox"]'), null)
  } finally {
    await act(async () => root.unmount())
    dom.window.close()
  }
})
