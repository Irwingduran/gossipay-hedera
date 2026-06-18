import { ChatAnthropic } from '@langchain/anthropic'
import { MemorySaver } from '@langchain/langgraph'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { GossipayWallet } from '@gossipay/sdk'
import { createHederaClient } from './hedera'
import type { BaseMessage } from '@langchain/core/messages'

interface AgentInstance {
  agent: ReturnType<typeof createReactAgent>
  wallet: GossipayWallet
  config: { configurable: { thread_id: string } }
}

const agentStore = new Map<string, AgentInstance>()

function createAgentInstance(sessionId: string): AgentInstance {
  const client = createHederaClient()

  const wallet = new GossipayWallet({
    accountId: process.env.HEDERA_ACCOUNT_ID!,
    privateKey: process.env.HEDERA_PRIVATE_KEY!,
    network: process.env.HEDERA_NETWORK ?? 'testnet',
    policies: [
      { maxPerTransaction: 2, maxPerSession: 10, currency: 'HBAR' },
      {
        providers: [
          'api.coincap.io',
          'hermes.pyth.network',
          'gossipay.xyz',
        ],
      },
      { aboveAmount: 5, currency: 'HBAR', timeoutSeconds: 30 },
    ],
    auditTopicId: process.env.HEDERA_HCS_TOPIC_ID,
  })

  const llm = new ChatAnthropic({
    model: 'claude-sonnet-4-6',
    temperature: 0,
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const tools = wallet.getTools()
  const memory = new MemorySaver()

  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  })

  return {
    agent,
    wallet,
    config: { configurable: { thread_id: sessionId } },
  }
}

export function getOrCreateAgent(sessionId: string): AgentInstance {
  if (!agentStore.has(sessionId)) {
    agentStore.set(sessionId, createAgentInstance(sessionId))
  }
  return agentStore.get(sessionId)!
}

export function getSessionMessages(sessionId: string): BaseMessage[] {
  const instance = agentStore.get(sessionId)
  if (!instance) return []
  return []
}

export async function* streamAgentEvents(
  sessionId: string,
  message: string
): AsyncGenerator<{ event: string; data: unknown }> {
  const { agent, config } = getOrCreateAgent(sessionId)

  const eventStream = await agent.streamEvents(
    { messages: [{ role: 'user', content: message }] },
    { ...config, version: 'v2' }
  )

  for await (const event of eventStream) {
    if (event.event === 'on_chat_model_stream') {
      const content = event.data?.chunk?.content
      if (content && typeof content === 'string') {
        yield { event: 'token', data: { content } }
      }
    }

    if (event.event === 'on_tool_start') {
      yield {
        event: 'tool_start',
        data: {
          name: event.name ?? event.data?.name,
          input: event.data?.input,
        },
      }
    }

    if (event.event === 'on_tool_end') {
      yield {
        event: 'tool_end',
        data: {
          name: event.name ?? event.data?.name,
          output: event.data?.output,
        },
      }
    }

    if (event.event === 'on_chain_end' && event.name === 'LangGraph') {
      const messages = event.data?.output?.messages ?? []
      yield { event: 'done', data: { messages } }
    }
  }
}
