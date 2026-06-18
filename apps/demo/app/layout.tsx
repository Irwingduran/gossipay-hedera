import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "gossipay — programmable economy for AI agents",
  description:
    "The programmable economic layer for autonomous AI agents, built on Hedera.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">{children}</body>
    </html>
  )
}
