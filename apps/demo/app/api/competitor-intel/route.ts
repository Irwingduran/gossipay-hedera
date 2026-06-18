import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const competitors = [
  {
    name: 'PayBot',
    category: 'AI Payment Gateway',
    description:
      'Automated payment processing for AI agents using traditional card networks.',
    funding: '$4.2M seed',
    strengths: ['Fast onboarding', 'Global coverage'],
    weaknesses: ['High fees (2.9% + $0.30)', 'No on-chain audit trail'],
  },
  {
    name: 'CryptoAgent Pay',
    category: 'Crypto Wallet for Agents',
    description:
      'Multi-chain wallet SDK for AI agents with basic spending controls.',
    funding: '$8M Series A',
    strengths: ['Multi-chain support', 'Self-custodial'],
    weaknesses: [
      'No policy engine',
      'Limited to EVM chains',
      'No Hedera integration',
    ],
  },
  {
    name: 'AgentWallet SDk',
    category: 'Agent Wallet Framework',
    description:
      'Open-source framework for giving wallets to AI agents.',
    funding: 'Bootstrapped',
    strengths: ['Open source', 'Customizable'],
    weaknesses: [
      'Requires significant engineering',
      'No built-in audit trail',
    ],
  },
  {
    name: 'HyperPay',
    category: 'Embedded Payments',
    description:
      'Embedded payment infrastructure for platforms building agent experiences.',
    funding: '$25M Series B',
    strengths: ['Enterprise-grade', 'Compliance ready'],
    weaknesses: [
      'No autonomous agent support',
      'Traditional webhook-based approvals',
    ],
  },
]

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    source: 'Gossipay Competitor Intelligence (simulated)',
    competitors,
    summary: {
      gapAnalysis:
        'No competitor combines Hedera-native payments, programmable policies, and on-chain HCS audit trails for autonomous AI agents.',
      gossipayAdvantage: [
        'Native Hedera integration (fast, low-cost, eco-friendly)',
        'Policy engine with 3 configurable guardrails',
        'HCS-based immutable audit trail',
        'Built for autonomous agents (no human-in-loop for low-value txns)',
      ],
    },
  })
}
