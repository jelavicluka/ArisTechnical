'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { CodeContentBlock } from '@/payload-types'

import styles from './article.module.css'

const languageLabels: Record<CodeContentBlock['language'], string> = {
  bash: 'Command line',
  javascript: 'JavaScript',
  json: 'JSON',
  sql: 'SQL',
  text: 'Plain text',
  xml: 'XML',
}

export const ArticleCodeBlock = ({ caption, code, filename, language }: CodeContentBlock) => {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lines = useMemo(() => code.replace(/\r\n/g, '\n').split('\n'), [code])
  const isLong = lines.length > 16 || code.length > 1200

  useEffect(
    () => () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current)
    },
    [],
  )

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)

    if (copyResetTimer.current) clearTimeout(copyResetTimer.current)
    copyResetTimer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <figure className={styles.codeFigure}>
      <div className={styles.codeWindow}>
        <div className={styles.codeToolbar}>
          <div className={styles.windowDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className={styles.codeIdentity}>
            <span>{filename || 'Code example'}</span>
            <small>{languageLabels[language]}</small>
          </div>
          <button className={styles.copyButton} type="button" onClick={copyCode}>
            {copied ? (
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <path d="m3 8 3 3 7-7" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <rect x="5" y="5" width="8" height="8" rx="1.5" />
                <path d="M3 11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V3" />
              </svg>
            )}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className={`${styles.codeViewport} ${isLong && !expanded ? styles.codeCollapsed : ''}`}>
          <pre tabIndex={0} aria-label={`${languageLabels[language]} source code`}>
            <code>
              {lines.map((line, index) => (
                <span className={styles.codeLine} key={`${index}-${line}`}>
                  <span className={styles.lineNumber} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{line || ' '}</span>
                </span>
              ))}
            </code>
          </pre>
          {isLong && !expanded ? <div className={styles.codeFade} aria-hidden="true" /> : null}
        </div>

        {isLong ? (
          <div className={styles.codeFooter}>
            <span>{lines.length} lines</span>
            <button type="button" onClick={() => setExpanded((current) => !current)}>
              {expanded ? 'Collapse code' : 'Expand code'}
              <svg className={expanded ? styles.chevronUp : ''} aria-hidden="true" viewBox="0 0 16 16">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
