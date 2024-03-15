import { TableCell, TableRow } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { InMemoryTable } from "@/components/InMemoryTable"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { TokenBlock } from "@/components/TokenBlock"
import { getTokenTransfers } from "@/services/messages-api"
import {
  TokenBalanceMap,
  TokenInfo,
  TokenInfoMap,
  getTokenBalanceMap,
  getTokenInfoMap,
} from "@/services/token-api"
import { normalizeTokenEvent } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"

type TokenBalancesProps = {
  entityId: string
  open: boolean
}

type TokenBalance = {
  tokenId: string
  balance: number | null
  tokenInfo: TokenInfo
}

export function TokenBalances(props: TokenBalancesProps) {
  const { entityId, open } = props
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>({})
  const [tokenBalanceMap, setTokenBalanceMap] = useState<TokenBalanceMap>({})

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
        return Promise.all([
          getTokenInfoMap(tokenIds),
          getTokenBalanceMap(tokenIds, entityId),
        ])
      })
      .then(([tokenInfoMap, tokenBalanceMap]) => {
        setTokenInfoMap(tokenInfoMap)
        setTokenBalanceMap(tokenBalanceMap)
      })
  }, [entityId])

  const data: TokenBalance[] = useMemo(
    () =>
      Object.keys(tokenBalanceMap).map((tokenId) => ({
        tokenId,
        balance: tokenBalanceMap[tokenId],
        tokenInfo: tokenInfoMap[tokenId],
      })),
    [tokenBalanceMap, tokenInfoMap],
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
            sx: { paddingRight: "36px" },
          },
          { label: "Ticker", sx: { width: 220 } },
        ]}
        renderRow={({ tokenInfo, balance, tokenId }: TokenBalance) => (
          <TableRow key={tokenId}>
            <TableCell>
              <IdBlock
                label={tokenInfo?.name || truncateId(tokenId)}
                value={tokenId}
                href={`/token/${tokenId}`}
              />
            </TableCell>
            <TableCell align="right">
              <TokenAmountBlock
                amount={balance || 0}
                tokenInfo={tokenInfo}
                needsParsing
              />
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
