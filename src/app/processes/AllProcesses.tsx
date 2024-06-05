"use client"

import React from "react"

import { getProcesses } from "@/services/messages-api"

import { ProcessesTable } from "../entity/[slug]/ProcessesTable"

type AllProcessesProps = {
  open: boolean
  onCountReady?: (count: number) => void
}

export function AllProcesses(props: AllProcessesProps) {
  const { open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <ProcessesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getProcesses(pageSize, lastRecord?.cursor, ascending)

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
