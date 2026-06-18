# gossipay

**Programmable economy for AI agents on Hedera**

Monorepo with a policy engine SDK and an interactive demo where autonomous agents execute transactions on the Hedera testnet with configurable guardrails, optional human approval, and immutable audit trail via HCS.

---

## Architecture

```
gossipay/
├── packages/
│   └── sdk/              @gossipay/sdk — policy engine, wallet, audit
└── apps/
    └── demo/             @gossipay/demo — Next.js 15 app with chat + UI
```

### Data flow

1. User sends a message in the chat
2. `useAgentStream` POSTs to `/api/agent` with the message and session ID
3. The backend creates/retrieves a LangChain agent with a `GossipayWallet`
4. The agent processes the message and invokes Hedera tools (transfers, balances, etc.)
5. Each tool call runs through the **3 policy hooks**: Spend Limit, Allow List, Require Approval
6. If a transaction requires human approval, the policy creates a `pending_approval` and blocks the tool
7. Events stream in real-time via **SSE**: tokens, tool_start, tool_end, transactions, pending_approvals
8. The user approves/rejects from the modal, calls `/api/approve`, and the agent retries
9. Each executed transaction is optionally logged to **Hedera Consensus Service**

---

## Features

### Policy Engine (3 configurable guardrails)

| Policy | Description |
|--------|-------------|
| **Spend Limit** | Limits amount per transaction and per session (HBAR) |
| **Allow List** | Only allows transfers to authorized providers |
| **Require Approval** | Transactions above a threshold require human approval |

- Policies are **hot-reloaded** from the UI without restarting the agent
- Synced to the server via `POST /api/policies` with 600ms debounce

### Real-Time Streaming

- The agent streams tokens, tool calls, and results via **Server-Sent Events**
- The UI updates without polling or websockets
- Supports cancellation via `AbortController`

### Immutable Audit (HCS)

- Every approved transaction is logged to a **Hedera Consensus Service** topic
- The log contains: timestamp, action, amount, provider, status, txHash, policy results
- Publicly visible on [Hashscan](https://hashscan.io/testnet/topic/{TOPIC_ID})

### Dual LLM

- Supports **OpenAI (GPT-4o)** and **Anthropic (Claude)**
- Configurable via `LLM_PROVIDER` environment variable

### Telegram Bot

- Production-ready Telegram bot at [@gossipay_bot](https://t.me/gossipay_bot)
- Each chat gets an isolated agent session with its own wallet, policies, and conversation history
- Commands: `/start`, `/status`, `/reset`, and free-form messages
- Built on Telegraf 4, reuses `@gossipay/sdk`

### Sample Data

- `/api/competitor-intel` — simulated competitive analysis (PayBot, CryptoAgent Pay, etc.)
- `/api/market-data` — simulated LatAm market data (Brazil, Mexico, Colombia, Argentina, Chile)

---

## Requirements

- **Node.js** >= 20
- **pnpm** 9.15+
- A **Hedera testnet** account (account ID + private key)
- API key for **OpenAI** or **Anthropic**

---

## Installation

```bash
pnpm install
```

## Configuration

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Hedera testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_NETWORK=testnet

# LLM
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# HCS Audit Trail (optional)
HEDERA_HCS_TOPIC_ID=0.0.xxxxx
NEXT_PUBLIC_HCS_TOPIC_ID=0.0.xxxxx

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To run only the Telegram bot:

```bash
pnpm --filter @gossipay/bot dev
```

## Tests

```bash
cd packages/sdk
pnpm test          # Vitest — unit tests for policies and engine
```

---

## Project Structure

```
apps/demo/
├── app/
│   ├── layout.tsx              # Root layout (Google Fonts + SessionProvider)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + custom scrollbar
│   ├── demo/
│   │   └── page.tsx            # Split-pane demo UI
│   └── api/
│       ├── agent/route.ts      # POST — SSE streaming agent
│       ├── approve/route.ts    # POST — resolves approval (approved/rejected)
│       ├── policies/route.ts   # POST — hot-reload policies
│       ├── competitor-intel/route.ts  # GET — simulated competitive data
│       └── market-data/route.ts       # GET — LatAm market data
├── components/
│   ├── AgentChat.tsx           # Chat interface with streaming
│   ├── ApprovalModal.tsx       # Human approval modal
│   ├── AuditTrail.tsx          # Transaction summary + Hashscan link
│   ├── PolicyPanel.tsx         # Editable policy controls
│   ├── TransactionCard.tsx     # Individual transaction card
│   └── TransactionFeed.tsx     # Chronological transaction list
└── lib/
    ├── agent.ts                # LangChain agent orchestrator
    ├── hedera.ts               # Hedera Client factory
    ├── store.tsx               # Global state (React Context + useReducer)
    └── hooks/
        └── useAgentStream.ts   # SSE hook + AbortController

apps/bot/
└── src/
    ├── index.ts                # Telegraf polling loop
    ├── agent.ts                # Agent per chat_id
    └── env.ts                  # Environment validation

packages/sdk/src/
├── types.ts                    # TypeScript interfaces
├── index.ts                    # Barrel exports
├── GossipayWallet.ts           # Wallet class (Hedera + policies + tools)
├── sessionStore.ts             # In-memory session state (server-side)
├── policies/
│   ├── engine.ts               # Policy evaluation engine
│   ├── spendLimit.ts           # Per-tx and per-session limits
│   ├── allowList.ts            # Provider allow list
│   ├── requireApproval.ts      # Human approval for high amounts
│   └── __tests__/              # Unit tests (Vitest)
└── hooks/
    └── auditLogger.ts          # HCS Audit Trail hook
```

---

## API Routes

### `POST /api/agent`

SSE streaming endpoint for the LangChain agent.

**Request:**
```json
{ "message": "Send 1 HBAR to api.coincap.io", "sessionId": "abc-123" }
```

**SSE Events:**
| Event | Description |
|-------|-------------|
| `session_start` | `{ sessionId }` |
| `token` | `{ content: "..." }` — LLM tokens |
| `tool_start` | `{ name, input }` — tool started |
| `tool_end` | `{ name, output }` — tool finished |
| `transaction` | `TransactionRecord` — new transaction |
| `pending_approval` | `ApprovalRequest` — human approval required |
| `done` | Final agent message |
| `error` | Server error |

### `POST /api/approve`

Approves or rejects a pending transaction.

**Request:**
```json
{ "approvalId": "a1b2c3d4", "action": "approved" }
```

### `POST /api/policies`

Hot-reloads agent policies.

**Request:**
```json
{
  "sessionId": "abc-123",
  "policies": [
    { "maxPerTransaction": 5, "maxPerSession": 20, "currency": "HBAR" },
    { "providers": ["api.coincap.io", "gossipay.xyz"] },
    { "aboveAmount": 10, "currency": "HBAR", "timeoutSeconds": 60 }
  ]
}
```

---

## Policy System

Each policy extends `AbstractPolicy` from the Hedera Agent Kit and implements `shouldBlockPostParamsNormalization`. They are injected as `AbstractHook[]` into the toolkit context, intercepting **all** transfer tool calls.

### Spend Limit

```typescript
interface SpendLimitConfig {
  maxPerTransaction: number    // Max HBAR per transaction
  maxPerSession: number        // Max HBAR for the entire session
  currency: 'HBAR'
}
```

- Blocks if `amount > maxPerTransaction`
- Blocks if `totalSpent + amount > maxPerSession`
- Supports tinybars (values >= 10,000,000 are divided by 10^8)

### Allow List

```typescript
interface AllowListConfig {
  providers: string[]          // Allowed domains or IDs
}
```

- Recipient extracted from `normalisedParams.recipients[0]` or `recipient` or `to`
- Case-insensitive matching via `includes()`
- No match → blocked

### Require Approval

```typescript
interface RequireApprovalConfig {
  aboveAmount: number          // Threshold in HBAR
  currency: 'HBAR'
  timeoutSeconds: number       // Expiration time
}
```

- If `amount <= aboveAmount` → allow
- Otherwise, creates an approval with ID = SHA-256(amount:recipient:method:timestamp)[:16]
- Waits in `pending` state until the user approves/rejects
- Expires after `timeoutSeconds`

---

## SDK Package (`@gossipay/sdk`)

### GossipayWallet

```typescript
const wallet = new GossipayWallet({
  accountId: '0.0.xxxxx',
  privateKey: '302e...',
  network: 'testnet',
  policies: [
    { maxPerTransaction: 2, maxPerSession: 10, currency: 'HBAR' },
    { providers: ['api.coincap.io'] },
    { aboveAmount: 5, currency: 'HBAR', timeoutSeconds: 30 },
  ],
  auditTopicId: '0.0.xxxxx',
})

const tools = wallet.getTools()        // LangChain tools
wallet.updatePolicies(newConfigs)      // hot-reload policies
```

### Session Store

```typescript
import { getSession, resetSession, addTransaction, resolveApproval } from '@gossipay/sdk'

getSession()                    // { totalSpent, transactions, pendingApprovals }
resetSession()                  // clears everything
addTransaction(record)          // adds + updates totalSpent
resolveApproval(id, status)     // "approved" | "rejected"
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (Turbopack) |
| UI | React 19 + Tailwind CSS 3 |
| Language | TypeScript 5.6 (strict) |
| Monorepo | pnpm workspaces + Turbo 2 |
| Blockchain | Hedera testnet (@hashgraph/sdk) |
| Agent | LangChain / LangGraph |
| LLM | OpenAI GPT-4o / Anthropic Claude |
| Streaming | Server-Sent Events |
| Audit Trail | Hedera Consensus Service |
| Telegram Bot | Telegraf 4 |
| Testing | Vitest |

---

## License

MIT
