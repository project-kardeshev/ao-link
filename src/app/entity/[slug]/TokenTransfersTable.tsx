import { Paper, Stack, Tooltip } from "@mui/material"
import { Info } from "@phosphor-icons/react"
import React from "react"

import { TokenTransfersTableRow } from "./TokenTransfersTableRow"
import { AsyncTable, AsyncTableProps } from "@/components/AsyncTable"
import { TokenTransferMessage } from "@/types"

type TokenTransfersTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  entityId: string
}

export function TokenTransfersTable(props: TokenTransfersTableProps) {
  const { entityId, ...rest } = props

  return (
    <AsyncTable
      {...rest}
      component={Paper}
      initialSortDir="desc"
      initialSortField="ingestedAt"
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        // {
        //   label: "Action",
        //   sortable: true,
        //   field: "action",
        // },
        {
          label: "ID",
          sx: { width: 240 },

          sortable: true,
          field: "id",
        },
        {
          label: "From",
          sx: { width: 240 },
          sortable: true,
          field: "sender",
        },
        { label: "", sx: { width: 60 } },
        { label: "To", sx: { width: 240 }, sortable: true, field: "recipient" },
        {
          label: "Quantity",
          align: "right",
          sortable: true,
          field: "amount",
        },
        {
          label: "Token",
          sortable: true,
          field: "tokenId",
          sx: { width: 240 },
        },
        {
          field: "ingestedAt" satisfies keyof TokenTransferMessage,
          label: (
            <Stack direction="row" gap={0.5} alignItems="center">
              Seen at
              <Tooltip title="Time when the message was seen by the Arweave network (ingested_at).">
                <Info width={16} height={16} />
              </Tooltip>
            </Stack>
          ),
          sx: { width: 160 },
          align: "right",
          sortable: true,
        },
      ]}
      renderRow={(item: TokenTransferMessage) => (
        <TokenTransfersTableRow key={item.id} item={item} entityId={entityId} />
      )}
    />
  )
}
