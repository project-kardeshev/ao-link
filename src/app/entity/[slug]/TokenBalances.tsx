import { TableCell, TableRow } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { InMemoryTable } from "@/components/InMemoryTable"
import { RetryableBalance } from "@/components/RetryableBalance"
import { TokenBlock } from "@/components/TokenBlock"
import { getTokenTransfers } from "@/services/messages-api"
import { TokenInfo, TokenInfoMap, getTokenInfoMap } from "@/services/token-api"
import { normalizeTokenEvent } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"

type TokenBalancesProps = {
  entityId: string
  open: boolean
}

type TokenBalance = {
  tokenId: string
  tokenInfo: TokenInfo
}

export function TokenBalances(props: TokenBalancesProps) {
  const { entityId, open } = props
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>({})

  const pageSize = 1000

  useEffect(() => {
    getTokenTransfers(pageSize, undefined, entityId)
      .then((events) => {
        const parsed = events.map(normalizeTokenEvent)
        let uniqueTokenIds = new Set<string>()
        parsed.forEach((event) => {
          uniqueTokenIds.add(event.tokenId)
        })
        const tokenIds = Array.from(uniqueTokenIds)
        return getTokenInfoMap(tokenIds)
      })
      .then((tokenInfoMap) => {
        setTokenInfoMap(tokenInfoMap)
      })
  }, [entityId])

  const data: TokenBalance[] = useMemo(
    () =>
      Object.keys(tokenInfoMap).map((tokenId) => ({
        tokenId,
        tokenInfo: tokenInfoMap[tokenId],
      })),
    [tokenInfoMap],
  )

  if (!open) return null

  return (
    <>
      <InMemoryTable
        initialSortField="balance"
        initialSortDir="desc"
        data={data}
        headerCells={[
          { label: "Token name" },
          {
            field: "rank",
            label: "Balance",
            align: "right",
            sortable: true,
          },
          { label: "Ticker", sx: { width: 220 } },
        ]}
        renderRow={({ tokenInfo, tokenId }: TokenBalance) => (
          <TableRow key={tokenId}>
            <TableCell>
              <IdBlock
                label={tokenInfo?.name || truncateId(tokenId)}
                value={tokenId}
                href={`/token/${tokenId}`}
              />
            </TableCell>
            <TableCell align="right">
              <RetryableBalance entityId={entityId} tokenInfo={tokenInfo} />
            </TableCell>
            <TableCell align="right">
              <TokenBlock tokenId={tokenId} tokenInfo={tokenInfo} />
            </TableCell>
          </TableRow>
        )}
      />
    </>
  )
}
