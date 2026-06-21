'use client'

import { useEffect, useState } from 'react'

const messages = [
  { role: 'user', text: 'Pay 5 HBAR to 0.0.456789 for monthly premium access' },
  { role: 'agent', text: 'Checking policy… Daily limit: 20 HBAR (3 used) ✓' },
  { role: 'agent', text: 'Allow list: 0.0.456789 approved ✓' },
  { role: 'agent', text: 'Hedera tx: 0x3a1f…9c02 · ✅ confirmed · 1.8s finality' },
]

const stepLabels = ['You', 'Agent', 'Policies', 'Hedera']

export function HeroVisual() {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (visible >= messages.length) return

    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      const next = setTimeout(() => setVisible((v) => v + 1), 600)
      return () => clearTimeout(next)
    }, 800)

    return () => clearTimeout(t)
  }, [visible])

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="border border-neutral-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-[11px] text-neutral-400 font-medium">gossipay · mission control</span>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 space-y-3 min-h-[260px]">
          {messages.slice(0, visible).map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white rounded-br-md'
                    : 'bg-neutral-100 text-neutral-700 rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 rounded-xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Flow bar */}
        <div className="flex items-center justify-center gap-0 border-t border-neutral-100 px-4 py-3 bg-neutral-50/50">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-0">
              {i > 0 && (
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-neutral-300 -mx-1">
                  <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span
                className={`text-[10px] font-medium px-2 py-1 rounded-md transition-colors ${
                  i < Math.min(visible, messages.length)
                    ? 'text-neutral-900 bg-neutral-200/60'
                    : 'text-neutral-400'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
