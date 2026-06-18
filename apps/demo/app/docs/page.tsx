import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'gossipay — SDK documentation',
  description:
    'Technical reference for the gossipay SDK: quickstart, API reference, policy engine, and more.',
}

const sections = [
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'wallet', label: 'GossipayWallet' },
  { id: 'session', label: 'Session Store' },
  { id: 'policies', label: 'Policy Engine' },
  { id: 'spend-limit', label: 'Spend Limit Policy' },
  { id: 'allow-list', label: 'Allow List Policy' },
  { id: 'approval', label: 'Require Approval Policy' },
  { id: 'api', label: 'API Routes' },
  { id: 'telegram-bot', label: 'Telegram Bot' },
  { id: 'hcs', label: 'HCS Audit Trail' },
  { id: 'structure', label: 'Project Structure' },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-lg tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors">
              gossipay
            </Link>
            <span className="text-[10px] text-neutral-300 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5">
              docs
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
              Demo
            </Link>
            <a
              href="https://github.com/Irwingduran/gossipay-hedera"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 flex gap-12">
        {/* Sidebar */}
        <nav className="hidden lg:block w-56 shrink-0 pt-12">
          <div className="sticky top-20 space-y-1">
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-3">
              Contents
            </p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-xs text-neutral-500 hover:text-neutral-800 py-1 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 pt-12 pb-24 min-w-0">
          <h1 className="font-serif text-4xl text-neutral-900">SDK documentation</h1>
          <p className="mt-3 text-neutral-500 max-w-2xl">
            Technical reference for <code className="text-neutral-800 bg-neutral-100 px-1.5 rounded text-sm">@gossipay/sdk</code>.
            Open-source. TypeScript. Built on the Hedera Agent Kit.
          </p>

          {/* ───── 1. Quickstart ───── */}
          <Section id="quickstart" title="Quickstart">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="border border-neutral-200 rounded-xl p-5">
                <h4 className="text-xs font-semibold text-neutral-900 mb-2">1. Install</h4>
                <pre className="text-xs font-mono text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 overflow-x-auto"><code>pnpm install</code></pre>
                <p className="mt-2 text-[11px] text-neutral-400">Monorepo with pnpm workspaces + Turborepo</p>
              </div>
              <div className="border border-neutral-200 rounded-xl p-5">
                <h4 className="text-xs font-semibold text-neutral-900 mb-2">2. Configure</h4>
                <pre className="text-xs font-mono text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 overflow-x-auto"><code>cp .env.example .env</code></pre>
                <p className="mt-2 text-[11px] text-neutral-400">Set HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY, and LLM_API_KEY</p>
              </div>
              <div className="border border-neutral-200 rounded-xl p-5">
                <h4 className="text-xs font-semibold text-neutral-900 mb-2">3. Run</h4>
                <pre className="text-xs font-mono text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 overflow-x-auto"><code>pnpm dev</code></pre>
                <p className="mt-2 text-[11px] text-neutral-400">Starts Next.js dev server on localhost:3000</p>
              </div>
            </div>
          </Section>

          {/* ───── 2. GossipayWallet ───── */}
          <Section id="wallet" title="GossipayWallet">
            <p className="text-sm text-neutral-500">
              Creates a Hedera wallet with policy hooks injected into the Agent Kit toolkit.
              Each wallet has its own client, policies, and optional HCS audit logger.
            </p>
            <CodeBlock label="Constructor" code={`import { GossipayWallet } from '@gossipay/sdk'\n\nconst wallet = new GossipayWallet({\n  accountId: '0.0.xxxxx',\n  privateKey: '302e...',\n  network: 'testnet',\n  policies: [\n    { maxPerTransaction: 2, maxPerSession: 10, currency: 'HBAR' },\n    { providers: ['api.coincap.io', 'gossipay.xyz'] },\n    { aboveAmount: 5, currency: 'HBAR', timeoutSeconds: 30 },\n  ],\n  auditTopicId: '0.0.xxxxx',\n})`} />
            <h4 className="text-sm font-semibold text-neutral-900 mt-6 mb-3">Methods</h4>
            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              <MethodRow name="wallet.getTools()" returns="LangChainTool[]" desc="Returns tool instances for the LangChain agent" />
              <MethodRow name="wallet.getClient()" returns="Client" desc="Returns the Hedera client instance" />
              <MethodRow name="wallet.updatePolicies(configs)" returns="void" desc="Hot-reloads policies without restarting the agent" />
              <MethodRow name="wallet.getAuditLogger()" returns="HcsAuditLogger" desc="Returns the HCS audit logger instance" />
            </div>
            <TypeDef
              title="GossipayWalletConfig"
              code={`interface GossipayWalletConfig {\n  accountId: string\n  privateKey: string\n  network?: string           // default: 'testnet'\n  policies: PolicyConfig[]\n  auditTopicId?: string\n}`}
            />
          </Section>

          {/* ───── 3. Session Store ───── */}
          <Section id="session" title="Session Store">
            <p className="text-sm text-neutral-500">
              In-memory singleton that tracks <code className="text-neutral-800 bg-neutral-100 px-1 rounded">totalSpent</code>, <code className="text-neutral-800 bg-neutral-100 px-1 rounded">transactions</code>, and <code className="text-neutral-800 bg-neutral-100 px-1 rounded">pendingApprovals</code> per session. Server-side only.
            </p>
            <CodeBlock label="Usage" code={`import { getSession, addTransaction, resolveApproval } from '@gossipay/sdk'\n\nconst session = getSession()\n// { totalSpent: 0, transactions: [], pendingApprovals: [] }\n\naddTransaction({\n  amount: 1.5,\n  provider: 'api.coincap.io',\n  status: 'approved',\n  toolName: 'transferHbars',\n  policyResults: [],\n})\n\nresolveApproval('a1b2c3d4', 'approved')`} />
            <h4 className="text-sm font-semibold text-neutral-900 mt-6 mb-3">Functions</h4>
            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              <MethodRow name="getSession()" returns="SessionState" desc="Returns current session state" />
              <MethodRow name="resetSession()" returns="void" desc="Clears all session data" />
              <MethodRow name="addTransaction(record)" returns="void" desc="Adds a transaction and updates totalSpent" />
              <MethodRow name="addPendingApproval(request)" returns="void" desc="Adds a pending approval request" />
              <MethodRow name="resolveApproval(id, status)" returns="void" desc="Updates an approval to approved/rejected" />
              <MethodRow name="getPendingApproval(id)" returns="ApprovalRequest | undefined" desc="Finds an approval by ID" />
            </div>
          </Section>

          {/* ───── 4. Policy Engine ───── */}
          <Section id="policies" title="Policy Engine">
            <p className="text-sm text-neutral-500">
              Policies extend <code className="text-neutral-800 bg-neutral-100 px-1 rounded">AbstractPolicy</code> from the Hedera Agent Kit and implement <code className="text-neutral-800 bg-neutral-100 px-1 rounded">shouldBlockPostParamsNormalization</code>. They run as hooks before every tool call — if any policy returns <code className="text-neutral-800 bg-neutral-100 px-1 rounded">true</code>, the transaction is blocked.
            </p>
            <CodeBlock label="Policy evaluation flow" code={`toolCall(params, method)\n  ├─ SpendLimitPolicy.shouldBlock(params, method)\n  │   └─ true/false\n  ├─ AllowListPolicy.shouldBlock(params, method)\n  │   └─ true/false\n  ├─ RequireApprovalPolicy.shouldBlock(params, method)\n  │   └─ true/false  (or creates pending approval)\n  │\n  └─ ALL pass → transaction executes on Hedera\n     └─ HcsAuditLogger.postToolExecutionHook()`} />
          </Section>

          {/* ───── 5. Spend Limit ───── */}
          <Section id="spend-limit" title="Spend Limit Policy">
            <p className="text-sm text-neutral-500">
              Limits HBAR spend per transaction and per session. Prevents runaway agent spending.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-neutral-200 rounded-xl p-4">
                <p className="text-[10px] font-medium text-neutral-400 mb-1">Config interface</p>
                <pre className="text-xs font-mono text-neutral-600 leading-relaxed"><code>{`interface SpendLimitConfig {\n  maxPerTransaction: number\n  maxPerSession: number\n  currency: 'HBAR'\n}`}</code></pre>
              </div>
              <div className="border border-neutral-200 rounded-xl p-4">
                <p className="text-[10px] font-medium text-neutral-400 mb-1">Behavior</p>
                <ul className="space-y-1 text-xs text-neutral-500">
                  <li>• Blocks if amount &gt; maxPerTransaction</li>
                  <li>• Blocks if totalSpent + amount &gt; maxPerSession</li>
                  <li>• Supports tinybar conversion (values &gt;= 10M &divide; 10&sup8;)</li>
                  <li>• Applies to hbar, fungible token, and NFT transfers</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* ───── 6. Allow List ───── */}
          <Section id="allow-list" title="Allow List Policy">
            <p className="text-sm text-neutral-500">
              Restricts which providers/recipients the agent can transfer funds to.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-neutral-200 rounded-xl p-4">
                <p className="text-[10px] font-medium text-neutral-400 mb-1">Config interface</p>
                <pre className="text-xs font-mono text-neutral-600 leading-relaxed"><code>{`interface AllowListConfig {\n  providers: string[]\n}`}</code></pre>
              </div>
              <div className="border border-neutral-200 rounded-xl p-4">
                <p className="text-[10px] font-medium text-neutral-400 mb-1">Behavior</p>
                <ul className="space-y-1 text-xs text-neutral-500">
                  <li>• Extracts recipient from normalized params</li>
                  <li>• Case-insensitive substring match</li>
                  <li>• Blocks if no provider matches</li>
                  <li>• Applies to hbar and fungible token transfers</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* ───── 7. Require Approval ───── */}
          <Section id="approval" title="Require Approval Policy">
            <p className="text-sm text-neutral-500">
              Pauses high-value transactions for human approval before execution.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-neutral-200 rounded-xl p-4">
                <p className="text-[10px] font-medium text-neutral-400 mb-1">Config interface</p>
                <pre className="text-xs font-mono text-neutral-600 leading-relaxed"><code>{`interface RequireApprovalConfig {\n  aboveAmount: number\n  currency: 'HBAR'\n  timeoutSeconds: number\n}`}</code></pre>
              </div>
              <div className="border border-neutral-200 rounded-xl p-4">
                <p className="text-[10px] font-medium text-neutral-400 mb-1">Behavior</p>
                <ul className="space-y-1 text-xs text-neutral-500">
                  <li>• Allows if amount &lt;= aboveAmount</li>
                  <li>• Creates pending approval with SHA-256 ID</li>
                  <li>• Expires after timeoutSeconds</li>
                  <li>• Waits for human approve/reject via API</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* ───── 8. API Routes ───── */}
          <Section id="api" title="API Routes">
            <p className="text-sm text-neutral-500">
              The demo app exposes five API routes under <code className="text-neutral-800 bg-neutral-100 px-1 rounded">/api/</code>.
            </p>
            <div className="space-y-3">
              <ApiRoute method="POST" path="/api/agent" desc="SSE streaming endpoint. Accepts { message, sessionId }. Streams tokens, transactions, and pending approvals." />
              <ApiRoute method="POST" path="/api/approve" desc="Resolves a pending approval. Accepts { approvalId, action: 'approved' | 'rejected' }." />
              <ApiRoute method="POST" path="/api/policies" desc="Hot-reloads agent policies. Accepts { sessionId, policies: PolicyConfig[] }." />
              <ApiRoute method="GET" path="/api/competitor-intel" desc="Simulated competitive analysis data (4 competitors with strengths/weaknesses)." />
              <ApiRoute method="GET" path="/api/market-data" desc="Simulated LatAm market data (5 countries with GDP, inflation, adoption metrics)." />
            </div>

            <h4 className="text-sm font-semibold text-neutral-900 mt-8 mb-3">SSE event reference</h4>
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="text-left px-4 py-2 font-medium text-neutral-500">Event</th>
                    <th className="text-left px-4 py-2 font-medium text-neutral-500">Payload</th>
                    <th className="text-left px-4 py-2 font-medium text-neutral-500">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">session_start</td><td className="px-4 py-2 text-neutral-500">{'{ sessionId }'}</td><td className="px-4 py-2 text-neutral-500">New session created</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">token</td><td className="px-4 py-2 text-neutral-500">{'{ content }'}</td><td className="px-4 py-2 text-neutral-500">LLM streaming token</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">tool_start</td><td className="px-4 py-2 text-neutral-500">{'{ name, input }'}</td><td className="px-4 py-2 text-neutral-500">Tool execution started</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">tool_end</td><td className="px-4 py-2 text-neutral-500">{'{ name, output }'}</td><td className="px-4 py-2 text-neutral-500">Tool execution finished</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">transaction</td><td className="px-4 py-2 text-neutral-500">TransactionRecord</td><td className="px-4 py-2 text-neutral-500">A transaction was processed</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">pending_approval</td><td className="px-4 py-2 text-neutral-500">ApprovalRequest</td><td className="px-4 py-2 text-neutral-500">Human approval required</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">done</td><td className="px-4 py-2 text-neutral-500">{'{ messages }'}</td><td className="px-4 py-2 text-neutral-500">Agent finished processing</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-neutral-800">error</td><td className="px-4 py-2 text-neutral-500">{'{ message }'}</td><td className="px-4 py-2 text-neutral-500">Server error occurred</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* ───── 9. Telegram Bot ───── */}
          <Section id="telegram-bot" title="Telegram Bot">
            <p className="text-sm text-neutral-500">
              gossipay ships with a Telegram bot at{' '}
              <a href="https://t.me/gossipay_bot" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline underline-offset-2">@gossipay_bot</a>.
              Each Telegram chat gets its own isolated agent session with the same wallet, policies,
              and audit trail as the web demo — accessible from your phone.
            </p>

            <h4 className="text-sm font-semibold text-neutral-900 mt-6 mb-3">Architecture</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <CodeBlock label="Bot file structure" code={`gossipay/\n└── apps/bot/\n    ├── package.json      # @gossipay/bot\n    ├── tsconfig.json\n    └── src/\n        ├── index.ts      # Telegraf polling loop\n        ├── agent.ts      # Agent per chat_id\n        └── env.ts        # Env validation`} />
              <CodeBlock label="Agent per chat" code={`// Each chat_id gets its own MemorySaver agent\nconst agentStore = new Map<number, BotAgentInstance>()\n\nexport function getOrCreateAgent(chatId: number) {\n  if (agentStore.has(chatId)) {\n    return agentStore.get(chatId)!\n  }\n  // Create new wallet + agent\n  const wallet = new GossipayWallet({ ... })\n  const agent = createReactAgent({\n    llm, tools: wallet.getTools(),\n    checkpointSaver: new MemorySaver(),\n  })\n  agentStore.set(chatId, { agent, wallet })\n}`} />
            </div>

            <h4 className="text-sm font-semibold text-neutral-900 mt-6 mb-3">Commands</h4>
            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              <MethodRow name="/start" returns="—" desc="Shows welcome message with command list" />
              <MethodRow name="/status" returns="—" desc="Displays current session policies (spend limits, allow list, approval threshold)" />
              <MethodRow name="/reset" returns="—" desc="Clears agent session and conversation history" />
              <MethodRow name="any text" returns="—" desc="Sends the message to the LangGraph agent; response is rendered in Markdown" />
            </div>

            <h4 className="text-sm font-semibold text-neutral-900 mt-6 mb-3">Run locally</h4>
            <CodeBlock label="Start the bot" code={'# Add your token to .env\nTELEGRAM_BOT_TOKEN=your_bot_token_here\n\n# Start with hot reload\npnpm --filter @gossipay/bot dev\n\n# Or without watch\npnpm --filter @gossipay/bot exec tsx src/index.ts'} />
            <p className="mt-4 text-sm text-neutral-500">
              The bot uses manual long-polling via <code className="text-neutral-800 bg-neutral-100 px-1 rounded">bot.telegram.getUpdates()</code>.
              It reuses <code className="text-neutral-800 bg-neutral-100 px-1 rounded">@gossipay/sdk</code> — the same wallet, policies, and hooks as the web demo.
              No webhook configuration required.
            </p>
          </Section>

          {/* ───── 10. HCS Audit Trail ───── */}
          <Section id="hcs" title="HCS Audit Trail">
            <p className="text-sm text-neutral-500">
              Every approved transaction is logged to a Hedera Consensus Service topic. Immutable. Verifiable on Hashscan.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <CodeBlock label="Environment setup" code={`HEDERA_HCS_TOPIC_ID=0.0.xxxxx      # server-side: agent writes logs\nNEXT_PUBLIC_HCS_TOPIC_ID=0.0.xxxxx # client-side: Hashscan link in UI`} />
              <CodeBlock label="Log structure (JSON)" code={`{\n  "timestamp": 1718000000000,\n  "action": "transfer",\n  "amount": 1.5,\n  "provider": "api.coincap.io",\n  "status": "approved",\n  "txHash": "0xabc...",\n  "totalSpent": 3.0,\n  "policyResults": [\n    { "policyName": "SpendLimit", "allowed": true },\n    { "policyName": "AllowList", "allowed": true }\n  ]\n}`} />
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              The <code className="text-neutral-800 bg-neutral-100 px-1 rounded">HcsAuditLogger</code> extends <code className="text-neutral-800 bg-neutral-100 px-1 rounded">AbstractHook</code> and runs <code className="text-neutral-800 bg-neutral-100 px-1 rounded">postToolExecutionHook</code> after every transfer tool. It submits the log to the HCS topic via <code className="text-neutral-800 bg-neutral-100 px-1 rounded">TopicMessageSubmitTransaction</code>.
            </p>
          </Section>

          {/* ───── 11. Project Structure ───── */}
          <Section id="structure" title="Project Structure">
            <CodeBlock label="Monorepo layout" code={`gossipay/\n├── packages/sdk/src/         # @gossipay/sdk\n│   ├── index.ts              # Barrel exports\n│   ├── types.ts              # TypeScript interfaces\n│   ├── GossipayWallet.ts     # Main wallet class\n│   ├── sessionStore.ts       # In-memory session state\n│   ├── policies/\n│   │   ├── engine.ts         # Policy evaluation engine\n│   │   ├── spendLimit.ts     # Per-tx & per-session limits\n│   │   ├── allowList.ts      # Provider allow list\n│   │   ├── requireApproval.ts # Human approval flow\n│   │   └── __tests__/        # Unit tests (Vitest)\n│   └── hooks/\n│       └── auditLogger.ts    # HCS audit log hook\n├── apps/\n│   ├── demo/                # Next.js 15 demo app\n│   │   ├── app/             # Pages + API routes\n│   │   ├── components/      # 7 React components\n│   │   └── lib/             # Agent + state\n│   └── bot/                 # Telegram bot\n│       └── src/\n│           ├── index.ts     # Telegraf polling loop\n│           ├── agent.ts     # Agent per chat_id\n│           └── env.ts       # Env validation`} />
          </Section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-neutral-400">
          <p>gossipay &mdash; MIT License</p>
          <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  )
}

/* ───── Helpers ───── */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <h2 className="font-serif text-2xl text-neutral-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white mt-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 bg-neutral-50">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        <span className="text-[10px] text-neutral-400 font-mono">typescript</span>
      </div>
      <pre className="p-4 text-xs font-mono text-neutral-700 leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MethodRow({ name, returns, desc }: { name: string; returns: string; desc: string }) {
  return (
    <div className="px-4 py-2.5 flex items-start gap-4 text-xs">
      <span className="font-mono text-neutral-800 font-medium shrink-0 min-w-[200px]">{name}</span>
      <span className="text-[10px] text-neutral-400 font-mono shrink-0 min-w-[120px]">{returns}</span>
      <span className="text-neutral-500">{desc}</span>
    </div>
  )
}

function TypeDef({ title, code }: { title: string; code: string }) {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden mt-4">
      <div className="px-4 py-2 border-b border-neutral-100 bg-neutral-50">
        <span className="text-xs font-medium text-neutral-500">{title}</span>
      </div>
      <pre className="p-4 text-xs font-mono text-neutral-600 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ApiRoute({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colorMap: Record<string, string> = {
    GET: 'text-green-600 bg-green-50 border-green-100',
    POST: 'text-blue-600 bg-blue-50 border-blue-100',
  }
  return (
    <div className="flex items-start gap-4 border border-neutral-100 rounded-lg px-4 py-3">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 mt-0.5 ${colorMap[method] ?? ''}`}>
        {method}
      </span>
      <div>
        <code className="text-xs font-mono text-neutral-800">{path}</code>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
