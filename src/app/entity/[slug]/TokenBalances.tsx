import { Paper } from "@mui/material"
import { useEffect, useState } from "react"

import { InMemoryTable } from "@/components/InMemoryTable"
import { getTokenTransfers } from "@/services/messages-api"

import { TokenBalancesTableRow } from "./TokenBalancesTableRow"

type TokenBalancesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function TokenBalances(props: TokenBalancesProps) {
  const { entityId, open, onCountReady } = props

  const [data, setData] = useState<string[]>([])

  useEffect(() => {
    if (!open || data.length > 0) return

    getTokenTransfers(1000, undefined, false, entityId).then(
      ([_count, transfers]) => {
        let uniqueTokenIds = new Set<string>()
        transfers.forEach((x) => {
          uniqueTokenIds.add(x.tokenId)
        })
        const tokenIds = Array.from(uniqueTokenIds)
        setData(tokenIds)

        if (tokenIds.length !== undefined && onCountReady) {
          onCountReady(tokenIds.length)
        }
      },
    )
  }, [data.length, entityId, onCountReady, open])

  if (!open) return null

  return (
    <Paper>
      <InMemoryTable
        initialSortField="tokenId"
        initialSortDir="asc"
        data={data}
        headerCells={[
          { field: "tokenId", label: "Token name" },
          { label: "Balance", align: "right" },
          { label: "Ticker", sx: { width: 220 } },
        ]}
        renderRow={(tokenId) => (
          <TokenBalancesTableRow
            key={tokenId}
            tokenId={tokenId}
            entityId={entityId}
          />
        )}
      />
    </Paper>
  )
}
