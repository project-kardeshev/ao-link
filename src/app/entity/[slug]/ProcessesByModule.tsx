import React from "react"

import { ProcessesTable } from "./ProcessesTable"
import { getProcesses } from "@/services/messages-api"

type ProcessesByModuleProps = {
  moduleId: string
  open: boolean
  onCountReady?: (count: number) => void
}

function BaseProcessesByModule(props: ProcessesByModuleProps) {
  const { moduleId, open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <ProcessesTable
      hideModuleColumn
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getProcesses(
          pageSize,
          lastRecord?.cursor,
          ascending,
          moduleId,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}

export const ProcessesByModule = React.memo(BaseProcessesByModule)
