import { TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

import { IdBlock } from "@/components/IdBlock"
import { InMemoryTable } from "@/components/InMemoryTable"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { TokenBlock } from "@/components/TokenBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { TokenInfo, TokenInfoMap } from "@/services/token-api"
import { TokenEvent } from "@/utils/ao-event-utils"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { nativeTokenInfo } from "@/utils/native-token"

type TokenTransfersTableProps = {
  data: TokenEvent[]
  tokenInfoMap: TokenInfoMap
}

export function TokenTransfersTable(props: TokenTransfersTableProps) {
  const { data, tokenInfoMap } = props
  const router = useRouter()

  return (
    <InMemoryTable
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        { label: "Action" },
        { label: "ID", sx: { width: 220 } },
        { label: "From", sx: { width: 220 } },
        { label: "To", sx: { width: 220 } },
        {
          label: "Quantity",
          align: "right",
        },
        { label: "Token", sx: { width: 220 } },
        {
          field: "created",
          label: "Created",
          sx: { width: 160 },
          align: "right",
        },
      ]}
      initialSortDir="desc"
      initialSortField="created"
      data={data}
      renderRow={(item: TokenEvent) => {
        const { tokenId } = item
        let tokenInfo: TokenInfo | undefined

        if (tokenId === nativeTokenInfo.processId) {
          tokenInfo = nativeTokenInfo
        } else {
          tokenInfo = tokenInfoMap[tokenId]
        }

        return (
          <TableRow
            sx={{ cursor: "pointer" }}
            key={item.id}
            onClick={() => {
              router.push(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
            }}
          >
            <TableCell>
              <TypeBadge type={item.type} />
            </TableCell>
            <TableCell>{item.action}</TableCell>
            <TableCell>
              <IdBlock
                label={truncateId(item.id)}
                value={item.id}
                href={`/message/${item.id}`}
              />
            </TableCell>
            <TableCell>
              <IdBlock
                label={truncateId(item.sender)}
                value={item.sender}
                href={`/entity/${item.sender}`}
              />
            </TableCell>
            <TableCell>
              <IdBlock
                label={truncateId(item.recipient)}
                value={item.recipient}
                href={`/entity/${item.recipient}`}
              />
            </TableCell>
            <TableCell align="right">
              <Typography
                fontFamily={MonoFontFF}
                component="div"
                variant="inherit"
                sx={{
                  color: item.amount > 0 ? "success.main" : "error.main",
                }}
              >
                <TokenAmountBlock
                  amount={item.amount}
                  tokenInfo={tokenInfo}
                  needsParsing
                />
              </Typography>
            </TableCell>
            <TableCell>
              <TokenBlock tokenId={tokenId} tokenInfo={tokenInfo} />
            </TableCell>
            <TableCell align="right">
              <Tooltip title={formatFullDate(item.created)}>
                <span>{formatRelative(item.created)}</span>
              </Tooltip>
            </TableCell>
          </TableRow>
        )
      }}
    />
  )
}
