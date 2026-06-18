import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Mono } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/lib/store'

const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'gossipay — the agent commerce network on Hedera',
  description:
    'Autonomous agents trading, negotiating, and executing payments on Hedera — each with its own wallet, policies, and role. Immutable audit trail on HCS.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="font-mono antialiased bg-white text-neutral-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
