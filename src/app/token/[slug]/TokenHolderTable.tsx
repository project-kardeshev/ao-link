import { TableCell, TableRow, Typography } from "@mui/material"
import React from "react"

import { EntityBlock } from "@/components/EntityBlock"
import { InMemoryTable } from "@/components/InMemoryTable"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { TokenHolder, TokenInfo } from "@/services/token-api"

type TokenHolderTableProps = {
  data: TokenHolder[]
  tokenInfo: TokenInfo
}

export function TokenHolderTable(props: TokenHolderTableProps) {
  const { data, tokenInfo } = props

  return (
    <>
      <InMemoryTable
        data={data}
        headerCells={[
          { label: "Rank", align: "center", sx: { width: 60 } },
          { label: "Entity" },
          { label: "Balance", align: "right" },
        ]}
        renderRow={(tokenHolder) => (
          <TableRow key={tokenHolder.entityId}>
            <TableCell align="center">
              <Typography fontFamily={MonoFontFF} variant="inherit">
                {tokenHolder.rank}
              </Typography>
            </TableCell>
            <TableCell>
              <EntityBlock entityId={tokenHolder.entityId} />
            </TableCell>
            <TableCell align="right">
              <TokenAmountBlock
                amount={tokenHolder.balance}
                tokenInfo={tokenInfo}
              />
            </TableCell>
          </TableRow>
        )}
      />
    </>
  )
}
