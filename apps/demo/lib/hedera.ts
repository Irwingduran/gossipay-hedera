import { Client } from "@hashgraph/sdk"

export function createHederaClient(): Client {
  const accountId = process.env.HEDERA_ACCOUNT_ID
  const privateKey = process.env.HEDERA_PRIVATE_KEY
  const network = process.env.HEDERA_NETWORK ?? "testnet"

  if (!accountId || !privateKey) {
    throw new Error(
      "HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set in environment"
    )
  }

  const client = Client.forName(network)
  client.setOperator(accountId, privateKey)

  return client
}
