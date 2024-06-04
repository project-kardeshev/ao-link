import { NormalizedAoEvent, TokenEvent } from "./ao-event-utils"

export type Tag = {
  name: string
  value: string
}

export type Owner = {
  address: string
  key?: string
}

export type Block = {
  id?: string
  timestamp: number
  height: number
  previous?: string
}

export type TransactionNode = {
  id: string
  anchor?: string
  ingested_at: number
  signature?: string
  recipient: string
  owner: Owner
  fee?: {
    winston: string
    ar: string
  }
  quantity?: {
    winston: string
    ar: string
  }
  data?: {
    size?: number
    type?: string
  }
  tags: Tag[]
  block: Block
  parent?: {
    id: string
  }
  bundledIn?: {
    id: string
  }
}

export type TransactionEdge = {
  cursor: string
  node: TransactionNode
}

export type TransactionsResponse = {
  transactions: {
    count: number | undefined
    edges: TransactionEdge[]
  }
}

export function parseNormalizedAoEvent(edge: TransactionEdge): NormalizedAoEvent {
  const { node, cursor } = edge

  const tags = node.tags.reduce((acc: Record<string, string>, tag: Tag) => {
    acc[tag.name] = tag.value
    return acc
  }, {})

  const type = tags["Type"] as NormalizedAoEvent["type"]
  const blockHeight = node.block ? node.block.height : 0
  const from = tags["Forwarded-For"] || tags["From-Process"] || node.owner.address
  const schedulerId = tags["Scheduler"]
  const action = tags["Action"]
  const created = new Date((node.block ? node.block.timestamp : node.ingested_at || 0) * 1000)
  const to = node.recipient.trim()

  return {
    id: node.id,
    type,
    from,
    to,
    blockHeight,
    schedulerId,
    created,
    action,
    tags,
    cursor,
  }
}

export function parseTokenEvent(edge: TransactionEdge): TokenEvent {
  const normalizedEvent = parseNormalizedAoEvent(edge)

  const { id, created, action, from, to, tags } = normalizedEvent as any // TODO

  let sender
  let recipient
  let tokenId
  let amount = 0

  if (action === "Debit-Notice") {
    amount = -Number(tags["Quantity"])
    sender = to
    recipient = tags["Recipient"]
    tokenId = from
  } else if (action === "Credit-Notice") {
    amount = Number(tags["Quantity"])
    sender = tags["Sender"]
    recipient = to
    tokenId = from
  } else if (action === "Transfer") {
    amount = -Number(tags["Quantity"])
    sender = from
    recipient = tags["Recipient"]
    tokenId = to
  } else {
    throw new Error(`Unknown action: ${action}`)
  }

  return {
    id,
    type: "Message",
    created,
    action,
    sender,
    recipient,
    amount,
    tokenId,
  }
}
