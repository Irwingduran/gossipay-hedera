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
  title: 'gossipay — programmable economy for AI agents',
  description:
    'The programmable economic layer for autonomous AI agents, built on Hedera.',
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
