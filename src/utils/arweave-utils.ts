import { AoMessage, TokenTransferMessage } from "@/types"

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
  ingested_at?: number
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

export const systemTagNames = [
  "Type",
  "Data-Protocol",
  "SDK",
  "Content-Type",
  "Variant",
  "Pushed-For",
  "Ref_",
  "From-Module",
  "From-Process",
  "Module",
  "Scheduler",
  "aos-Version",
  "App-Name",
  "Scheduler",
  "Name",
]

export function parseAoMessage(edge: TransactionEdge): AoMessage {
  const { node, cursor } = edge

  const systemTags: Record<string, string> = {}
  const userTags: Record<string, string> = {}
  const tags: Record<string, string> = {}

  node.tags.forEach((tag) => {
    tags[tag.name] = tag.value

    if (systemTagNames.includes(tag.name)) {
      systemTags[tag.name] = tag.value
    } else {
      userTags[tag.name] = tag.value
    }
  })

  // delete systemTags["Pushed-For"]
  // delete systemTags["Data-Protocol"]
  delete systemTags["Type"]
  delete systemTags["Module"]
  delete systemTags["Name"]

  const type = tags["Type"] as AoMessage["type"]
  const blockHeight = node.block ? node.block.height : null
  const from = tags["Forwarded-For"] || tags["From-Process"] || node.owner.address
  const schedulerId = tags["Scheduler"]
  const action = tags["Action"]
  const createdTimestamp = node.block ? node.block.timestamp : node.ingested_at
  const created = createdTimestamp ? new Date(createdTimestamp * 1000) : null
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
    systemTags,
    userTags,
    cursor,
  }
}

export function parseTokenEvent(edge: TransactionEdge): TokenTransferMessage {
  const normalizedEvent = parseAoMessage(edge)

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
