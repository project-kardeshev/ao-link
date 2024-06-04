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
        initialSortField="balance"
        initialSortDir="desc"
        data={data}
        headerCells={[
          { label: "Rank", align: "center", sx: { width: 60 } },
          { label: "Entity" },
          {
            field: "rank",
            label: "Balance",
            align: "right",
            sortable: true,
            sx: { paddingRight: "36px" },
          },
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
              <TokenAmountBlock amount={tokenHolder.balance} tokenInfo={tokenInfo} />
            </TableCell>
          </TableRow>
        )}
      />
    </>
  )
}
