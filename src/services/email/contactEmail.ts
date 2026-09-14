import 'server-only'

import { randomUUID } from 'node:crypto'

import { Resend } from 'resend'

export type ContactInquiry = {
  company: string
  email: string
  message: string
  name: string
  topic: string
}

export class EmailConfigurationError extends Error {
  constructor() {
    super('Contact email delivery is not configured.')
    this.name = 'EmailConfigurationError'
  }
}

export class EmailDeliveryError extends Error {
  constructor(cause?: unknown) {
    super('The email provider could not deliver the contact inquiry.', { cause })
    this.name = 'EmailDeliveryError'
  }
}

const escapeHTML = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const getConfiguration = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  const recipients = (process.env.CONTACT_RECIPIENT_EMAIL || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)

  if (!apiKey || !from || recipients.length === 0) throw new EmailConfigurationError()

  return { apiKey, from, recipients }
}

const renderText = (inquiry: ContactInquiry) => `New website inquiry

Name: ${inquiry.name}
Email: ${inquiry.email}
Company: ${inquiry.company || 'Not provided'}
Topic: ${inquiry.topic}

Message
-------
${inquiry.message}
`

const renderHTML = (inquiry: ContactInquiry) => {
  const name = escapeHTML(inquiry.name)
  const email = escapeHTML(inquiry.email)
  const company = escapeHTML(inquiry.company || 'Not provided')
  const topic = escapeHTML(inquiry.topic)
  const message = escapeHTML(inquiry.message).replaceAll('\n', '<br>')

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f5f3f7;color:#211b28;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">New inquiry from ${name} about ${topic}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f3f7;padding:32px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e3dfe7;border-radius:12px;overflow:hidden">
            <tr>
              <td style="background:#17121d;padding:24px 28px;color:#ffffff">
                <div style="color:#b77afc;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Technical consulting</div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3">New technical inquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.6">
                  <tr><td style="width:110px;padding:5px 0;color:#716879">Name</td><td style="padding:5px 0;font-weight:600">${name}</td></tr>
                  <tr><td style="padding:5px 0;color:#716879">Email</td><td style="padding:5px 0"><a href="mailto:${email}" style="color:#7a3db8">${email}</a></td></tr>
                  <tr><td style="padding:5px 0;color:#716879">Company</td><td style="padding:5px 0">${company}</td></tr>
                  <tr><td style="padding:5px 0;color:#716879">Topic</td><td style="padding:5px 0">${topic}</td></tr>
                </table>
                <div style="height:1px;background:#e8e4eb;margin:24px 0"></div>
                <div style="margin-bottom:8px;color:#716879;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Message</div>
                <div style="font-size:15px;line-height:1.75">${message}</div>
              </td>
            </tr>
            <tr>
              <td style="background:#faf9fb;padding:18px 28px;color:#716879;font-size:12px">Replying to this email will reply directly to ${name}.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export const sendContactInquiryEmail = async (inquiry: ContactInquiry) => {
  const { apiKey, from, recipients } = getConfiguration()
  const resend = new Resend(apiKey)
  const safeName = inquiry.name.replace(/[\r\n]+/g, ' ')
  const safeTopic = inquiry.topic.replace(/[\r\n]+/g, ' ')

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        html: renderHTML(inquiry),
        replyTo: inquiry.email,
        subject: `[Website inquiry] ${safeTopic} — ${safeName}`,
        text: renderText(inquiry),
        to: recipients,
      },
      {
        idempotencyKey: `contact/${randomUUID()}`,
      },
    )

    if (error || !data?.id) throw new EmailDeliveryError(error)

    return { id: data.id }
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error
    throw new EmailDeliveryError(error)
  }
}
