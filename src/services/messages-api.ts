import { gql } from "urql"

import { AoMessage, TokenEvent } from "@/utils/ao-event-utils"

import {
  TransactionsResponse,
  parseNormalizedAoEvent,
  parseTokenEvent,
} from "@/utils/arweave-utils"

import { goldsky } from "./graphql-client"

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
`

const processIdentifier = `
  tags: [{ name: "From-Process", values: [$entityId] }]
`

const userIdentifier = `
  tags: [{ name: "SDK", values: ["aoconnect"] }]
  owners: [$entityId]
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

      ${isProcess ? processIdentifier : userIdentifier}
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
    const events = edges.map(parseNormalizedAoEvent)

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
    const events = edges.map(parseNormalizedAoEvent)

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
): Promise<[number | undefined, TokenEvent[]]> {
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

      ${
        isProcess
          ? `tags: [{ name: "From-Process", values: [$entityId]}, { name: "Type", values: ["Process"]}]`
          : `tags: [{ name: "SDK", values: ["aoconnect"]}, { name: "Type", values: ["Process"]}]
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
    const events = edges.map(parseNormalizedAoEvent)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

export async function getMessageById(id: string): Promise<AoMessage | undefined> {
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

  return parseNormalizedAoEvent(data.transactions.edges[0])
}

/**
 * WARN This query fails if both count and cursor are set
 */
const spawnedProcessesFromModuleQuery = (includeCount = false) => gql`
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

      tags: [{ name: "Module", values: [$moduleId]}, { name: "Type", values: ["Process"]}]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getSpawnedProcessesFromModule(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  moduleId: string,
): Promise<[number | undefined, AoMessage[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(spawnedProcessesFromModuleQuery(!cursor), {
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
    const events = edges.map(parseNormalizedAoEvent)

    return [count, events]
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
    const events = edges.map(parseNormalizedAoEvent)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}
