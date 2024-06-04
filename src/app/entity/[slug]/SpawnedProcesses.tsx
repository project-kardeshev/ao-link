import { Paper, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

import { AsyncTable } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { getSpawnedProcesses } from "@/services/messages-api"
import { NormalizedAoEvent } from "@/utils/ao-event-utils"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type SpawnedProcessesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
  isProcess?: boolean
}

export function SpawnedProcesses(props: SpawnedProcessesProps) {
  const { entityId, open, onCountReady, isProcess } = props
  const router = useRouter()

  if (!open) return null

  const pageSize = 25

  return (
    <AsyncTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getSpawnedProcesses(
          pageSize,
          lastRecord?.cursor,
          ascending,
          entityId,
          isProcess,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
      component={Paper}
      initialSortDir="desc"
      initialSortField="created"
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        { label: "Name" },
        { label: "ID" },
        { label: "Module" },
        {
          label: "Block Height",
          sx: { width: 160 },
          align: "right",
        },
        {
          field: "created",
          label: "Created",
          sx: { width: 160 },
          align: "right",
          sortable: true,
        },
      ]}
      renderRow={(item: NormalizedAoEvent) => (
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
          <TableCell>{item.tags["Name"]}</TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} href={`/entity/${item.id}`} />
          </TableCell>
          <TableCell>
            <IdBlock
              label={truncateId(item.tags["Module"])}
              value={item.tags["Module"]}
              href={`/module/${item.tags["Module"]}`}
            />
          </TableCell>
          <TableCell align="right">
            <Typography fontFamily={MonoFontFF} component="div" variant="inherit">
              <IdBlock
                label={formatNumber(item.blockHeight)}
                value={String(item.blockHeight)}
                href={`/block/${item.blockHeight}`}
              />
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Tooltip title={formatFullDate(item.created)}>
              <span>{formatRelative(item.created)}</span>
            </Tooltip>
          </TableCell>
        </TableRow>
      )}
    />
  )
}
