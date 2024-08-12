import { Stack, Tooltip } from "@mui/material"
import { Info } from "@phosphor-icons/react"
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
    { label: "Success", sx: { width: 20 } },
    { label: "From" },
    {
      label: "Data size",
      sx: { width: 160 },
      align: "right",
    },
    {
      label: "Arweave Block",
      sx: { width: 160 },
      align: "right",
    },
    {
      field: "ingestedAt" satisfies keyof AoMessage,
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
    { label: "", sx: { width: 20 } },
  ]

  return (
    <AsyncTable
      {...rest}
      // component={Paper}
      initialSortDir="desc"
      initialSortField="ingestedAt"
      headerCells={headerCells}
      renderRow={(item: AoMessage, index) => (
        <EvalMessagesTableRow key={item.id} item={item} expandedByDefault={index === 0} />
      )}
    />
  )
}
