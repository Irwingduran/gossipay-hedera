import type { SessionState, TransactionRecord, ApprovalRequest, PolicyResult } from './types'

let current: SessionState = {
  totalSpent: 0,
  transactions: [],
  pendingApprovals: [],
}

export function getSession(): SessionState {
  return current
}

export function resetSession(): void {
  current = {
    totalSpent: 0,
    transactions: [],
    pendingApprovals: [],
  }
}

export function addTransaction(record: TransactionRecord): void {
  current.transactions.push(record)
  if (record.status === 'approved') {
    current.totalSpent += record.amount
  }
}

export function addPendingApproval(request: ApprovalRequest): void {
  current.pendingApprovals.push(request)
}

export function resolveApproval(
  id: string,
  status: 'approved' | 'rejected' | 'expired'
): ApprovalRequest | undefined {
  const request = current.pendingApprovals.find((a) => a.id === id)
  if (request) {
    request.status = status
  }
  return request
}

export function getPendingApproval(id: string): ApprovalRequest | undefined {
  return current.pendingApprovals.find((a) => a.id === id)
}
