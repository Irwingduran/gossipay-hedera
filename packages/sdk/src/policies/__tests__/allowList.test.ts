import { describe, it, expect } from 'vitest'
import { AllowListPolicy } from '../allowList'

function mockParams(recipient: string): any {
  return {
    normalisedParams: { recipients: [recipient] },
    rawParams: { recipients: [recipient] },
    context: {},
    client: {},
  }
}

describe('AllowListPolicy', () => {
  it('allows a provider on the allow list', async () => {
    const policy = new AllowListPolicy({
      providers: [
        'api.coincap.io',
        'hermes.pyth.network',
        'gossipay.xyz',
      ],
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams('api.coincap.io'),
      'transfer_hbar'
    )
    expect(result).toBe(false)
  })

  it('blocks a provider not on the allow list', async () => {
    const policy = new AllowListPolicy({
      providers: ['api.coincap.io'],
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams('malicious-site.com'),
      'transfer_hbar'
    )
    expect(result).toBe(true)
  })

  it('is case-insensitive when matching', async () => {
    const policy = new AllowListPolicy({
      providers: ['Api.CoinCap.IO'],
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams('api.coincap.io'),
      'transfer_hbar'
    )
    expect(result).toBe(false)
  })

  it('does not block irrelevant tools', async () => {
    const policy = new AllowListPolicy({
      providers: ['api.coincap.io'],
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      { normalisedParams: {}, rawParams: {}, context: {}, client: {} },
      'create_account'
    )
    expect(result).toBe(false)
  })
})
