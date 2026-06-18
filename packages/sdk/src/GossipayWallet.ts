import { Client } from '@hashgraph/sdk'
import { HederaLangchainToolkit } from '@hashgraph/hedera-agent-kit-langchain'
import { AbstractHook } from '@hashgraph/hedera-agent-kit'
import type { GossipayWalletConfig, SpendLimitConfig, AllowListConfig, RequireApprovalConfig } from './types'
import { SpendLimitPolicy } from './policies/spendLimit'
import { AllowListPolicy } from './policies/allowList'
import { RequireApprovalPolicy } from './policies/requireApproval'
import { HcsAuditLogger } from './hooks/auditLogger'
import { resetSession } from './sessionStore'

export class GossipayWallet {
  private toolkit: HederaLangchainToolkit
  private client: Client
  private auditLogger: HcsAuditLogger
  private policies: {
    spendLimit: SpendLimitPolicy
    allowList: AllowListPolicy
    requireApproval: RequireApprovalPolicy
  }

  constructor(config: GossipayWalletConfig) {
    resetSession()

    this.client = Client.forName(config.network ?? 'testnet')
    this.client.setOperator(config.accountId, config.privateKey)

    const spendCfg = config.policies.find((p): p is SpendLimitConfig => 'maxPerTransaction' in p)!
    const allowCfg = config.policies.find((p): p is AllowListConfig => 'providers' in p)!
    const approvalCfg = config.policies.find((p): p is RequireApprovalConfig => 'aboveAmount' in p)!

    this.policies = {
      spendLimit: new SpendLimitPolicy(spendCfg),
      allowList: new AllowListPolicy(allowCfg),
      requireApproval: new RequireApprovalPolicy(approvalCfg),
    }

    this.auditLogger = new HcsAuditLogger({
      topicId: config.auditTopicId,
      client: this.client,
    })

    const hooks: AbstractHook[] = [
      this.policies.spendLimit,
      this.policies.allowList,
      this.policies.requireApproval,
    ]

    if (config.auditTopicId) {
      hooks.push(this.auditLogger)
    }

    this.toolkit = new HederaLangchainToolkit({
      client: this.client as any,
      configuration: {
        context: {
          hooks,
        },
      },
    })
  }

  getTools() {
    return this.toolkit.getTools() as any[]
  }

  getClient(): Client {
    return this.client
  }

  getPolicies() {
    return this.policies
  }

  getAuditLogger(): HcsAuditLogger {
    return this.auditLogger
  }
}
