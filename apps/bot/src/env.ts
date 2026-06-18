import { resolve } from 'path'
process.loadEnvFile(resolve(process.cwd(), '../../.env'))

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} must be set in environment`)
  }
  return value
}

export const env = {
  hederaAccountId: requireEnv('HEDERA_ACCOUNT_ID'),
  hederaPrivateKey: requireEnv('HEDERA_PRIVATE_KEY'),
  hederaNetwork: process.env.HEDERA_NETWORK ?? 'testnet',

  llmProvider: process.env.LLM_PROVIDER ?? 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',

  hederaHcsTopicId: process.env.HEDERA_HCS_TOPIC_ID,

  telegramBotToken: requireEnv('TELEGRAM_BOT_TOKEN'),
}
