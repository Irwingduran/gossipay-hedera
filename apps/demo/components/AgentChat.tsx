'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from '@/lib/store'
import { useAgentStream } from '@/lib/hooks/useAgentStream'
import { TransactionCard } from './TransactionCard'

export function AgentChat() {
  const { state } = useSession()
  const { sendMessage, cancel, isStreaming, error } = useAgentStream()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages, state.transactions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  const suggestedQueries = [
    'Analyze LatAm SaaS market viability',
    'Research competitors in AI payments',
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {state.messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="font-serif text-2xl text-neutral-900">
              Agentic economy demo
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-md">
              Ask the agent to research the Latin American SaaS market. It will
              gather intelligence, evaluate opportunities, and execute
              micro-payments on Hedera Testnet.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {suggestedQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-sm text-neutral-500 border border-neutral-200 rounded-lg px-4 py-2 hover:border-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {q}
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
              className={`max-w-[70%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-50 text-neutral-800 border border-neutral-100'
              }`}
            >
              {msg.content || (msg.role === 'assistant' && isStreaming ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : null)}
            </div>
          </div>
        ))}

        {state.transactions.length > 0 && (
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-xs font-medium text-neutral-400 mb-3 uppercase tracking-wider">
              Transactions
            </p>
            <div className="space-y-2">
              {state.transactions.map((tx, i) => (
                <TransactionCard key={i} transaction={tx} />
              ))}
            </div>
          </div>
        )}

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
            placeholder="Ask the agent to do something…"
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
