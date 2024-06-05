import React from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getAllMessages } from "@/services/messages-api"

type EntityMessagesProps = {
  open: boolean
  onCountReady?: (count: number) => void
}

export function AllMessagesTable(props: EntityMessagesProps) {
  const { open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getAllMessages(pageSize, lastRecord?.cursor, ascending)

        if (count && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
