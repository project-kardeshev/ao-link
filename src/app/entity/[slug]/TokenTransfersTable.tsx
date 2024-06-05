import { Paper } from "@mui/material"
import React from "react"

import { AsyncTable, AsyncTableProps } from "@/components/AsyncTable"
import { TokenTransferMessage } from "@/types"

import { TokenTransfersTableRow } from "./TokenTransfersTableRow"

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
      initialSortField="created"
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        // {
        //   label: "Action",
        //   sortable: true,
        //   field: "action",
        // },
        {
          label: "ID",
          sx: { width: 220 },

          sortable: true,
          field: "id",
        },
        {
          label: "From",
          sx: { width: 220 },
          sortable: true,
          field: "sender",
        },
        { label: "", sx: { width: 60 } },
        { label: "To", sx: { width: 220 }, sortable: true, field: "recipient" },
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
          sx: { width: 220 },
        },
        {
          field: "created",
          label: "Created",
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
