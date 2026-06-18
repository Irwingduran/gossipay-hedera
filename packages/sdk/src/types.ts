export interface SpendLimitConfig {
  maxPerTransaction: number
  maxPerSession: number
  currency: 'HBAR'
}

export interface AllowListConfig {
  providers: string[]
}

export interface RequireApprovalConfig {
  aboveAmount: number
  currency: 'HBAR'
  timeoutSeconds: number
}

export type PolicyConfig = SpendLimitConfig | AllowListConfig | RequireApprovalConfig

export interface GossipayWalletConfig {
  accountId: string
  privateKey: string
  network?: string
  policies: PolicyConfig[]
  auditTopicId?: string
}

export interface TransactionRecord {
  amount: number
  provider: string
  recipient: string
  toolName: string
  timestamp: number
  status: 'approved' | 'blocked' | 'pending_approval'
  txHash?: string
  policyResults: PolicyResult[]
}

export interface PolicyResult {
  policyName: string
  allowed: boolean
  reason?: string
}

export interface ApprovalRequest {
  id: string
  amount: number
  provider: string
  toolName: string
  timestamp: number
  expiresAt: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
}

export interface SessionState {
  totalSpent: number
  transactions: TransactionRecord[]
  pendingApprovals: ApprovalRequest[]
}
