# gossipay

**Programmable economy para AI agents sobre Hedera**

Monorepo con un SDK de policy engine y una demo interactiva donde agentes autónomos pueden ejecutar transacciones en la testnet de Hedera con guardrails configurables, aprobación humana opcional y auditoría inmutable via HCS.

---

## Arquitectura

```
gossipay/
├── packages/
│   └── sdk/              @gossipay/sdk — policy engine, wallet, auditoría
└── apps/
    └── demo/             @gossipay/demo — Next.js 15 app con chat + UI
```

### Flujo de datos

1. El usuario envía un mensaje en el chat
2. `useAgentStream` POSTea a `/api/agent` con el mensaje y session ID
3. El backend crea/recupera un agente LangChain con un `GossipayWallet`
4. El agente procesa el mensaje e invoca herramientas de Hedera (transfers, balances, etc.)
5. Cada tool call atraviesa los **3 policy hooks**: Spend Limit, Allow List, Require Approval
6. Si una transacción requiere aprobación humana, el policy crea un `pending_approval` y bloquea la tool
7. Los eventos viajan en tiempo real via **SSE**: tokens, tool_start, tool_end, transactions, pending_approvals
8. El usuario aprueba/rechaza desde el modal, se llama a `/api/approve`, y el agente reintenta
9. Cada transacción ejecutada se registra opcionalmente en **Hedera Consensus Service**

---

## Features

### Policy Engine (3 guardrails configurables)

| Policy | Descripción |
|--------|-------------|
| **Spend Limit** | Limita monto por transacción y por sesión (HBAR) |
| **Allow List** | Solo permite transfers a providers autorizados |
| **Require Approval** | Transacciones sobre un umbral requieren aprobación humana |

- Los policies se actualizan **en caliente** desde la UI sin reiniciar el agente
- Se sincronizan al servidor via `POST /api/policies` con debounce de 600ms

### Streaming en Tiempo Real

- El agente transmite tokens, tool calls y resultados via **Server-Sent Events**
- La UI se actualiza sin polling ni websockets
- Soporta cancelación vía `AbortController`

### Auditoría Inmutable (HCS)

- Cada transacción aprobada se registra en un topic de **Hedera Consensus Service**
- El log contiene: timestamp, acción, monto, provider, estado, txHash, policy results
- Visible públicamente en [Hashscan](https://hashscan.io/testnet/topic/{TOPIC_ID})

### Dual LLM

- Soporta **OpenAI (GPT-4o)** y **Anthropic (Claude)**
- Configurable via `LLM_PROVIDER` en environment

### Datos de Ejemplo

- `/api/competitor-intel` — análisis competitivo simulado (PayBot, CryptoAgent Pay, etc.)
- `/api/market-data` — datos de mercado LatAm (Brasil, México, Colombia, Argentina, Chile)

---

## Requisitos

- **Node.js** >= 20
- **pnpm** 9.15+
- Una cuenta en **Hedera testnet** (account ID + private key)
- API key de **OpenAI** o **Anthropic**

---

## Instalación

```bash
pnpm install
```

## Configuración

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Hedera testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_NETWORK=testnet

# LLM
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# HCS Audit Trail (opcional)
HEDERA_HCS_TOPIC_ID=0.0.xxxxx
NEXT_PUBLIC_HCS_TOPIC_ID=0.0.xxxxx
```

## Desarrollo

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000). El turbo.json ya tiene `dotEnv` configurado para cargar `.env` desde la raíz del monorepo.

## Tests

```bash
cd packages/sdk
pnpm test          # Vitest — tests unitarios de policies y engine
```

---

## Estructura del Proyecto

```
apps/demo/
├── app/
│   ├── layout.tsx              # Root layout (Google Fonts + SessionProvider)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + scrollbar personalizado
│   ├── demo/
│   │   └── page.tsx            # Split-pane demo UI
│   └── api/
│       ├── agent/route.ts      # POST — SSE streaming del agente
│       ├── approve/route.ts    # POST — resuelve approval (approved/rejected)
│       ├── policies/route.ts   # POST — actualiza policies en caliente
│       ├── competitor-intel/route.ts  # GET — datos competitivos simulados
│       └── market-data/route.ts       # GET — datos de mercado LatAm
├── components/
│   ├── AgentChat.tsx           # Chat interface con streaming
│   ├── ApprovalModal.tsx       # Modal de aprobación humana
│   ├── AuditTrail.tsx          # Resumen de transacciones + link Hashscan
│   ├── PolicyPanel.tsx         # Controles editables de policies
│   ├── TransactionCard.tsx     # Card individual de transacción
│   └── TransactionFeed.tsx     # Lista cronológica de transacciones
└── lib/
    ├── agent.ts                # Orchestrador del agente LangChain
    ├── hedera.ts               # Factory de Hedera Client
    ├── store.tsx               # Estado global (React Context + useReducer)
    └── hooks/
        └── useAgentStream.ts   # Hook de SSE + AbortController

packages/sdk/src/
├── types.ts                    # Interfaces TypeScript
├── index.ts                    # Barrel exports
├── GossipayWallet.ts           # Wallet class (Hedera + policies + tools)
├── sessionStore.ts             # Session state in-memory (server-side)
├── policies/
│   ├── engine.ts               # Policy evaluation engine
│   ├── spendLimit.ts           # Límite por tx y por sesión
│   ├── allowList.ts            # Lista blanca de providers
│   ├── requireApproval.ts      # Aprobación humana para montos altos
│   └── __tests__/              # Tests unitarios (Vitest)
└── hooks/
    └── auditLogger.ts          # HCS Audit Trail hook
```

---

## API Routes

### `POST /api/agent`

Streaming SSE del agente LangChain.

**Request:**
```json
{ "message": "Send 1 HBAR to api.coincap.io", "sessionId": "abc-123" }
```

**SSE Events:**
| Evento | Descripción |
|--------|-------------|
| `session_start` | `{ sessionId }` |
| `token` | `{ content: "..." }` — tokens del LLM |
| `tool_start` | `{ name, input }` — tool comenzó |
| `tool_end` | `{ name, output }` — tool terminó |
| `transaction` | `TransactionRecord` — nueva transacción |
| `pending_approval` | `ApprovalRequest` — requiere aprobación humana |
| `done` | Mensaje final del agente |
| `error` | Error del servidor |

### `POST /api/approve`

Aprueba o rechaza una transacción pendiente.

**Request:**
```json
{ "approvalId": "a1b2c3d4", "action": "approved" }
```

### `POST /api/policies`

Actualiza los policies del agente en caliente.

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

Cada policy extiende `AbstractPolicy` del Hedera Agent Kit e implementa `shouldBlockPostParamsNormalization`. Se inyectan como `AbstractHook[]` en el contexto del toolkit, interceptando **todas** las tool calls de transferencias.

### Spend Limit

```typescript
interface SpendLimitConfig {
  maxPerTransaction: number    // HBAR máximos por transacción
  maxPerSession: number        // HBAR máximos en toda la sesión
  currency: 'HBAR'
}
```

- Bloquea si `amount > maxPerTransaction`
- Bloquea si `totalSpent + amount > maxPerSession`
- Soporta tinybars (valores >= 10,000,000 se dividen por 10^8)

### Allow List

```typescript
interface AllowListConfig {
  providers: string[]          // dominios o IDs permitidos
}
```

- El recipient se extrae de `normalisedParams.recipients[0]` o `recipient` o `to`
- Matching case-insensitive via `includes()`
- Si no hay match → blocked

### Require Approval

```typescript
interface RequireApprovalConfig {
  aboveAmount: number          // umbral en HBAR
  currency: 'HBAR'
  timeoutSeconds: number       // tiempo para expirar
}
```

- Si `amount <= aboveAmount` → allow
- Si no, crea un approval con ID = SHA-256(amount:recipient:method:timestamp)[:16]
- Espera en estado `pending` hasta que el usuario apruebe/rechace
- Expira después de `timeoutSeconds`

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
resetSession()                  // limpia todo
addTransaction(record)          // agrega + actualiza totalSpent
resolveApproval(id, status)     // "approved" | "rejected"
```

---

## Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (Turbopack) |
| UI | React 19 + Tailwind CSS 3 |
| Lenguaje | TypeScript 5.6 (strict) |
| Monorepo | pnpm workspaces + Turbo 2 |
| Blockchain | Hedera testnet (@hashgraph/sdk) |
| Agent | LangChain / LangGraph |
| LLM | OpenAI GPT-4o / Anthropic Claude |
| Streaming | Server-Sent Events |
| Audit Trail | Hedera Consensus Service |
| Testing | Vitest |

---

## Licencia

MIT — construido para el Hedera AI Studio Challenge 2026.
