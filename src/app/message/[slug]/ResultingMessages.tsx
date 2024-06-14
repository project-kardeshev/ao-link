import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getResultingMessages } from "@/services/messages-api"
import { AoMessage } from "@/types"

type Props = {
  pushedFor?: string
  messageId: string
  open: boolean
  onCountReady?: (count: number) => void
  onDataReady?: (data: AoMessage[]) => void
}

function BaseResultingMessages(props: Props) {
  const { pushedFor, messageId, open, onCountReady, onDataReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        let [count, records] = await getResultingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          pushedFor || messageId,
        )

        // if (pushedFor) {
        //   records = records.filter((msg) => msg.id !== messageId)
        //   if (count) count = count - 1
        // }

        if (count && onCountReady) {
          onCountReady(count)
        }

        if (onDataReady) {
          onDataReady(records)
        }

        return records
      }}
    />
  )
}

// TODO FIXME
export const ResultingMessages = memo(BaseResultingMessages)
