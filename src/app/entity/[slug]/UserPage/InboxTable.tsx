import React, { useEffect, useState } from "react"

import { getInboxMessages } from "@/services/messages-api"
import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"

import { MessagesTable } from "./MessagesTable"

type InboxTableProps = {
  entityId: string
  open: boolean
}

export function InboxTable(props: InboxTableProps) {
  const { entityId, open } = props
  const [data, setData] = useState<NormalizedAoEvent[]>([])

  const pageSize = 1000

  useEffect(() => {
    getInboxMessages(pageSize, undefined, entityId).then((events) => {
      const parsed = events.map(normalizeAoEvent)
      setData(parsed)
    })
  }, [entityId])

  if (!open) return null

  return <MessagesTable data={data} />
}
