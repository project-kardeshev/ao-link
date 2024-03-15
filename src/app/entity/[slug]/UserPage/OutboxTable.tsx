import React, { useEffect, useState } from "react"

import { getOutboxMessages } from "@/services/messages-api"
import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"

import { MessagesTable } from "./MessagesTable"

type OutboxTableProps = {
  entityId: string
  open: boolean
}

export function OutboxTable(props: OutboxTableProps) {
  const { entityId, open } = props
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<NormalizedAoEvent[]>([])

  const pageSize = 1000

  useEffect(() => {
    setLoading(true)
    getOutboxMessages(pageSize, undefined, entityId)
      .then((events) => {
        const parsed = events.map(normalizeAoEvent)
        setData(parsed)
      })
      .finally(() => setLoading(false))
  }, [entityId])

  if (!open) return null

  return <MessagesTable data={data} loading={loading} />
}
