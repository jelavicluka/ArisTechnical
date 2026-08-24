import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './styles.css'

export const metadata: Metadata = {
  description: 'Technical content platform migration foundation.',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { type: 'image/svg+xml', url: '/aris-technical-mark.svg' },
      { sizes: '32x32', type: 'image/png', url: '/favicon-32x32.png' },
    ],
  },
  robots: {
    follow: false,
    index: false,
  },
  title: 'Technical Content Platform',
}

type Args = {
  children: ReactNode
}

const FrontendLayout = ({ children }: Args) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)

export default FrontendLayout
