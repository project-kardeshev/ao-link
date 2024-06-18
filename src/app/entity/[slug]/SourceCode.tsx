import React from "react"

import { EvalMessagesTable } from "./EvalMessagesTable"
import { getEvalMessages } from "@/services/messages-api"

type EntityMessagesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function SourceCode(props: EntityMessagesProps) {
  const { entityId, open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EvalMessagesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getEvalMessages(
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
