import React from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getResultingMessages } from "@/services/messages-api"

type EntityMessagesProps = {
  entityId: string
  messageId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function ResultingMessages(props: EntityMessagesProps) {
  const { messageId, entityId, open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getResultingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          messageId,
        )

        if (count && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
