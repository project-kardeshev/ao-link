import React from "react"

import { getTokenTransfers } from "@/services/messages-api"

import { TokenTransfersTable } from "./TokenTransfersTable"

type TokenTransfersProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function TokenTransfers(props: TokenTransfersProps) {
  const { entityId, open, onCountReady } = props

  const pageSize = 25

  if (!open) return null

  return (
    <TokenTransfersTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getTokenTransfers(
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
