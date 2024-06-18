import React from "react"

import { EvalMessagesTableRow } from "./EvalMessagesTableRow"
import { AsyncTable, AsyncTableProps, HeaderCell } from "@/components/AsyncTable"
import { AoMessage } from "@/types"

type EvalMessagesTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {}

export function EvalMessagesTable(props: EvalMessagesTableProps) {
  const { ...rest } = props

  const headerCells: HeaderCell[] = [
    {
      label: "Type",
      sx: { width: 140 },
    },
    { label: "ID", sx: { width: 240 } },
    { label: "Action" },
    { label: "From" },
    {
      field: "blockHeight",
      label: "Block Height",
      sx: { width: 160 },
      align: "right",
      sortable: true,
    },
    {
      label: "Created",
      sx: { width: 160 },
      align: "right",
    },
    { label: "", sx: { width: 20 } },
  ]

  return (
    <AsyncTable
      {...rest}
      // component={Paper}
      initialSortDir="desc"
      initialSortField="blockHeight"
      headerCells={headerCells}
      renderRow={(item: AoMessage, index) => (
        <EvalMessagesTableRow key={item.id} item={item} expandedByDefault={index === 0} />
      )}
    />
  )
}
