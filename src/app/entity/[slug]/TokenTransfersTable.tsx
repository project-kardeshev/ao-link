import React from "react"

import { InMemoryTable } from "@/components/InMemoryTable"
import { TokenEvent } from "@/utils/ao-event-utils"

import { TokenTransfersTableRow } from "./TokenTransfersTableRow"

type TokenTransfersTableProps = {
  data: TokenEvent[]
}

export function TokenTransfersTable(props: TokenTransfersTableProps) {
  const { data } = props

  return (
    <InMemoryTable
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        {
          label: "Action",
          sortable: true,
          field: "action",
        },
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
      initialSortDir="desc"
      initialSortField="created"
      data={data}
      renderRow={(item: TokenEvent) => (
        <TokenTransfersTableRow key={item.id} item={item} />
      )}
    />
  )
}
