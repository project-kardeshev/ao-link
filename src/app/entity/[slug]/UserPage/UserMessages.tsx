import React, { useEffect, useState } from "react"

import { getMessagesByEntityId as getMessagesByEntityId } from "@/services/messages-api"
import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"

import { EntityMessagesTable } from "./EntityMessagesTable"

type UserMessagesProps = {
  entityId: string
  open: boolean
}

export function UserMessages(props: UserMessagesProps) {
  const { entityId, open } = props
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<NormalizedAoEvent[]>([])

  const pageSize = 1000

  useEffect(() => {
    setLoading(true)
    getMessagesByEntityId(pageSize, undefined, entityId)
      .then((events) => {
        const parsed = events.map(normalizeAoEvent)
        setData(parsed)
      })
      .finally(() => setLoading(false))
  }, [entityId])

  if (!open) return null

  return (
    <EntityMessagesTable data={data} loading={loading} entityId={entityId} />
  )
}
