import React, { memo } from "react"

import { EntityMessagesTable } from "./EntityMessagesTable"
import { getIncomingMessages } from "@/services/messages-api"

type EntityMessagesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function BaseIncomingMessagesTable(props: EntityMessagesProps) {
  const { entityId, open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getIncomingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          entityId,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
export const IncomingMessagesTable = memo(BaseIncomingMessagesTable)
