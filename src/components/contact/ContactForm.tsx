'use client'

import { useState } from 'react'

const contactTopics = [
  'ARIS administration',
  'Custom reports & scripts',
  'Connect Portal customization',
  'APG & automation',
  'Integration',
  'Installation & upgrade',
  'Troubleshooting or code review',
  'Another technical challenge',
]

export function ContactForm() {
  const [state, setState] = useState<'error' | 'idle' | 'sending' | 'success'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const inquiry = Object.fromEntries(formData.entries())

    setState('sending')
    setMessage('Sending your message…')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      })
      const result = (await response.json()) as { message?: string }
      if (!response.ok) throw new Error(result.message || 'The message could not be sent.')

      form.reset()
      setState('success')
      setMessage(result.message || 'Message successfully sent. Thank you for getting in touch.')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'The message could not be sent. Please try again.')
    }
  }

  return (
    <div className="contact-form-panel">
      <div className="contact-form-heading"><span>Technical request</span><i><b /> Direct inquiry</i></div>
      <form className="contact-form" onSubmit={submit}>
        <div className="contact-form-row">
          <label>
            <span className="contact-field-label">Name <i aria-hidden="true">*</i></span>
            <input name="name" type="text" autoComplete="name" placeholder="Your name" minLength={2} maxLength={100} required />
          </label>
          <label>
            <span className="contact-field-label">Email <i aria-hidden="true">*</i></span>
            <input name="email" type="email" autoComplete="email" placeholder="you@email.com" maxLength={254} required />
          </label>
        </div>
        <label>
          Company (optional)
          <input name="company" type="text" autoComplete="organization" placeholder="Company or organization" maxLength={120} />
        </label>
        <label>
          <span className="contact-field-label">What do you need help with? <i aria-hidden="true">*</i></span>
          <select name="topic" defaultValue="" required>
            <option value="" disabled>Select a technical area</option>
            {contactTopics.map((topic) => <option value={topic} key={topic}>{topic}</option>)}
          </select>
        </label>
        <label>
          <span className="contact-field-label">Tell me about the challenge <i aria-hidden="true">*</i></span>
          <textarea
            name="message"
            rows={7}
            minLength={20}
            maxLength={5000}
            placeholder="Tell me about the current situation, the expected result and anything that may help explain the challenge."
            required
          />
        </label>
        <label className="contact-honeypot" aria-hidden="true">
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <div className="contact-form-footer">
          <p>Your details will only be used to respond to this inquiry.</p>
          <button className="button button-primary" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span>
          </button>
        </div>
        {message ? <p className={`contact-form-status is-${state}`} role="status" aria-live="polite">{message}</p> : null}
      </form>
    </div>
  )
}
