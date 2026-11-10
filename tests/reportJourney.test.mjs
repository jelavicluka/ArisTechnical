import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import React, { act } from 'react'
import ts from 'typescript'

test('report demo plays, pauses, switches scenarios and cancels obsolete playback', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:3000' })
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator })
  globalThis.IS_REACT_ACT_ENVIRONMENT = true

  const scratch = path.resolve('.payload-source')
  fs.mkdirSync(scratch, { recursive: true })
  const compile = (source, name) => fs.writeFileSync(path.join(scratch, name), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText)
  compile(fs.readFileSync(new URL('../src/data/reportJourney.ts', import.meta.url), 'utf8'), 'reportJourney.cjs')
  compile(fs.readFileSync(new URL('../src/components/article/ArticleReportJourney.tsx', import.meta.url), 'utf8')
    .replace("'@/data/reportJourney'", "'./reportJourney.cjs'")
    .replace("import styles from './reportJourney.module.css'", 'const styles = {}'), 'ArticleReportJourney.cjs')
  const require = createRequire(import.meta.url)
  const { ArticleReportJourney } = require(path.join(scratch, 'ArticleReportJourney.cjs'))
  const { reportJourney } = require(path.join(scratch, 'reportJourney.cjs'))
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(document.getElementById('root'))
  const button = (label) => [...document.querySelectorAll('button')].find(item => item.textContent.includes(label))
  const click = async (label) => act(async () => button(label).click())
  const advance = async () => act(async () => t.mock.timers.tick(1600))
  const story = () => document.querySelector('[role="status"]').textContent
  t.mock.timers.enable({ apis: ['setTimeout'] })

  try {
    await act(async () => root.render(React.createElement(ArticleReportJourney, reportJourney)))
    assert.match(story(), /Check our purchasing processes/)
    assert.equal(button('Check process quality').getAttribute('aria-pressed'), 'true')
    await click('Play the flow')
    await advance()
    assert.match(story(), /ARIS checks the processes/)
    await click('Pause')
    await advance()
    assert.match(story(), /ARIS checks the processes/, 'Pause stops the running timer')

    await click('Play the flow')
    await click('Update ARIS data')
    await advance()
    assert.match(story(), /Assign a new process owner/, 'Changing the task cancels prior playback')
    await click('The result comes back')
    assert.match(document.body.textContent, /8process owners updated/)
    assert.match(document.body.textContent, /New owner: Process Operations/)

    await click('Generate a document')
    await click('Play the flow')
    await advance()
    await advance()
    assert.match(story(), /A document link comes back/)
    assert.match(document.body.textContent, /Process overview.pdf/)
    assert.ok(button('Play again'))
    assert.match(document.body.textContent, /no connection to an ARIS server/)

    await click('Play again')
    assert.match(story(), /Prepare a process overview/)
    await act(async () => root.unmount())
    await advance()
  } finally {
    t.mock.timers.reset()
    dom.window.close()
  }
})
