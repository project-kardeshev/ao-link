import React from "react"

import { TokenTransfersTable } from "./TokenTransfersTable"
import { getTokenTransfers } from "@/services/messages-api"

type TokenTransfersProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
}

function BaseTokenTransfers(props: TokenTransfersProps) {
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

export const TokenTransfers = React.memo(BaseTokenTransfers)
