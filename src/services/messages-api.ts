import { gql } from "urql"

import { goldsky } from "./graphql-client"
import { AoMessage, NetworkStat, TokenTransferMessage } from "@/types"

import { TransactionsResponse, parseAoMessage, parseTokenEvent } from "@/utils/arweave-utils"

import { isArweaveId } from "@/utils/utils"

// const AO_NETWORK_IDENTIFIER = '{ name: "SDK", values: ["aoconnect"] }'
// const AO_NETWORK_IDENTIFIER = '{ name: "Variant", values: ["ao.TN.1"] }'
const AO_NETWORK_IDENTIFIER = '{ name: "Data-Protocol", values: ["ao"] }'

// TODO
// { name: "owner_address", values: [$entityId] }
// { name: "target", values: [$entityId] }
// { name: "Forwarded-For", values: [$entityId] }
// { name: "Pushed-For", values: [$entityId] }

const messageFields = gql`
  fragment MessageFields on TransactionConnection {
    edges {
      cursor
      node {
        id
        recipient
        block {
          timestamp
          height
        }
        ingested_at
        tags {
          name
          value
        }
        data {
          size
        }
        owner {
          address
        }
      }
    }
  }
`

/**
 * WARN This query fails if both count and cursor are set
 */
const outgoingMessagesQuery = (includeCount = false, isProcess?: boolean) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      ${
        isProcess
          ? `tags: [{ name: "From-Process", values: [$entityId] }]`
          : `tags: [${AO_NETWORK_IDENTIFIER}]
             owners: [$entityId]`
      }
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getOutgoingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
  isProcess?: boolean,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(outgoingMessagesQuery(!cursor, isProcess), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const incomingMessagesQuery = (includeCount = false) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      recipients: [$entityId]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getIncomingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(incomingMessagesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

const tokenTransfersQuery = (includeCount = false) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: [{ name: "Action", values: ["Credit-Notice", "Debit-Notice"] }]
      recipients: [$entityId]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getTokenTransfers(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
): Promise<[number | undefined, TokenTransferMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(tokenTransfersQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseTokenEvent)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const spawnedProcessesQuery = (includeCount = false, isProcess?: boolean) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      ${
        isProcess
          ? `tags: [{ name: "From-Process", values: [$entityId]}, { name: "Type", values: ["Process"]}]`
          : `tags: [${AO_NETWORK_IDENTIFIER}, { name: "Type", values: ["Process"]}]
             owners: [$entityId]`
      }
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getSpawnedProcesses(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
  isProcess?: boolean,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(spawnedProcessesQuery(!cursor, isProcess), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

export async function getMessageById(id: string): Promise<AoMessage | undefined> {
  if (!isArweaveId(id)) {
    throw new Error("Invalid Arweave ID")
  }
  const { data, error } = await goldsky
    .query<TransactionsResponse>(
      gql`
        query ($id: ID!) {
          transactions(ids: [$id]) {
            ...MessageFields
          }
        }

        ${messageFields}
      `,
      { id },
    )
    .toPromise()

  if (error) throw new Error(error.message)

  if (!data) return
  if (!data.transactions.edges.length) return

  return parseAoMessage(data.transactions.edges[0])
}

/**
 * WARN This query fails if both count and cursor are set
 */
const processesQuery = (includeCount = false) => gql`
  query (
    $moduleId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: [{ name: "Module", values: [$moduleId]}, { name: "Type", values: ["Process"]}]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getProcesses(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  moduleId = "",
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(processesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        moduleId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const records = edges.map(parseAoMessage)

    return [count, records]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const modulesQuery = (includeCount = false) => gql`
  query (
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: [{ name: "Type", values: ["Module"]}]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getModules(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(modulesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const resultingMessagesQuery = (includeCount = false) => gql`
  query (
    $fromProcessId: String!
    $messageId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: [{ name: "Pushed-For", values: [$messageId] },{ name: "From-Process", values: [$fromProcessId] }]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`
export async function getResultingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  pushedFor: string,
  sender?: string,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(resultingMessagesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        messageId: pushedFor,
        fromProcessId: sender,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const linkedMessagesQuery = (includeCount = false) => gql`
  query (
    $messageId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: [{ name: "Pushed-For", values: [$messageId] }]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getLinkedMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  pushedFor: string,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(linkedMessagesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        messageId: pushedFor,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const messagesForBlockQuery = (includeCount = false) => gql`
  query (
    $blockHeight: Int
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      block: { min: $blockHeight, max: $blockHeight }
      tags: [${AO_NETWORK_IDENTIFIER}]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getMessagesForBlock(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  blockHeight?: number,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(messagesForBlockQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        blockHeight,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

const allMessagesQuery = gql`
  query ($limit: Int!, $sortOrder: SortOrder!, $cursor: String, $tags: [TagFilter!]) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: $tags
    ) {
      edges {
        cursor
        node {
          id
          recipient
          block {
            timestamp
            height
          }
          tags {
            name
            value
          }
          owner {
            address
          }
        }
      }
    }
  }
`

export async function getAllMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  extraFilters?: Record<string, string>,
): Promise<[number | undefined, AoMessage[]]> {
  const tags = [
    {
      // AO_NETWORK_IDENTIFIER
      name: "Data-Protocol",
      values: ["ao"],
    },
  ]

  if (extraFilters) {
    for (const [name, value] of Object.entries(extraFilters)) {
      tags.push({ name, values: [value] })
    }
  }

  try {
    const result = await goldsky
      .query<TransactionsResponse>(allMessagesQuery, {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        tags,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const evalMessagesQuery = (includeCount = false) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor
      block: { min: 1325101 }

      tags: [{ name: "Action", values: ["Eval"] }]
      recipients: [$entityId]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getEvalMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(evalMessagesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseAoMessage)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

const networkStatsQuery = gql`
  query {
    transactions(
      sort: HEIGHT_DESC
      first: 1
      owners: ["yqRGaljOLb2IvKkYVa87Wdcc8m_4w6FI58Gej05gorA"]
      recipients: ["vdpaKV_BQNISuDgtZpLDfDlMJinKHqM3d2NWd3bzeSk"]
      tags: [{ name: "Action", values: ["Update-Stats"] }]
    ) {
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getNetworkStats(): Promise<NetworkStat[]> {
  try {
    const result = await goldsky.query<TransactionsResponse>(networkStatsQuery, {}).toPromise()
    if (!result.data) return []

    const { edges } = result.data.transactions
    const updateId = edges[0]?.node.id

    const data = await fetch(`https://arweave.net/${updateId}`)
    const json = await data.json()

    return json as NetworkStat[]
  } catch (error) {
    console.error(error)
    return []
  }
}
