import { Telegraf } from 'telegraf'
import { getOrCreateAgent, resetAgent } from './agent'
import { env } from './env'
import { AIMessage, HumanMessage } from '@langchain/core/messages'

const bot = new Telegraf(env.telegramBotToken)

bot.start((ctx) =>
  ctx.reply(
    '🤖 *Gossipay Agent* on Hedera\n\n' +
      'I can research data providers, execute payments, and audit transactions.\n\n' +
      '*Commands:*\n' +
      '/status — current session & policies\n' +
      '/reset — reset session\n\n' +
      'Just tell me what you need!',
    { parse_mode: 'Markdown' }
  )
)

bot.command('status', async (ctx) => {
  const msg =
    `*Gossipay Agent — Active*\n\n` +
    `💸 Spend Limit: 2 HBAR/tx, 10 HBAR/session\n` +
    `🔗 Allow List: api.coincap.io, hermes.pyth.network, gossipay.xyz\n` +
    `⚠️ Approval: >5 HBAR (30s timeout)\n\n` +
    `Use /reset to start a new session.`
  await ctx.reply(msg, { parse_mode: 'Markdown' })
})

bot.command('reset', async (ctx) => {
  resetAgent(ctx.chat.id)
  ctx.reply('Session reset. Starting fresh.')
})

const BOT_TYPING_INTERVAL = 4000

async function handleMessage(ctx: any) {
  const text = (ctx.message?.text ?? '').trim()
  if (!text || text.startsWith('/')) return

  const { agent, config } = getOrCreateAgent(ctx.chat.id)

  const typingTimer = setInterval(
    () => ctx.sendChatAction('typing').catch(() => {}),
    BOT_TYPING_INTERVAL
  )

  try {
    const finalResponse = await agent.invoke(
      { messages: [new HumanMessage(text)] },
      config
    )

    const lastMessage = finalResponse.messages[finalResponse.messages.length - 1]
    const content =
      lastMessage instanceof AIMessage && typeof lastMessage.content === 'string'
        ? lastMessage.content
        : 'Done.'

    await ctx.reply(content, { parse_mode: 'Markdown' })
  } catch (err) {
    console.error(`[chat:${ctx.chat.id}] agent error:`, err)
    await ctx
      .reply('Sorry, an error occurred. Try again or /reset.')
      .catch(() => {})
  } finally {
    clearInterval(typingTimer)
  }
}

bot.on('message', handleMessage)

async function main() {
  let offset = 0
  console.log('🤖 Gossipay Telegram bot running...')

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const updates = await bot.telegram.getUpdates(
        30,   // timeout (long poll seconds)
        100,  // limit
        offset,
        ['message']
      )
      for (const update of updates) {
        offset = update.update_id + 1
        bot.handleUpdate(update).catch((err) =>
          console.error('[bot] handle error:', err)
        )
      }
    } catch (err) {
      console.error('[bot] poll error:', err)
      await new Promise((r) => setTimeout(r, 5000))
    }
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
