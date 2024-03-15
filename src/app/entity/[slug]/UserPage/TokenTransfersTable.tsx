import { TableRow, Tooltip, Typography } from "@mui/material"
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
        { label: "Type", sx: { width: 120 } },
        { label: "Action" },
        { label: "ID", sx: { width: 220 } },
        { label: "Sender", sx: { width: 220 } },
        { label: "Recipient", sx: { width: 220 } },
        {
          label: "Quantity",
          sx: { width: 160 },
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
            className="table-row cursor-pointer"
            key={item.id}
            onClick={() => {
              router.push(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
            }}
          >
            <td className="text-start p-2">
              <TypeBadge type={item.type} />
            </td>
            <td className="text-start p-2 ">{item.action}</td>
            <td className="text-start p-2 ">
              <IdBlock
                label={truncateId(item.id)}
                value={item.id}
                href={`/message/${item.id}`}
              />
            </td>
            <td className="text-start p-2 ">
              <IdBlock
                label={truncateId(item.sender)}
                value={item.sender}
                href={`/entity/${item.sender}`}
              />
            </td>
            <td className="text-start p-2 ">
              <IdBlock
                label={truncateId(item.recipient)}
                value={item.recipient}
                href={`/entity/${item.recipient}`}
              />
            </td>
            <td className="text-end p-2">
              <Typography
                fontFamily={MonoFontFF}
                component="div"
                variant="inherit"
                sx={{
                  color: item.amount > 0 ? "success.main" : "error.main",
                }}
              >
                <TokenAmountBlock amount={item.amount} tokenInfo={tokenInfo} />
              </Typography>
            </td>
            <td className="text-start p-2 ">
              <TokenBlock tokenId={tokenId} tokenInfo={tokenInfo} />
            </td>
            <td className="text-end p-2">
              <Tooltip title={formatFullDate(item.created)}>
                <span>{formatRelative(item.created)}</span>
              </Tooltip>
            </td>
          </TableRow>
        )
      }}
    />
  )
}
