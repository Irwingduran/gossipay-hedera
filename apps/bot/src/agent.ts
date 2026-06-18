import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'
import { MemorySaver } from '@langchain/langgraph'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { GossipayWallet } from '@gossipay/sdk'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { env } from './env'

function createLLM(): BaseChatModel {
  if (env.llmProvider === 'anthropic') {
    return new ChatAnthropic({
      model: env.anthropicModel,
      temperature: 0,
      apiKey: env.anthropicApiKey,
    })
  }
  return new ChatOpenAI({
    model: env.openaiModel,
    temperature: 0,
    apiKey: env.openaiApiKey,
  })
}

interface BotAgentInstance {
  agent: ReturnType<typeof createReactAgent>
  wallet: GossipayWallet
  config: { configurable: { thread_id: string } }
}

const agentStore = new Map<number, BotAgentInstance>()

export function getOrCreateAgent(chatId: number): BotAgentInstance {
  const existing = agentStore.get(chatId)
  if (existing) return existing

  const wallet = new GossipayWallet({
    accountId: env.hederaAccountId,
    privateKey: env.hederaPrivateKey,
    network: env.hederaNetwork,
    policies: [
      { maxPerTransaction: 2, maxPerSession: 10, currency: 'HBAR' },
      { providers: ['api.coincap.io', 'hermes.pyth.network', 'gossipay.xyz'] },
      { aboveAmount: 5, currency: 'HBAR', timeoutSeconds: 30 },
    ],
    auditTopicId: env.hederaHcsTopicId,
  })

  const llm = createLLM()
  const tools = wallet.getTools()
  const memory = new MemorySaver()

  const agent = createReactAgent({ llm, tools, checkpointSaver: memory })

  const instance: BotAgentInstance = {
    agent,
    wallet,
    config: { configurable: { thread_id: String(chatId) } },
  }
  agentStore.set(chatId, instance)
  return instance
}

export function resetAgent(chatId: number): void {
  agentStore.delete(chatId)
}
