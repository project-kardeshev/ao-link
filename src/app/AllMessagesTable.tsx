import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getAllMessages } from "@/services/messages-api"

type EntityMessagesProps = {
  open: boolean
  onCountReady?: (count: number) => void
}

function BaseAllMessagesTable(props: EntityMessagesProps) {
  const { open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      allowTypeFilter
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord, extraFilters) => {
        const [count, records] = await getAllMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          extraFilters,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}

export const AllMessagesTable = memo(BaseAllMessagesTable)
