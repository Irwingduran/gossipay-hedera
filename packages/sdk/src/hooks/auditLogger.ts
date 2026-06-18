import { AbstractHook } from '@hashgraph/hedera-agent-kit'
import { Client, TopicMessageSubmitTransaction } from '@hashgraph/sdk'
import { getSession } from '../sessionStore'

export interface AuditLoggerConfig {
  topicId?: string
  client?: Client
  relevantTools?: string[]
}

export class HcsAuditLogger extends AbstractHook {
  name = 'HCS Audit Logger'
  description = 'Logs tool executions to Hedera Consensus Service'
  relevantTools: string[]

  private topicId: string | null
  private client: Client | null

  constructor(config: AuditLoggerConfig = {}) {
    super()
    this.relevantTools = config.relevantTools ?? [
      'transfer_hbar',
      'transfer_hbar_with_allowance',
      'transfer_fungible_token',
      'transfer_fungible_token_with_allowance',
    ]
    this.topicId = config.topicId ?? null
    this.client = config.client ?? null
  }

  setTopicId(id: string): void {
    this.topicId = id
  }

  setClient(client: Client): void {
    this.client = client
  }

  async postToolExecutionHook(params: any, method: string): Promise<void> {
    if (!this.relevantTools.includes(method)) return

    if (!this.topicId || !this.client) {
      return
    }

    const session = getSession()
    const lastTx = session.transactions[session.transactions.length - 1]

    const message = JSON.stringify({
      timestamp: new Date().toISOString(),
      action: method,
      amount: lastTx?.amount ?? 0,
      provider: lastTx?.provider ?? 'unknown',
      status: lastTx?.status ?? 'unknown',
      txHash: lastTx?.txHash ?? null,
      totalSpent: session.totalSpent,
      policyResults: lastTx?.policyResults ?? [],
    })

    try {
      const tx = await new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(message)
        .execute(this.client)

      await tx.getReceipt(this.client)
    } catch {
      // silently fail — audit logging should not break the main flow
    }
  }
}
