import type { PolicyConfig, PolicyResult } from '../types'
import { SpendLimitPolicy } from './spendLimit'
import { AllowListPolicy } from './allowList'
import { RequireApprovalPolicy } from './requireApproval'
import { addTransaction, addPendingApproval, resolveApproval } from '../sessionStore'

type PolicyInstance = SpendLimitPolicy | AllowListPolicy | RequireApprovalPolicy

export class PolicyEngine {
  private policies: PolicyInstance[] = []

  constructor(configs: PolicyConfig[]) {
    for (const cfg of configs) {
      if ('maxPerTransaction' in cfg) {
        this.policies.push(new SpendLimitPolicy(cfg))
      } else if ('providers' in cfg) {
        this.policies.push(new AllowListPolicy(cfg))
      } else if ('aboveAmount' in cfg) {
        this.policies.push(new RequireApprovalPolicy(cfg))
      }
    }
  }

  async evaluate(params: any, method: string): Promise<PolicyResult[]> {
    const results: PolicyResult[] = []
    for (const policy of this.policies) {
      const blocked = await policy.shouldBlockPostParamsNormalization(params, method)
      results.push({
        policyName: policy.name,
        allowed: !blocked,
        reason: blocked ? `Blocked by ${policy.name}` : undefined,
      })
    }
    return results
  }

  getPolicies(): PolicyInstance[] {
    return this.policies
  }
}
