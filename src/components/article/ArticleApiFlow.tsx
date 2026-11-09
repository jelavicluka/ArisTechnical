'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'

import type { ApiFlowContentBlock } from '@/payload-types'

import styles from './apiFlow.module.css'

const JsonExample = ({ value }: { value: string }) => (
  <Highlight code={value} language="json" theme={themes.oneDark}>
    {({ getLineProps, getTokenProps, tokens }) => (
      <pre tabIndex={0}>
        <code>
          {tokens.map((line, index) => (
            <span {...getLineProps({ line })} className={styles.codeLine} key={index}>
              {line.map((token, tokenIndex) => <span {...getTokenProps({ token })} key={tokenIndex} />)}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    )}
  </Highlight>
)

export function ArticleApiFlow({ intro, note, steps, title }: ApiFlowContentBlock) {
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState<'request' | 'response' | 'unavailable' | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headingId = useId()
  const panelId = useId()
  const step = steps[selected]

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current)
  }, [])

  if (!step) return null

  const selectStep = (index: number) => {
    setSelected(index)
    setCopied(null)
  }

  const copyExample = async (kind: 'request' | 'response') => {
    const request = [
      'Authorization: Bearer {{accessToken}}',
      'Accept: application/json',
      ...(step.requestBody ? ['Content-Type: application/json', '', step.requestBody] : []),
    ].join('\n')

    try {
      await navigator.clipboard.writeText(kind === 'request' ? request : step.responseBody)
      setCopied(kind)
    } catch {
      setCopied('unavailable')
    }
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section className={styles.walkthrough} aria-labelledby={headingId}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span aria-hidden="true">↗</span> Inside the API flow</p>
        <h2 id={headingId}>{title}</h2>
        <p>{intro}</p>
      </header>

      <div className={styles.client}>
        <div className={styles.clientBar}>
          <span className={styles.clientTitle}><span className={styles.clientIcon} aria-hidden="true">{'{ }'}</span> Report runner</span>
          <span className={styles.exampleLabel}>Interactive example</span>
        </div>

        <nav className={styles.steps} aria-label="Report execution steps">
          {steps.map((item, index) => (
            <button
              type="button"
              aria-pressed={selected === index}
              aria-controls={panelId}
              className={selected === index ? styles.activeStep : undefined}
              key={item.id || index}
              onClick={() => selectStep(index)}
            >
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
              {index < steps.length - 1 ? <span className={styles.stepArrow} aria-hidden="true">→</span> : null}
            </button>
          ))}
        </nav>

        <div id={panelId}>
          <p className={styles.stepDescription} aria-live="polite">{step.description}</p>

          <div className={styles.exchange}>
            <section className={styles.pane} aria-label="Example request">
              <div className={styles.paneHeader}>
                <h3>Request <span>{step.requestBody ? 'Body · JSON' : 'Headers'}</span></h3>
                <button type="button" onClick={() => copyExample('request')} aria-label="Copy example request">
                  {copied === 'request' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <div className={styles.auth}><span aria-hidden="true">⌁</span> Bearer <code>{'{{accessToken}}'}</code></div>
              {step.requestBody ? <JsonExample value={step.requestBody} /> : (
                <div className={styles.emptyRequest}>
                  <span className={styles.emptyIcon} aria-hidden="true">↗</span>
                  <strong>No request body needed.</strong>
                  <p>The run ID identifies the report execution.</p>
                  <code>Accept: application/json</code>
                </div>
              )}
            </section>

            <section className={styles.pane} aria-label="Example response">
              <div className={styles.paneHeader}>
                <h3>Response <span className={styles.status}><i />{step.responseStatus}</span></h3>
                <button type="button" onClick={() => copyExample('response')} aria-label="Copy example response">
                  {copied === 'response' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <div className={styles.responseFormat}>application/json <span>Example response</span></div>
              <JsonExample value={step.responseBody} />
            </section>
          </div>

          <div className={styles.takeaway}>
            <p><span aria-hidden="true">✦</span>{step.takeaway}</p>
            <button type="button" onClick={() => selectStep((selected + 1) % steps.length)}>
              {selected < steps.length - 1 ? 'Next step' : 'Start again'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
      <p className={styles.note}>{note}</p>
      <span className={styles.srOnly} role="status">{copied === 'unavailable' ? 'Copy unavailable. Select the example text to copy it.' : copied ? 'Example copied to clipboard.' : ''}</span>
    </section>
  )
}
