'use client'

import { useSession } from '@/lib/store'

export function ApprovalModal() {
  const { state, dispatch } = useSession()
  const pending = state.pendingApprovals.filter((a) => a.status === 'pending')

  if (pending.length === 0) return null

  const latest = pending[pending.length - 1]

  const handleApprove = () => {
    dispatch({ type: 'UPDATE_APPROVAL', payload: { id: latest.id, status: 'approved' } })
  }

  const handleReject = () => {
    dispatch({ type: 'UPDATE_APPROVAL', payload: { id: latest.id, status: 'rejected' } })
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 max-w-sm w-full mx-4 overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="font-serif text-lg text-neutral-900">Approval required</h3>
          <p className="mt-1 text-sm text-neutral-500">
            A transaction requires your approval before proceeding.
          </p>
          <div className="mt-4 border border-neutral-100 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Amount</span>
              <span className="font-medium text-neutral-900">{latest.amount} HBAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Provider</span>
              <span className="text-neutral-700">{latest.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Tool</span>
              <span className="text-neutral-700">{latest.toolName}</span>
            </div>
          </div>
        </div>
        <div className="flex border-t border-neutral-100 divide-x divide-neutral-100">
          <button
            onClick={handleReject}
            className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 py-3 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}
