'use client'

import { useEffect, useId, useState } from 'react'

import { reportScenarios } from '@/data/reportJourney'
import type { ReportJourneyContentBlock } from '@/payload-types'

import styles from './reportJourney.module.css'

function JourneyIcon({ kind }: { kind: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'check' ? <><path d="m7 12 3 3 7-7" /><circle cx="12" cy="12" r="9" /></>
        : kind === 'sync' ? <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1" /></>
          : kind === 'document' ? <><path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h5" /></>
            : kind === 'aris' ? <><path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></>
              : <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M7 9h4M7 12h9" /></>}
    </svg>
  )
}

function Journey({ scenario }: { scenario: typeof reportScenarios[number] }) {
  const [phase, setPhase] = useState(0)
  const [playing, setPlaying] = useState(false)
  const panelId = useId()
  const stages = [
    { label: 'Your application asks', title: scenario.request, detail: scenario.input, icon: 'app' },
    { label: 'ARIS does the work', title: scenario.work, detail: scenario.detail, icon: 'aris' },
    { label: 'The result comes back', title: scenario.result, detail: scenario.outcome, icon: scenario.icon },
  ]

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => {
      setPhase(phase + 1)
      if (phase + 1 === stages.length - 1) setPlaying(false)
    }, 1600)
    return () => clearTimeout(timer)
  }, [phase, playing, stages.length])

  return (
    <div className={styles.demo}>
      <div className={styles.demoBar}>
        <span><i aria-hidden="true" /> Your task, connected</span>
        <span className={styles.sample}>Illustrative demo</span>
      </div>

      <nav className={`${styles.flow} ${playing ? styles.playing : ''}`} aria-label="Integration journey steps">
        {stages.map((stage, index) => (
          <button
            type="button" key={stage.label}
            className={`${styles.stage} ${phase === index ? styles.active : ''} ${phase > index ? styles.complete : ''}`}
            aria-pressed={phase === index} aria-controls={panelId}
            onClick={() => { setPlaying(false); setPhase(index) }}
          >
            <span className={styles.stageTop}><span>0{index + 1}</span><span>{phase > index ? 'Complete' : phase === index ? 'Explore' : 'Next'}</span></span>
            <span className={styles.icon}><JourneyIcon kind={stage.icon} /></span>
            <strong>{stage.label}</strong>
            <span className={styles.stageCaption}>{index === 0 ? 'Send the task and inputs' : index === 1 ? 'Run your report logic' : 'Use the answer in your system'}</span>
            {index < stages.length - 1 ? <span className={styles.connector} aria-hidden="true">→</span> : null}
          </button>
        ))}
      </nav>

      <div className={styles.detail} id={panelId}>
        <div className={styles.story} role="status" aria-live="polite" aria-atomic="true">
          <p className={styles.stepLabel}>Step 0{phase + 1} / 03</p>
          <h3>{stages[phase].title}</h3>
          <p>{stages[phase].detail}</p>
        </div>
        <div className={`${styles.result} ${phase === 2 ? styles.resultReady : ''}`}>
          {phase === 2 ? <>
            <span className={styles.resultLabel}>Sample result</span>
            <p className={styles.metric}><strong>{scenario.metric}</strong><span>{scenario.metricLabel}</span></p>
            <ul>{scenario.facts.map(fact => <li key={fact}><span aria-hidden="true">✓</span>{fact}</li>)}</ul>
            <p className={styles.next}>{scenario.next}</p>
          </> : <>
            <span className={styles.resultLabel}>The value of the connection</span>
            <p className={styles.promise}>The answer returns to where the work started.</p>
            <p className={styles.waiting}>Follow the flow to see a sample result.</p>
            <span className={styles.signal} aria-hidden="true"><i /><i /><i /></span>
          </>}
        </div>
      </div>

      <div className={styles.controls}>
        <p>The report defines what ARIS does. Your application uses the result.</p>
        <button type="button" onClick={() => {
          if (playing) setPlaying(false)
          else { setPhase(0); setPlaying(true) }
        }}>
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
          {playing ? 'Pause' : phase === 2 ? 'Play again' : 'Play the flow'}
        </button>
      </div>
    </div>
  )
}

export function ArticleReportJourney({ title, intro, note }: ReportJourneyContentBlock) {
  const [selected, setSelected] = useState(0)
  const headingId = useId()
  const scenario = reportScenarios[selected]

  return (
    <section className={styles.journey} aria-labelledby={headingId}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Explore the possibilities</p>
        <h2 id={headingId}>{title}</h2>
        <p>{intro}</p>
      </header>
      <div className={styles.scenarios} role="group" aria-label="Choose an example task">
        {reportScenarios.map((item, index) => (
          <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <JourneyIcon kind={item.icon} />{item.label}
          </button>
        ))}
      </div>
      <Journey key={scenario.id} scenario={scenario} />
      <p className={styles.note}>{note}</p>
    </section>
  )
}
