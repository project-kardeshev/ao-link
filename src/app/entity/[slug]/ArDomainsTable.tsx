import { Paper, Stack, TableCell, TableRow, Tooltip } from "@mui/material"
import { Info } from "@phosphor-icons/react"
import React, { memo } from "react"

import { useNavigate } from "react-router-dom"

import { AsyncTable, AsyncTableProps, HeaderCell } from "@/components/AsyncTable"
import { EntityBlock } from "@/components/EntityBlock"
import { IdBlock } from "@/components/IdBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { AoMessage } from "@/types"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type ArDomainsTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  hideModuleColumn?: boolean
}

function BaseArDomainsTable(props: ArDomainsTableProps) {
  const { hideModuleColumn, ...rest } = props
  const navigate = useNavigate()

  const headerCells: HeaderCell[] = [
    { label: "Type", sx: { width: 140 } },
    { label: "ID", sx: { width: 240 } },
    { label: "Action" },
    { label: "Name" },
    { label: "From", sx: { width: 240 } },
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
  ]

  if (hideModuleColumn) {
    headerCells.splice(3, 1)
  }

  return (
    <AsyncTable
      {...rest}
      component={Paper}
      initialSortDir="desc"
      initialSortField="ingestedAt"
      headerCells={headerCells}
      renderRow={(item: AoMessage) => (
        <TableRow
          sx={{ cursor: "pointer" }}
          key={item.id}
          onClick={() => {
            navigate(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
          }}
        >
          <TableCell>
            <TypeBadge type={item.type} />
          </TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} href={`/entity/${item.id}`} />
          </TableCell>
          <TableCell>{item.tags["Action"]}</TableCell>
          <TableCell>{item.tags["Name"]}</TableCell>
          <TableCell>
            <EntityBlock entityId={item.from} />
          </TableCell>
          <TableCell align="right">
            {item.blockHeight === null ? (
              "Processing"
            ) : (
              <IdBlock
                label={formatNumber(item.blockHeight)}
                value={String(item.blockHeight)}
                href={`/block/${item.blockHeight}`}
              />
            )}
          </TableCell>
          <TableCell align="right">
            {item.ingestedAt === null ? (
              "Processing"
            ) : (
              <Tooltip title={formatFullDate(item.ingestedAt)}>
                <span>{formatRelative(item.ingestedAt)}</span>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
      )}
    />
  )
}

export const ArDomainsTable = memo(BaseArDomainsTable)
