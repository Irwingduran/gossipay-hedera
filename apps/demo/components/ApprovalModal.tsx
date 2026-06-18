'use client'

import { useState } from 'react'
import { useSession } from '@/lib/store'
import { useAgentStream } from '@/lib/hooks/useAgentStream'

export function ApprovalModal() {
  const { state, dispatch } = useSession()
  const { sendMessage, isStreaming } = useAgentStream()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const pending = state.pendingApprovals.filter((a) => a.status === 'pending')

  if (pending.length === 0) return null

  const latest = pending[pending.length - 1]

  const handleAction = async (action: 'approved' | 'rejected') => {
    setLoadingId(latest.id)
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ approvalId: latest.id, action }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to process approval')
      }

      dispatch({
        type: 'UPDATE_APPROVAL',
        payload: { id: latest.id, status: action },
      })

      if (action === 'approved') {
        setTimeout(() => {
          sendMessage(
            `The transaction for ${latest.amount} HBAR to ${latest.provider} was approved. Please retry and complete it.`
          )
        }, 500)
      }
    } catch (err: any) {
      console.error('Approval error:', err)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white border border-neutral-200 rounded-xl shadow-lg w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
              Approval required
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            The <strong className="text-neutral-800">{latest.toolName}</strong>{' '}
            agent wants to send{' '}
            <strong className="text-neutral-800">{latest.amount} HBAR</strong>{' '}
            to <strong className="text-neutral-800">{latest.provider}</strong>.
          </p>
          <p className="mt-2 text-[11px] text-neutral-400 font-mono">
            Approval ID: {latest.id.slice(0, 12)}…
          </p>
        </div>
        <div className="flex border-t border-neutral-100 divide-x divide-neutral-100">
          <button
            onClick={() => handleAction('rejected')}
            disabled={loadingId === latest.id}
            className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject
          </button>
          <button
            onClick={() => handleAction('approved')}
            disabled={loadingId === latest.id}
            className="flex-1 py-3 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loadingId === latest.id ? 'Processing…' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}
