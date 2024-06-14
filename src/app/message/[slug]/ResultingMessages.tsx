import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getResultingMessages } from "@/services/messages-api"
import { AoMessage } from "@/types"

type Props = {
  message: AoMessage
  onCountReady?: (count: number) => void
  onDataReady?: (data: AoMessage[]) => void
}

function BaseResultingMessages(props: Props) {
  const { message, onCountReady, onDataReady } = props

  const pageSize = 25

  return (
    <EntityMessagesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        let [count, records] = await getResultingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          message?.tags["Pushed-For"] || message.id,
          message.to,
        )

        if (count !== undefined && onCountReady) {
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
