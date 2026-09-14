import { createHash } from 'node:crypto'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  EmailConfigurationError,
  EmailDeliveryError,
  sendContactInquiryEmail,
  type ContactInquiry,
} from '@/services/email/contactEmail'

export const dynamic = 'force-dynamic'

type Inquiry = ContactInquiry & {
  website: string
}

const requests = new Map<string, number[]>()
const allowedTopics = new Set([
  'ARIS administration',
  'Custom reports & scripts',
  'Connect Portal customization',
  'APG & automation',
  'Integration',
  'Installation & upgrade',
  'Troubleshooting or code review',
  'Another technical challenge',
])

const stringValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const parseInquiry = (body: unknown): Inquiry | null => {
  if (!body || typeof body !== 'object') return null

  const input = body as Record<string, unknown>
  const inquiry = {
    company: stringValue(input.company),
    email: stringValue(input.email).toLowerCase(),
    message: stringValue(input.message),
    name: stringValue(input.name),
    topic: stringValue(input.topic),
    website: stringValue(input.website),
  }
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)
  const validHeaderName = !/[\r\n]/.test(inquiry.name)

  if (
    inquiry.name.length < 2 ||
    inquiry.name.length > 100 ||
    !validHeaderName ||
    !validEmail ||
    inquiry.email.length > 254 ||
    inquiry.company.length > 120 ||
    !allowedTopics.has(inquiry.topic) ||
    inquiry.message.length < 20 ||
    inquiry.message.length > 5000
  ) {
    return null
  }

  return inquiry
}

const rateLimited = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const address = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const key = createHash('sha256').update(address).digest('hex')
  const now = Date.now()
  const recent = (requests.get(key) || []).filter((timestamp) => now - timestamp < 10 * 60 * 1000)

  if (recent.length >= 5) return true

  requests.set(key, [...recent, now])
  return false
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 20_000) {
    return NextResponse.json({ message: 'The request is too large.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Please submit a valid contact request.' }, { status: 400 })
  }

  if (body && typeof body === 'object' && stringValue((body as Record<string, unknown>).website)) {
    return NextResponse.json({ message: 'Thank you. Your message has been received.' })
  }

  const inquiry = parseInquiry(body)
  if (!inquiry) {
    return NextResponse.json(
      { message: 'Please check the required fields and try again.' },
      { status: 400 },
    )
  }
  if (rateLimited(request)) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    const delivery = await sendContactInquiryEmail(inquiry)
    console.info('Contact inquiry delivered.', { emailID: delivery.id })
  } catch (error) {
    if (error instanceof EmailConfigurationError) {
      return NextResponse.json(
        { message: 'Email delivery is not configured yet. Please try again later.' },
        { status: 503 },
      )
    }

    if (error instanceof EmailDeliveryError) {
      console.error('Contact inquiry delivery failed.', { cause: error.cause })
    } else {
      console.error('Unexpected contact inquiry error.', { error })
    }

    return NextResponse.json(
      { message: 'The message could not be sent. Please try again in a moment.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ message: 'Message successfully sent. Thank you for getting in touch.' })
}
