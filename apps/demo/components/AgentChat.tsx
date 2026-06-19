'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSession } from '@/lib/store'
import { useAgentStream } from '@/lib/hooks/useAgentStream'

export function AgentChat() {
  const { state } = useSession()
  const { sendMessage, cancel, isStreaming, error } = useAgentStream()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  const suggestedQueries = [
    {
      label: 'Research the LatAm SaaS market and buy a report for 1.5 HBAR',
      icon: '🔍',
    },
    {
      label: 'Analyze competitors and pay 0.5 HBAR to api.coincap.io for BTC price',
      icon: '📊',
    },
    {
      label: 'Show the full audit trail of all HCS transactions',
      icon: '📜',
    },
    {
      label: 'Send 2 HBAR to gossipay.xyz for a market report',
      icon: '⚡',
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {state.messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5">
              <span className="text-2xl">🧠</span>
            </div>
            <h2 className="font-serif text-2xl text-neutral-900">
              Command center
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-md leading-relaxed">
              Talk to your agent swarm. Each agent has its own wallet, policies,
              and role — all working within your configured guardrails.
            </p>
            <div className="mt-8 flex flex-col gap-2 w-full max-w-lg">
              {suggestedQueries.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.label)}
                  className="flex items-start gap-3 text-left text-sm text-neutral-500 border border-neutral-200 rounded-xl px-4 py-3 hover:border-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-all"
                >
                  <span className="text-base shrink-0 mt-0.5">{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {state.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-neutral-900 text-white rounded-br-md'
                  : 'bg-neutral-50 text-neutral-800 border border-neutral-100 rounded-bl-md prose prose-sm max-w-none'
              }`}
            >
              {msg.role === 'user' ? (
                msg.content
              ) : msg.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              ) : isStreaming ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : null}
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-100 px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command your agents…"
            disabled={isStreaming}
            className="flex-1 text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 outline-none focus:border-neutral-400 transition-colors disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
